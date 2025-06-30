from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DashboardStats(BaseModel):
    total_rooms: int
    active_rooms: int
    total_messages: int
    online_users: int

class RecentActivity(BaseModel):
    id: int
    action: str
    time: str
    type: str
    user_name: Optional[str] = None

class RoomCreate(BaseModel):
    name: str
    description: Optional[str] = None
    user_ids: List[int]

class RoomResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    member_count: int
    last_message_at: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True

class CalendarEvent(BaseModel):
    id: int
    title: str
    date: datetime
    type: str  # meeting, deadline, event
    room_id: Optional[int] = None

class AvailableUser(BaseModel):
    id: int
    username: str
    email: str
    is_online: bool

    class Config:
        from_attributes = True