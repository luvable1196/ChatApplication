from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Body
from app.schemas.user import UserCreate, UserOut,UserLogin
from app.services.auth_service import AuthService
from app.utils.security import create_access_token, verify_refresh_token, blacklist_token
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter()
auth_service = AuthService()

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await auth_service.get_user_by_email(user.email, db)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = await auth_service.create_user(user, db)
    return new_user

@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    user_data = await auth_service.authenticate_user(user.email, user.password, db)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=60*24*7)
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(token: str = Body(..., embed=True)):
    # Blacklist the token (if using Redis or DB for blacklisting)
    await blacklist_token(token)
    return {"detail": "Successfully logged out"}

@router.post("/token/refresh")
async def refresh_token(token: str = Body(..., embed=True)):
    # Verify the refresh token and issue a new access token
    payload = verify_refresh_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    access_token = create_access_token(data={"sub": payload["sub"]})
    return {"access_token": access_token, "token_type": "bearer"}