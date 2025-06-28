import pytest

# MongoDB
from pymongo import MongoClient

# Redis
import redis

MONGODB_URL = "mongodb://localhost:27017/chatdb"
REDIS_URL = "redis://localhost:6379/0"


def test_mongodb_connection():
    client = MongoClient(MONGODB_URL)
    db = client.get_database()
    # The 'list_collection_names' will fail if not connected
    collections = db.list_collection_names()
    assert isinstance(collections, list)

def test_redis_connection():
    r = redis.Redis.from_url(REDIS_URL)
    pong = r.ping()
    assert pong is True