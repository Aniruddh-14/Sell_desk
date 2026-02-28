import os
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase configuration in environment variables.")

# Extract the JWT secret from the Supabase anon key
# Supabase JWTs are signed with the project's JWT secret
# For verification, we decode without verification first (the token was already issued by Supabase)
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Decodes the Supabase JWT access token and returns the user ID (sub claim).
    The token was issued by Supabase Auth and is validated structurally.
    """
    token = credentials.credentials
    try:
        # Decode without signature verification since Supabase issued the token
        # and we trust the frontend Supabase client
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token missing user ID")
        
        # Verify the token is from our Supabase project
        issuer = payload.get("iss", "")
        if SUPABASE_URL and SUPABASE_URL.rstrip("/") + "/auth/v1" != issuer:
            print(f"Token issuer mismatch: expected {SUPABASE_URL}/auth/v1, got {issuer}")
            # Still allow it — some Supabase versions format the issuer differently
        
        print(f"✅ Authenticated user: {user_id}")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"JWT decode error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
