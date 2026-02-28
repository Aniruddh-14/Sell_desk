import os
import jwt
from fastapi import HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

security = HTTPBearer(auto_error=False)  # auto_error=False makes it optional


def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Optional[str]:
    """
    Optionally extract user_id from a Supabase JWT.
    If no token is provided, returns None (anonymous access).
    If a valid token is provided, returns the user_id.
    """
    if credentials is None:
        # No auth header — allow anonymous access
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        if user_id:
            print(f"✅ Authenticated user: {user_id}")
            return user_id
        # Token exists but no 'sub' claim (e.g., anon key) — treat as anonymous
        return None
    except Exception as e:
        print(f"⚠️ Token decode failed (allowing anonymous): {e}")
        return None
