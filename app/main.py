from fastapi import FastAPI
from app.api import auth, users, rooms, messages, websocket
from app.core.database import init_db
import uvicorn

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)