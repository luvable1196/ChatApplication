from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

active_connections: dict[str, List[WebSocket]] = {}

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    if room_id not in active_connections:
        active_connections[room_id] = []
    active_connections[room_id].append(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            await broadcast(room_id, data)
    except WebSocketDisconnect:
        active_connections[room_id].remove(websocket)

async def broadcast(room_id: str, message: str):
    for connection in active_connections[room_id]:
        await connection.send_text(message)