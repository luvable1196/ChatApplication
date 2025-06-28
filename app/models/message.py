from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

class Message(BaseModel):
    id: str = None
    content: str
    sender_id: str
    room_id: str
    timestamp: datetime = datetime.utcnow()

    class Config:
        json_encoders = {
            ObjectId: str
        }