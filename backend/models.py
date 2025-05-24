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
