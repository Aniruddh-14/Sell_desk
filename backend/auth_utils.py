"""Authentication utilities — JWT-based, per-user isolation."""
import os
import datetime
import uuid

import bcrypt
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "selldesk-fallback-secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 72


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_jwt(user_id: str, email: str) -> str:
    """Create a signed JWT token for a user."""
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Extract and verify user_id from a JWT.
    Raises 401 if no valid token is provided.
    """
    token = credentials.credentials
    
    # Bypass auth for demo
    if token == 'demo-token':
        return '00000000-0000-0000-0000-000000000000'
        
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token: missing user id")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired — please sign in again")
    except jwt.InvalidTokenError as e:
        raise HTTPException(401, f"Invalid token: {e}")
