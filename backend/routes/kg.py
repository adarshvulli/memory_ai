from fastapi import APIRouter
from models import KGInitRequest, QueryInput, MessagePair, SetMemoryTypeRequest, AddMessageRequest, UserRequest
from services.retriever import query_user_knowledge
from services.updater import update_kg
from neo4j_client import create_user_if_not_exists
from services.session_memory import (
    set_memory_type, add_message, get_memory, clear_memory
)

# --- Session Memory Imports ---
from pydantic import BaseModel
from typing import Optional
router = APIRouter()

# --- KG Endpoints ---
@router.post("/init")
def initialize_user_kg(request: KGInitRequest):
    create_user_if_not_exists(request.user_name)
    return {"message": f"Knowledge graph initialized for {request.user_name}"}


@router.post("/query")
def get_knowledge_context(query: QueryInput):
    context = query_user_knowledge(query.user_name, query.user_query)
    return {"kg_context": context}

@router.post("/update")
def update_knowledge_graph(data: MessagePair):
    result = update_kg(data.user_name, data.assistant_msg, data.user_msg)
    return {"updated_metadata": result}

# --- Session Memory Models ---

# --- Session Memory Endpoints ---
@router.post("/set_memory_type")
def set_type(req: SetMemoryTypeRequest):
    set_memory_type(req.user, req.memory_type, req.window)
    return {"message": f"Memory type set to {req.memory_type} for {req.user}"}

@router.post("/add_message")
def add_msg(req: AddMessageRequest):
    add_message(req.user, req.role, req.content)
    return {"message": "Message added to memory."}

@router.post("/get_memory")
def get_mem(req: UserRequest):
    return get_memory(req.user)

@router.post("/clear_memory")
def clear_mem(req: UserRequest):
    clear_memory(req.user)
    return {"message": "Memory cleared."}
