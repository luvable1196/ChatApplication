from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import UserService
from app.utils.security import get_current_user

router = APIRouter()

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, current_user: User = Depends(get_current_user)):
    user = await UserService.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    updated_user = await UserService.update_user(user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.get("/", response_model=list[User])
async def search_users(query: str):
    users = await UserService.search_users(query)
    return users