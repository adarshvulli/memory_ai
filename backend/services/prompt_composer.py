# from typing import List, Dict
# from memory.session import SessionMemoryManager
# from services.retriever import query_user_knowledge
# from services.prompt_utils import summarize_kg_context

# # Use the shared session memory instance
# session_memory = SessionMemoryManager()

# def compose_prompt(session_id: str, user_query: str, user_name: str) -> List[Dict[str, str]]:

#     # 2. Retrieve relevant context from the knowledge graph
#     kg_context = query_user_knowledge(user_name, user_query)
#     system_prompt = summarize_kg_context(kg_context) if kg_context else "You are a helpful assistant."

#     # 3. Retrieve session memory messages
#     session_history = session_memory.get_context(session_id)

#     # 4. Add current query to session memory
#     session_memory.add_message(session_id, "user", user_query)

#     # 5. Build final message list
#     messages = [{"role": "system", "content": system_prompt}]
#     messages += session_history
#     messages.append({"role": "user", "content": user_query})

#     return messages


from typing import List, Dict
from memory.session import SessionMemoryManager
from services.retriever import query_user_knowledge
from services.prompt_utils import summarize_kg_context
from services.extractor_metadata import extract_metadata_from_query

# Use the shared session memory instance
session_memory = SessionMemoryManager()

def compose_prompt(session_id: str, user_query: str, user_name: str) -> List[Dict[str, str]]:
    # 1. Extract metadata from the current query
    metadata = extract_metadata_from_query(user_query)

    # 2. Retrieve relevant context from the knowledge graph
    # kg_context = query_user_knowledge(user_name, user_query)
    # system_prompt = summarize_kg_context(kg_context) if kg_context else "You are a helpful assistant."

    kg_context = {}
    if metadata.get("use_KG", True):
        try:
            kg_context = query_user_knowledge(user_name, user_query)
        except Exception as e:
            print(f"Error retrieving KG context: {e}")
            kg_context = {}
            
    if kg_context and any(kg_context.values()):
        system_prompt = summarize_kg_context(kg_context)
        system_prompt += "\n\nIMPORTANT: Only reference information from the user context above. If you don't have specific information about the user, ask for clarification rather than making assumptions."
    else:
        system_prompt = "You are a helpful assistant. Since I don't have specific information about the user yet, I'll ask questions to better understand their needs and preferences."

    # 3. Retrieve session memory messages
    session_history = session_memory.get_context(session_id)
    if len(session_history) > 10:
        session_history = session_history[-10:]

    # 4. Add current query to session memory
    session_memory.add_message(session_id, "user", user_query)

    # 5. Build final message list
    messages = [{"role": "system", "content": system_prompt}]

    if metadata:
        query_context = f"Query analysis: Intent={metadata.get('intent', 'unclear')}, Topic={metadata.get('topic', 'general')}"
        messages.append({"role": "system", "content": query_context})
    
    messages += session_history
    messages.append({"role": "user", "content": user_query})

    return messages