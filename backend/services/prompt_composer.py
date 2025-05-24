from typing import List, Dict
from memory.session import SessionMemoryManager
from services.retriever import query_user_knowledge
from services.prompt_utils import summarize_kg_context

# Use the shared session memory instance
session_memory = SessionMemoryManager()

def compose_prompt(session_id: str, user_query: str, user_name: str) -> List[Dict[str, str]]:
    # 1. Extract metadata from the current query

    # 2. Retrieve relevant context from the knowledge graph
    kg_context = query_user_knowledge(user_name, user_query)
    system_prompt = summarize_kg_context(kg_context) if kg_context else "You are a helpful assistant."

    # 3. Retrieve session memory messages
    session_history = session_memory.get_context(session_id)

    # 4. Add current query to session memory
    session_memory.add_message(session_id, "user", user_query)

    # 5. Build final message list
    messages = [{"role": "system", "content": system_prompt}]
    messages += session_history
    messages.append({"role": "user", "content": user_query})

    return messages
