import json
from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from src.config import settings

security = HTTPBearer()

JWKS_URL = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
#this is an url to all the knows public keys that you might need to verify signature
HEADER = {"apikey": settings.supabase_key}
# HTTP header for authenticating the JWKS request 
# to Supabase (Supabase requires apikey on every request).


@lru_cache(maxsize=1)
def fetch_jwks() -> dict:
    response = httpx.get(JWKS_URL, headers=HEADER, timeout=10)
    response.raise_for_status()
    return response.json()
'''
so it essentially.....when we call fetch_jwks it return an json 
that stored in a cache of size 1?and when we call it again it 
returns that same value from cache direclty instead of going to http and getting?
'''

def get_signing_key(token: str) -> dict:
    jwks = fetch_jwks()
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")

    for key in jwks.get("keys", []):
        if key["kid"] == kid:
            return key

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unable to find matching signing key",
    )
'''
the token itself carries a little tag saying "I was signed using key #X." 
The function reads that tag (kid from the header), 
then walks through every key Auth0 currently publishes 
and asks "do any of you have ID #X?"
'''

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        signing_key = get_signing_key(token)
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["ES256", "RS256", "HS256"],
            audience="authenticated",
        )
        user_id: str | None = payload.get("sub")
        email: str | None = payload.get("email")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
            )
        return {"id": user_id, "email": email or ""}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
