from pydantic import BaseModel
from typing import Literal, Optional

FieldType = Literal["interest", "skill", "topic", "personality_trait"]

class KGInitRequest(BaseModel):
    user_name: str

class QueryInput(BaseModel):
    user_name: str
    user_query: str

class MessagePair(BaseModel):
    user_name: str
    assistant_msg: str
    user_msg: str

class AddKGItem(BaseModel):
    user_name: str
    field: FieldType
    value: str

class UpdateKGItem(BaseModel):
    user_name: str
    field: FieldType
    old_value: str
    new_value: str

class DeleteKGItem(BaseModel):
    user_name: str
    field: FieldType
    value: str

class ChatInput(BaseModel):
    session_id: str
    user_name: str
    user_input: str
