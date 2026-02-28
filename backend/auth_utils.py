import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase configuration in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Validates the Supabase JWT access token and returns the user ID.
    Raises 401 Unauthorized if the token is invalid or missing.
    """
    token = credentials.credentials
    try:
        # We can use the supabase client to get the user from the JWT
        user_response = supabase.auth.get_user(token)
        if hasattr(user_response, 'user') and user_response.user:
            return user_response.user.id
        raise HTTPException(status_code=401, detail="Invalid auth token")
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
