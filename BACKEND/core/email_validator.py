import re
import os
import threading
import time
import random
from typing import Optional, Dict

from dotenv import load_dotenv

load_dotenv()

# Import SMTP sender. If a sender function is provided elsewhere, adjust the import.
try:
    # Try to import local send_otp_email if present
    from .send_email import send_otp_email  # optional local module
except Exception:
    # Fallback: define a local SMTP sender using env vars
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    GMAIL_EMAIL = os.getenv("GMAIL_EMAIL", "").strip()
    GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD", "").strip()

    def send_otp_email(recipient_email: str, otp: str, roll: Optional[str] = None) -> bool:
        """Send OTP to user's email via Gmail SMTP. Returns True on success.

        Accepts optional `roll` for including roll number in subject/body.
        """
        if not GMAIL_EMAIL or not GMAIL_PASSWORD:
            return False

        if roll:
            subject = f"Examination Management - Registration Verification OTP ({roll})"
        else:
            subject = "Examination Management - Registration Verification OTP"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #06b6d4; margin-bottom: 20px;">Registration Verification</h2>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        Complete your Examination Management account registration. Use the verification code below to verify your email address.
                    </p>
                    <div style="background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 15px; margin: 30px 0; border-radius: 5px;">
                        <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Your One-Time Password (OTP):</p>
                        <p style="font-size: 32px; font-weight: bold; color: #06b6d4; margin: 0; letter-spacing: 5px;">
                            {otp}
                        </p>
                    </div>
                    {f'<p style="color: #666; font-size: 12px; margin-bottom:10px;">Roll: {roll}</p>' if roll else ''}
                    <p style="color: #999; font-size: 12px; margin: 20px 0;">
                        ⏱️ This OTP is valid for <strong>10 minutes</strong> only. Do not share this code with anyone.
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 20px 0;">
                        If you didn't request account registration, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
                        © {time.localtime().tm_year} Examination Management System. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = GMAIL_EMAIL
        msg["To"] = recipient_email
        msg.attach(MIMEText(body, "html"))

        try:
            print(f"[email_validator] send_otp_email -> sending registration OTP to {recipient_email} (roll={roll})")
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
                server.sendmail(GMAIL_EMAIL, recipient_email, msg.as_string())
            print(f"[email_validator] send_otp_email -> sent successfully to {recipient_email}")
            return True
        except Exception as exc:
            print(f"[email_validator] send_otp_email -> failed to send to {recipient_email}: {exc}")
            return False


    def forgot_otp_email(recipient_email: str, otp: str, roll: Optional[str] = None) -> bool:
        """Send OTP for forgot-password flow. Returns True on success."""
        if not GMAIL_EMAIL or not GMAIL_PASSWORD:
            return False

        if roll:
            subject = f"Examination Management - Password Reset OTP ({roll})"
        else:
            subject = "Examination Management - Password Reset OTP"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #06b6d4; margin-bottom: 20px;">Password Reset Request</h2>
                    <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                        We received a request to reset your Examination Management account password. Use the code below to reset your password.
                    </p>
                    <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 5px;">
                        <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">Your One-Time Password (OTP):</p>
                        <p style="font-size: 32px; font-weight: bold; color: #f59e0b; margin: 0; letter-spacing: 5px;">
                            {otp}
                        </p>
                    </div>
                    <p style="color: #999; font-size: 12px; margin: 20px 0;">
                        ⏱️ This OTP is valid for <strong>10 minutes</strong> only. Do not share this code with anyone.
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 20px 0;">
                        If you didn't request a password reset, please ignore this email or contact support.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
                        © {time.localtime().tm_year} Examination Management System. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = GMAIL_EMAIL
        msg["To"] = recipient_email
        msg.attach(MIMEText(body, "html"))

        try:
            print(f"[email_validator] forgot_otp_email -> sending forgot-password OTP to {recipient_email} (roll={roll})")
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
                server.sendmail(GMAIL_EMAIL, recipient_email, msg.as_string())
            print(f"[email_validator] forgot_otp_email -> sent successfully to {recipient_email}")
            return True
        except Exception as exc:
            print(f"[email_validator] forgot_otp_email -> failed to send to {recipient_email}: {exc}")
            return False


# OTP storage: in-memory dict mapping email -> (otp, expiry_timestamp)
_otp_store: Dict[str, Dict[str, float]] = {}
_store_lock = threading.Lock()

# Settings
OTP_LENGTH = int(os.getenv("OTP_LENGTH", "6"))
OTP_TTL_SECONDS = int(os.getenv("OTP_TTL_SECONDS", "600"))  # 10 minutes default


def _cleanup_expired_otps() -> None:
    """Remove expired OTPs from the in-memory store. Runs periodically."""
    now = time.time()
    with _store_lock:
        expired = [email for email, data in _otp_store.items() if data["expiry"] <= now]
        for email in expired:
            del _otp_store[email]


def _start_cleanup_thread(interval: int = 60) -> None:
    def loop():
        while True:
            time.sleep(interval)
            _cleanup_expired_otps()

    t = threading.Thread(target=loop, daemon=True)
    t.start()


# Start cleanup background thread once
_start_cleanup_thread()


def _is_valid_email_format(email: str) -> bool:
    # Basic RFC 5322-ish regex (not perfect but sufficient for common validation)
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    return re.match(pattern, email) is not None


def _is_allowed_domain(email: str, allowed_domains: Optional[list] = None) -> bool:
    if not allowed_domains:
        return True
    domain = email.split("@")[-1].lower()
    return domain in [d.lower() for d in allowed_domains]


def _generate_otp(length: int = OTP_LENGTH) -> str:
    range_start = 10 ** (length - 1)
    range_end = (10 ** length) - 1
    return str(random.randint(range_start, range_end))


def request_otp(email: str, allowed_domains: Optional[list] = None) -> Dict[str, str]:
    """Request an OTP for the given email.

    Returns a dict with keys: `ok` ("true"/"false"), `message` and optionally `sent` (bool).
    """
    email = (email or "").strip()
    if not email:
        return {"ok": "false", "message": "Email is required."}

    if not _is_valid_email_format(email):
        return {"ok": "false", "message": "Invalid email format."}

    if not _is_allowed_domain(email, allowed_domains):
        return {"ok": "false", "message": "Email domain is not allowed."}

    otp = _generate_otp()
    expiry = time.time() + OTP_TTL_SECONDS

    # Store OTP
    with _store_lock:
        _otp_store[email.lower()] = {"otp": otp, "expiry": expiry}

    # Attempt to send email
    sent = False
    try:
        sent = send_otp_email(email, otp)
    except Exception:
        sent = False

    if sent:
        return {"ok": "true", "message": "OTP sent.", "sent": True}
    else:
        return {"ok": "false", "message": "Failed to send OTP (server side).", "sent": False}


def verify_otp(email: str, otp: str) -> Dict[str, str]:
    """Verify the OTP for the given email. Returns dict with `ok` and `message`.

    On success, the OTP is removed and `ok` is "true".
    """
    email = (email or "").strip().lower()
    otp = (otp or "").strip()
    if not email or not otp:
        return {"ok": "false", "message": "Email and OTP are required."}

    with _store_lock:
        data = _otp_store.get(email)
        if not data:
            return {"ok": "false", "message": "No OTP requested for this email or it expired."}

        if time.time() > data["expiry"]:
            # expired
            del _otp_store[email]
            return {"ok": "false", "message": "OTP expired."}

        if otp != data["otp"]:
            return {"ok": "false", "message": "Invalid OTP."}

        # Successful verification
        del _otp_store[email]
        return {"ok": "true", "message": "OTP verified."}


def get_pending_otp_info(email: str) -> Optional[Dict[str, float]]:
    """Return metadata for a pending OTP (expiry), or None if none exists."""
    with _store_lock:
        data = _otp_store.get((email or "").strip().lower())
        if not data:
            return None
        return {"expiry": data["expiry"], "ttl": max(0, int(data["expiry"] - time.time()))}


__all__ = [
    "request_otp",
    "verify_otp",
    "get_pending_otp_info",
]
