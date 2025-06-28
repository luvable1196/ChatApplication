from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

class AuthService:
    async def authenticate_user(self, email: str, password: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    async def get_user_by_email(self, email: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def create_user(self, user: UserCreate, db: AsyncSession):
        hashed_pw = hash_password(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            display_name=user.display_name,
            avatar_url=str(user.avatar_url) if user.avatar_url else None,
            hashed_password=hashed_pw,
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt