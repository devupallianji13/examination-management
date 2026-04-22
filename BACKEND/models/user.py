from typing import Optional
from datetime import datetime, timedelta
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    roll: str = Field(index=True, nullable=False)
    email: Optional[str] = None
    password_hash: Optional[str] = None
    role: str = Field(default="student")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    # OTP / verification
    otp_code: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    is_verified: bool = Field(default=False)
