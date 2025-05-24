from fastapi import APIRouter
from models import KGInitRequest, QueryInput, MessagePair
from services.retriever import query_user_knowledge
from services.updater import update_kg
from neo4j_client import create_user_if_not_exists

router = APIRouter()

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
