from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.models.user import User
from app.models.room import Room
from app.models.message import Message
from app.schemas.dashboard import (
    DashboardStats, 
    RecentActivity, 
    RoomCreate, 
    RoomResponse, 
    CalendarEvent, 
    AvailableUser
)

class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self, current_user: User) -> DashboardStats:
        """Get dashboard statistics for the current user"""
        try:
            # Get user's rooms
            user_rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id)
            ).all()
            
            # Calculate stats
            total_rooms = len(user_rooms)
            active_rooms = len([room for room in user_rooms if room.is_active])
            
            # Count messages in user's rooms
            total_messages = 0
            for room in user_rooms:
                total_messages += self.db.query(Message).filter(
                    Message.room_id == room.id
                ).count()
            
            # Count online users (assuming you have is_online field)
            online_users = self.db.query(User).filter(
                User.is_online == True
            ).count()
            
            return DashboardStats(
                total_rooms=total_rooms,
                active_rooms=active_rooms,
                total_messages=total_messages,
                online_users=online_users
            )
        except Exception as e:
            raise Exception(f"Error fetching dashboard stats: {str(e)}")

    def get_recent_activity(self, current_user: User, limit: int = 10) -> List[RecentActivity]:
        """Get recent user activities"""
        try:
            activities = []
            
            # Get recent messages from user's rooms
            user_rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id)
            ).all()
            room_ids = [room.id for room in user_rooms]
            
            if room_ids:
                recent_messages = self.db.query(Message).filter(
                    Message.room_id.in_(room_ids)
                ).order_by(Message.created_at.desc()).limit(limit).all()
                
                for msg in recent_messages:
                    time_ago = self._get_time_ago(msg.created_at)
                    activities.append(RecentActivity(
                        id=msg.id,
                        action=f"Message sent in {msg.room.name}",
                        time=time_ago,
                        type="message",
                        user_name=msg.user.username
                    ))
            
            # Get recent room joins
            recent_rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id)
            ).order_by(Room.created_at.desc()).limit(5).all()
            
            for room in recent_rooms:
                time_ago = self._get_time_ago(room.created_at)
                activities.append(RecentActivity(
                    id=room.id,
                    action=f"Joined room '{room.name}'",
                    time=time_ago,
                    type="room"
                ))
            
            # Sort by most recent and limit
            activities.sort(key=lambda x: x.time, reverse=True)
            return activities[:limit]
            
        except Exception as e:
            raise Exception(f"Error fetching recent activity: {str(e)}")

    def create_room(self, room_data: RoomCreate, current_user: User) -> RoomResponse:
        """Create a new room with selected users"""
        try:
            # Verify all user IDs exist
            users = self.db.query(User).filter(
                User.id.in_(room_data.user_ids)
            ).all()
            
            if len(users) != len(room_data.user_ids):
                raise ValueError("One or more user IDs are invalid")
            
            # Add current user to the room if not already included
            if current_user.id not in room_data.user_ids:
                room_data.user_ids.append(current_user.id)
                users.append(current_user)
            
            # Create room
            new_room = Room(
                name=room_data.name,
                description=room_data.description,
                created_by=current_user.id,
                created_at=datetime.utcnow(),
                is_active=True
            )
            
            # Add members
            new_room.members = users
            
            self.db.add(new_room)
            self.db.commit()
            self.db.refresh(new_room)
            
            return RoomResponse(
                id=new_room.id,
                name=new_room.name,
                description=new_room.description,
                created_at=new_room.created_at,
                member_count=len(users),
                last_message_at=None,
                is_active=True
            )
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error creating room: {str(e)}")

    def get_user_rooms(self, current_user: User) -> List[RoomResponse]:
        """Get all rooms for the current user"""
        try:
            rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id)
            ).all()
            
            room_responses = []
            for room in rooms:
                # Get last message time
                last_message = self.db.query(Message).filter(
                    Message.room_id == room.id
                ).order_by(Message.created_at.desc()).first()
                
                room_responses.append(RoomResponse(
                    id=room.id,
                    name=room.name,
                    description=room.description,
                    created_at=room.created_at,
                    member_count=len(room.members),
                    last_message_at=last_message.created_at if last_message else None,
                    is_active=room.is_active
                ))
            
            return room_responses
            
        except Exception as e:
            raise Exception(f"Error fetching rooms: {str(e)}")

    def get_room_history(self, current_user: User, limit: int = 50) -> List[RoomResponse]:
        """Get room history for the current user"""
        try:
            rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id)
            ).order_by(Room.created_at.desc()).limit(limit).all()
            
            room_responses = []
            for room in rooms:
                last_message = self.db.query(Message).filter(
                    Message.room_id == room.id
                ).order_by(Message.created_at.desc()).first()
                
                room_responses.append(RoomResponse(
                    id=room.id,
                    name=room.name,
                    description=room.description,
                    created_at=room.created_at,
                    member_count=len(room.members),
                    last_message_at=last_message.created_at if last_message else None,
                    is_active=room.is_active
                ))
            
            return room_responses
            
        except Exception as e:
            raise Exception(f"Error fetching room history: {str(e)}")

    def get_calendar_events(
        self, 
        current_user: User, 
        start_date: Optional[str] = None, 
        end_date: Optional[str] = None
    ) -> List[CalendarEvent]:
        """Get calendar events for the dashboard"""
        try:
            # Parse date range
            if start_date:
                start = datetime.fromisoformat(start_date)
            else:
                start = datetime.now().replace(day=1)  # Start of current month
            
            if end_date:
                end = datetime.fromisoformat(end_date)
            else:
                # End of current month
                next_month = start.replace(month=start.month + 1) if start.month < 12 else start.replace(year=start.year + 1, month=1)
                end = next_month - timedelta(days=1)
            
            events = []
            
            # Add room creation dates as events
            user_rooms = self.db.query(Room).filter(
                Room.members.any(id=current_user.id),
                Room.created_at >= start,
                Room.created_at <= end
            ).all()
            
            for room in user_rooms:
                events.append(CalendarEvent(
                    id=room.id,
                    title=f"Room '{room.name}' created",
                    date=room.created_at,
                    type="room",
                    room_id=room.id
                ))
            
            # Add message events (optional - for active days)
            messages = self.db.query(Message).join(Room).filter(
                Room.members.any(id=current_user.id),
                Message.created_at >= start,
                Message.created_at <= end
            ).all()
            
            # Group messages by date and create events for active days
            message_dates = {}
            for message in messages:
                date_key = message.created_at.date()
                if date_key not in message_dates:
                    message_dates[date_key] = 0
                message_dates[date_key] += 1
            
            for date, count in message_dates.items():
                if count > 5:  # Only show as event if more than 5 messages
                    events.append(CalendarEvent(
                        id=0,  # Special ID for message events
                        title=f"{count} messages sent",
                        date=datetime.combine(date, datetime.min.time()),
                        type="activity"
                    ))
            
            return events
            
        except Exception as e:
            raise Exception(f"Error fetching calendar events: {str(e)}")

    def get_available_users(self, current_user: User) -> List[AvailableUser]:
        """Get all available users for room creation"""
        try:
            users = self.db.query(User).filter(
                User.id != current_user.id
            ).all()
            
            return [
                AvailableUser(
                    id=user.id,
                    username=user.username,
                    email=user.email,
                    is_online=getattr(user, 'is_online', False)
                )
                for user in users
            ]
            
        except Exception as e:
            raise Exception(f"Error fetching available users: {str(e)}")

    def _get_time_ago(self, timestamp: datetime) -> str:
        """Helper function to get time ago string"""
        now = datetime.utcnow()
        diff = now - timestamp
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"