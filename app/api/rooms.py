from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.room import RoomCreate, RoomUpdate, RoomOut
from app.services.room_service import RoomService
from app.core.database import get_db
from app.utils.security import get_current_user

router = APIRouter()

@router.post("/", response_model=RoomOut)
async def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return await RoomService.create_room(db=db, room=room)

@router.get("/{room_id}", response_model=RoomOut)
async def read_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    room = await RoomService.get_room(db=db, room_id=room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.put("/{room_id}", response_model=RoomOut)
async def update_room(
    room_id: int,
    room: RoomUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    updated_room = await RoomService.update_room(db=db, room_id=room_id, room=room)
    if updated_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return updated_room

@router.get("/", response_model=list[RoomOut])
async def list_rooms(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return await RoomService.get_rooms(db=db)

@router.delete("/{room_id}", response_model=dict)
async def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await RoomService.delete_room(db=db, room_id=room_id)
    if not result:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"detail": "Room deleted"}