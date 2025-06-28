from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate
from app.core.database import get_db
from sqlalchemy.orm import Session

class MessageService:
    def __init__(self, db: Session):
        self.db = db

    def create_message(self, message: MessageCreate) -> Message:
        db_message = Message(**message.dict())
        self.db.add(db_message)
        self.db.commit()
        self.db.refresh(db_message)
        return db_message

    def get_message(self, message_id: str) -> Message:
        return self.db.query(Message).filter(Message.id == message_id).first()

    def update_message(self, message_id: str, message_update: MessageUpdate) -> Message:
        db_message = self.get_message(message_id)
        if db_message:
            for key, value in message_update.dict(exclude_unset=True).items():
                setattr(db_message, key, value)
            self.db.commit()
            self.db.refresh(db_message)
        return db_message

    def delete_message(self, message_id: str) -> bool:
        db_message = self.get_message(message_id)
        if db_message:
            self.db.delete(db_message)
            self.db.commit()
            return True
        return False

    def get_messages_by_room(self, room_id: str) -> list[Message]:
        return self.db.query(Message).filter(Message.room_id == room_id).all()