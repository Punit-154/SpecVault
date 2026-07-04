from fastapi import APIRouter, HTTPException, status
from src.database import supabase
from src.models import SignupRequest, LoginRequest, AuthResponse, UserResponse
from src.middleware.auth import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest):
    try:
        result = supabase.auth.sign_up({"email": body.email, "password": body.password})
        if result.user is None:
            raise HTTPException(status_code=400, detail="Signup failed")

        # If email confirmation is required, session will be None
        # Try to auto-confirm by signing in (Supabase may allow this if confirmation is disabled)
        if result.session is None:
            try:
                login_result = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
                if login_result.session:
                    return AuthResponse(
                        access_token=login_result.session.access_token,
                        user_id=login_result.user.id,
                        email=login_result.user.email or "",
                    )
            except Exception:
                pass
            # If auto-login fails, tell user to confirm email
            raise HTTPException(
                status_code=400,
                detail="Account created. Please confirm your email before logging in, or disable email confirmation in Supabase dashboard."
            )

        return AuthResponse(
            access_token=result.session.access_token,
            user_id=result.user.id,
            email=result.user.email or "",
        )
    except HTTPException:
        raise
    except Exception as e:
        detail = str(e)
        if "already registered" in detail.lower():
            raise HTTPException(status_code=409, detail="Email already registered")
        raise HTTPException(status_code=400, detail=detail)


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest):
    try:
        result = supabase.auth.sign_in_with_password({"email": body.email, "password": body.password})
        if result.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return AuthResponse(
            access_token=result.session.access_token,
            user_id=result.user.id,
            email=result.user.email or "",
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()
        if "email not confirmed" in error_msg:
            raise HTTPException(status_code=401, detail="Email not confirmed. Check your inbox or disable email confirmation in Supabase.")
        if "invalid login credentials" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
def logout(user: dict = Depends(get_current_user)):
    try:
        supabase.auth.sign_out()
    except Exception:
        pass
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(id=user["id"], email=user["email"])
