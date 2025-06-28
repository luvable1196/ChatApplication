from fastapi import APIRouter, HTTPException, Depends
from app.schemas.message import MessageCreate, MessageUpdate, MessageResponse
from app.services.message_service import MessageService
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=MessageResponse)
async def send_message(message: MessageCreate, db=Depends(get_db)):
    return await MessageService.send_message(message, db)

@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(message_id: str, db=Depends(get_db)):
    message = await MessageService.get_message(message_id, db)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.put("/{message_id}", response_model=MessageResponse)
async def update_message(message_id: str, message: MessageUpdate, db=Depends(get_db)):
    updated_message = await MessageService.update_message(message_id, message, db)
    if not updated_message:
        raise HTTPException(status_code=404, detail="Message not found")
    return updated_message

@router.delete("/{message_id}", response_model=dict)
async def delete_message(message_id: str, db=Depends(get_db)):
    result = await MessageService.delete_message(message_id, db)
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"detail": "Message deleted successfully"}