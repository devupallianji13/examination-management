from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
from sqlmodel import Session, select

try:
	# when running from project root: `uvicorn BACKEND.main:app`
	from BACKEND.db import engine, create_db_and_tables, get_session
	from BACKEND.models import User
	from BACKEND.core.email_validator import send_otp_email
except Exception:
	# when running inside the BACKEND folder directly: `python -m uvicorn main:app`
	from db import engine, create_db_and_tables, get_session
	from models import User
	from core.email_validator import send_otp_email

app = FastAPI()

# CORS: allow frontend dev server
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
	create_db_and_tables()


class UserCreate(BaseModel):
	roll: str
	email: str | None = None
	password: str
	role: str | None = "student"
	otp: str | None = None


class LoginIn(BaseModel):
	roll: str
	password: str


class SendOtpIn(BaseModel):
	roll: str | None = None
	email: str | None = None


class VerifyOtpIn(BaseModel):
	roll: str
	otp: str


@app.get("/api/health")
def health():
	return {"status": "ok"}


@app.post("/api/auth/register")
def register(user: UserCreate):
	from passlib.context import CryptContext
	from datetime import datetime

	if not user.otp:
		raise HTTPException(status_code=400, detail="otp required")
	
	# Normalize inputs
	roll = (user.roll or "").strip()
	email = (user.email or "").strip().lower() if user.email else None
	
	if not roll:
		raise HTTPException(status_code=400, detail="roll is required")

	pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
	with Session(engine) as session:
		exists = session.exec(select(User).where(User.roll == roll)).first()
		if exists and exists.password_hash:
			raise HTTPException(status_code=400, detail="roll already exists")

		# find provisional record (created by send-otp) or create one
		u = session.exec(select(User).where(User.roll == roll)).first()
		if not u:
			u = User(roll=roll, email=email)
			session.add(u)
			session.commit()
			session.refresh(u)

		# verify otp
		if not u.otp_code or not u.otp_expires_at or datetime.utcnow() > u.otp_expires_at or u.otp_code != user.otp:
			raise HTTPException(status_code=400, detail="invalid or expired otp")

		u.password_hash = pwd_context.hash(user.password)
		u.email = email
		u.is_verified = True
		u.otp_code = None
		u.otp_expires_at = None
		u.role = user.role or "student"
		session.add(u)
		session.commit()
		session.refresh(u)
		return {"id": u.id, "roll": u.roll, "email": u.email, "role": u.role}


@app.post("/api/auth/send-otp")
def send_otp(payload: dict):
	"""Accept generic JSON payload and validate required fields manually.

	This avoids FastAPI returning 422 when the client sends slightly different shapes.
	Logs payload and chooses registration vs forgot helper based on presence of `roll`.
	Prevents duplicate OTP sends within 30 seconds.
	
	Logic:
	- If user already has password_hash → treat as forgot-password flow
	- If roll provided and no user exists → treat as registration flow
	- If only email provided → treat as forgot-password flow
	"""
	print(f"[main.send_otp] payload={payload}")
	import random
	from datetime import datetime, timedelta

	roll = payload.get("roll") if isinstance(payload, dict) else None
	email = payload.get("email") if isinstance(payload, dict) else None

	# Basic validation: require at least one of roll or email
	if (not roll or not isinstance(roll, str) or not roll.strip()) and (not email or not isinstance(email, str) or not email.strip()):
		raise HTTPException(status_code=400, detail="roll or email is required")
	
	# Normalize email and roll
	if email:
		email = email.strip().lower()
	if roll:
		roll = roll.strip()

	with Session(engine) as session:
		u = None
		is_registration_flow = False
		
		# Check if user exists by roll (if provided)
		if roll:
			u = session.exec(select(User).where(User.roll == roll)).first()
		
		# If not found by roll, try by email
		if not u and email:
			u = session.exec(select(User).where(User.email == email)).first()
		
		# Determine flow type:
		# - If user exists AND has password -> forgot password flow
		# - If user doesn't exist AND roll provided -> registration flow
		# - If only email provided -> forgot password flow
		
		if u and u.password_hash:
			# User is already registered -> forgot password flow
			is_registration_flow = False
			print(f"[main.send_otp] user found with password_hash -> treating as forgot-password flow")
		elif not u and roll and isinstance(roll, str) and roll.strip():
			# No user found, roll provided -> registration flow
			is_registration_flow = True
			print(f"[main.send_otp] no user found with roll, roll provided -> treating as registration flow")
			u = User(roll=roll, email=email)
			session.add(u)
			session.commit()
			session.refresh(u)
		elif not u and email:
			# No user found -> error, user must exist for forgot password
			raise HTTPException(status_code=400, detail="user not found for provided email")
		else:
			# No conditions met
			raise HTTPException(status_code=400, detail="invalid request")
		
		# Check if OTP was recently sent (within 30 seconds) to prevent duplicate sends
		if u.otp_expires_at and (datetime.utcnow() < u.otp_expires_at - timedelta(minutes=9, seconds=30)):
			flow_type = "registration" if is_registration_flow else "forgot-password"
			print(f"[main.send_otp] OTP recently sent to {email}, reusing existing OTP ({flow_type})")
			return {"message": "otp_sent"}

		# Generate new OTP only if not recently sent
		code = f"{random.randint(0, 999999):06d}"
		u.otp_code = code
		u.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
		session.add(u)
		session.commit()

		# send email using core helper; raise if SMTP not configured or send fails
		try:
			if is_registration_flow:
				# Registration flow -> use send_otp_email
				print(f"[main.send_otp] registration flow: sending registration OTP to {email} (roll={roll})")
				send_otp_email(email, code, roll)
			else:
				# Forgot-password flow -> use forgot_otp_email
				try:
					from BACKEND.core.email_validator import forgot_otp_email
				except Exception:
					from core.email_validator import forgot_otp_email
				print(f"[main.send_otp] forgot-password flow: sending forgot OTP to {email} (roll={u.roll})")
				forgot_otp_email(email, code, u.roll if u else None)
		except Exception as exc:
			raise HTTPException(status_code=500, detail=f"failed to send email: {exc}")

		return {"message": "otp_sent"}


@app.post("/api/auth/forgot")
def forgot(payload: dict):
	"""Start forgot-password flow: accept { rollOrEmail } and send a password-reset OTP to user's email."""
	from datetime import datetime, timedelta
	import random
	from passlib.context import CryptContext

	target = payload.get("rollOrEmail") if isinstance(payload, dict) else None
	if not target:
		raise HTTPException(status_code=400, detail="rollOrEmail is required")
	
	# Normalize target
	target = (target or "").strip()

	with Session(engine) as session:
		# try by roll first, then by email
		u = session.exec(select(User).where(User.roll == target)).first()
		if not u:
			u = session.exec(select(User).where(User.email == target.lower())).first()
		if not u:
			raise HTTPException(status_code=400, detail="user not found")

		# Check if OTP was recently sent (within 30 seconds) to prevent duplicate sends
		if u.otp_expires_at and (datetime.utcnow() < u.otp_expires_at - timedelta(minutes=9, seconds=30)):
			print(f"[main.forgot] OTP recently sent to {u.email}, reusing existing OTP")
			return {"message": "forgot_otp_sent"}

		code = f"{random.randint(0, 999999):06d}"
		u.otp_code = code
		u.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
		session.add(u)
		session.commit()

		# send forgot-password email
		try:
			from BACKEND.core.email_validator import forgot_otp_email
		except Exception:
			from core.email_validator import forgot_otp_email

		try:
			sent = forgot_otp_email(u.email or target, code, u.roll)
			if not sent:
				raise Exception("email not sent")
		except Exception as exc:
			raise HTTPException(status_code=500, detail=f"failed to send forgot email: {exc}")

	return {"message": "forgot_otp_sent"}


@app.post("/auth/worker/forgot-password")
@app.post("/api/auth/worker/forgot-password")
def worker_forgot(payload: dict):
	# payload: { email }
	email = payload.get("email") if isinstance(payload, dict) else None
	if not email:
		raise HTTPException(status_code=400, detail="email is required")
	
	# Normalize email
	email = (email or "").strip().lower()

	with Session(engine) as session:
		u = session.exec(select(User).where(User.email == email)).first()
		if not u:
			raise HTTPException(status_code=400, detail="user not found")
		
		# Check if OTP was recently sent (within 30 seconds) to prevent duplicate sends
		from datetime import datetime, timedelta
		if u.otp_expires_at and (datetime.utcnow() < u.otp_expires_at - timedelta(minutes=9, seconds=30)):
			print(f"[worker_forgot] OTP recently sent to {email}, reusing existing OTP")
			return {"message": "ok"}
		
		import random
		code = f"{random.randint(0, 999999):06d}"
		u.otp_code = code
		u.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
		session.add(u)
		session.commit()

		try:
			from BACKEND.core.email_validator import forgot_otp_email
		except Exception:
			from core.email_validator import forgot_otp_email

		try:
			sent = forgot_otp_email(u.email, code, u.roll)
			if not sent:
				raise Exception("email not sent")
		except Exception as exc:
			raise HTTPException(status_code=500, detail=f"failed to send forgot email: {exc}")

	return {"message": "ok"}


@app.post("/auth/worker/verify-otp")
@app.post("/api/auth/worker/verify-otp")
def worker_verify(payload: dict):
	# payload: { email, otp }
	email = payload.get("email") if isinstance(payload, dict) else None
	otp = payload.get("otp") if isinstance(payload, dict) else None
	from datetime import datetime
	
	if not email or not otp:
		raise HTTPException(status_code=400, detail="email and otp are required")
	
	# Normalize email and otp
	email = (email or "").strip().lower()
	otp = (otp or "").strip()
	
	with Session(engine) as session:
		u = session.exec(select(User).where(User.email == email)).first()
		if not u or not u.otp_code:
			raise HTTPException(status_code=400, detail="no otp pending")
		if not u.otp_expires_at or datetime.utcnow() > u.otp_expires_at:
			raise HTTPException(status_code=400, detail="otp expired")
		if u.otp_code != otp:
			raise HTTPException(status_code=400, detail="invalid otp")
		return {"message": "ok"}


@app.post("/auth/worker/reset-password")
@app.post("/api/auth/worker/reset-password")
def worker_reset(payload: dict):
	# payload: { email, otp, new_password }
	email = payload.get("email") if isinstance(payload, dict) else None
	otp = payload.get("otp") if isinstance(payload, dict) else None
	new_password = payload.get("new_password") if isinstance(payload, dict) else None
	from datetime import datetime
	
	if not email or not otp or not new_password:
		raise HTTPException(status_code=400, detail="email, otp and new_password are required")

	# Normalize email and otp
	email = (email or "").strip().lower()
	otp = (otp or "").strip()

	from passlib.context import CryptContext
	pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

	with Session(engine) as session:
		u = session.exec(select(User).where(User.email == email)).first()
		if not u or not u.otp_code:
			raise HTTPException(status_code=400, detail="no otp pending")
		if not u.otp_expires_at or datetime.utcnow() > u.otp_expires_at:
			raise HTTPException(status_code=400, detail="otp expired")
		if u.otp_code != otp:
			raise HTTPException(status_code=400, detail="invalid otp")

		u.password_hash = pwd_context.hash(new_password)
		u.otp_code = None
		u.otp_expires_at = None
		session.add(u)
		session.commit()

	return {"message": "password_reset"}


@app.post("/api/auth/verify-otp")
def verify_otp(payload: VerifyOtpIn):
	from datetime import datetime
	
	# Normalize inputs
	roll = (payload.roll or "").strip()
	otp = (payload.otp or "").strip()
	
	if not roll or not otp:
		raise HTTPException(status_code=400, detail="roll and otp are required")
	
	with Session(engine) as session:
		u = session.exec(select(User).where(User.roll == roll)).first()
		if not u or not u.otp_code:
			raise HTTPException(status_code=400, detail="no otp pending")
		if not u.otp_expires_at or datetime.utcnow() > u.otp_expires_at:
			raise HTTPException(status_code=400, detail="otp expired")
		if u.otp_code != otp:
			raise HTTPException(status_code=400, detail="invalid otp")
		u.is_verified = True
		u.otp_code = None
		u.otp_expires_at = None
		session.add(u)
		session.commit()
		return {"message": "verified"}


@app.post("/api/auth/login")
def login(payload: LoginIn):
	from passlib.context import CryptContext

	pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
	
	# Normalize roll
	roll = (payload.roll or "").strip()
	if not roll:
		raise HTTPException(status_code=401, detail="invalid credentials")
	
	with Session(engine) as session:
		u = session.exec(select(User).where(User.roll == roll)).first()
		if not u or not u.password_hash or not pwd_context.verify(payload.password, u.password_hash):
			raise HTTPException(status_code=401, detail="invalid credentials")
		return {"id": u.id, "roll": u.roll, "email": u.email, "role": u.role}


@app.get("/api/users")
def list_users():
	with Session(engine) as session:
		users = session.exec(select(User)).all()
		return [{"id": u.id, "roll": u.roll, "email": u.email, "role": u.role} for u in users]

