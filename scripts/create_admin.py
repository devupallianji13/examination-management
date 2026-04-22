"""
Create an admin user in the app database.
Run from the project root with the venv activated, e.g.

powershell:
    python scripts/create_admin.py --roll admin999 --password admin123 --email admin@example.com

This script imports the app models and engine, ensures tables exist, then inserts the user.
"""
import argparse
import os
import sys

from passlib.context import CryptContext

# Ensure project root is on sys.path when run from repo root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

try:
    from BACKEND.models import User
    from BACKEND.db import engine, create_db_and_tables
    from sqlmodel import Session
except Exception as e:
    print("Failed to import application modules:", e)
    sys.exit(1)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def create_admin(roll: str, password: str, email: str | None, role: str = "admin"):
    create_db_and_tables()
    password_hash = pwd_context.hash(password)
    user = User(roll=roll, email=email, password_hash=password_hash, role=role)
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
    return user


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an admin user in the app DB")
    parser.add_argument("--roll", required=True, help="Roll (username) for admin")
    parser.add_argument("--password", required=True, help="Password for admin")
    parser.add_argument("--email", default=None, help="Email for admin")
    args = parser.parse_args()

    try:
        user = create_admin(args.roll, args.password, args.email)
    except Exception as exc:
        print("Failed to create admin:", exc)
        sys.exit(2)

    print(f"Created admin user: id={user.id}, roll={user.roll}, email={user.email}")
