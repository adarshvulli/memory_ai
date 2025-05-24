from pydantic import BaseModel
from typing import List, Optional

class KGInitRequest(BaseModel):
    user_name: str

class QueryInput(BaseModel):
    user_name: str
    user_query: str

class MessagePair(BaseModel):
    user_name: str
    assistant_msg: str
    user_msg: str

class SetMemoryTypeRequest(BaseModel):
    user: str
    memory_type: str
    window: Optional[int] = 5

class AddMessageRequest(BaseModel):
    user: str
    role: str  # 'human' or 'ai'
    content: str

class UserRequest(BaseModel):
    user: str