from sqlalchemy.orm import Session
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomUpdate

class RoomService:
    def __init__(self, db: Session):
        self.db = db

    def create_room(self, room: RoomCreate) -> Room:
        db_room = Room(**room.dict())
        self.db.add(db_room)
        self.db.commit()
        self.db.refresh(db_room)
        return db_room

    def get_room(self, room_id: int) -> Room:
        return self.db.query(Room).filter(Room.id == room_id).first()

    def update_room(self, room_id: int, room_update: RoomUpdate) -> Room:
        db_room = self.get_room(room_id)
        if db_room:
            for key, value in room_update.dict(exclude_unset=True).items():
                setattr(db_room, key, value)
            self.db.commit()
            self.db.refresh(db_room)
        return db_room

    def delete_room(self, room_id: int) -> bool:
        db_room = self.get_room(room_id)
        if db_room:
            self.db.delete(db_room)
            self.db.commit()
            return True
        return False

    def list_rooms(self):
        return self.db.query(Room).all()