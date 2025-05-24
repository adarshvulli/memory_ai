from fastapi import APIRouter
from models import KGInitRequest, MessagePair, ChatInput
from services.chat import generate_llm_response
from services.updater import update_kg
from neo4j_client import create_user_if_not_exists

router = APIRouter()

# --- KG Endpoints ---
@router.post("/init")
def initialize_user_kg(request: KGInitRequest):
    create_user_if_not_exists(request.user_name)
    return {"message": f"Knowledge graph initialized for {request.user_name}"}

@router.post("/chat")
def chat_with_prompt_composer(data: ChatInput):
    response = generate_llm_response(data.session_id, data.user_input, data.user_name)
    return {"response": response}

@router.post("/update")
def update_knowledge_graph(data: MessagePair):
    result = update_kg(data.user_name, data.assistant_msg, data.user_msg)
    return {"updated_metadata": result}




