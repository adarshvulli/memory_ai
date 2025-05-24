from typing import List, Dict, Optional
from collections import deque

# Supported memory types
MEMORY_BUFFER = "buffer"
MEMORY_WINDOW = "window"
MEMORY_SUMMARY = "summary"

# In-memory store: {user/session: {type, window, messages, summary}}
session_store: Dict[str, Dict] = {}

# --- Memory Management Functions ---
def set_memory_type(user: str, memory_type: str, window: int = 5):
    if user not in session_store:
        session_store[user] = {}
    session_store[user]["type"] = memory_type
    session_store[user]["window"] = window
    session_store[user]["messages"] = deque(maxlen=window if memory_type == MEMORY_WINDOW else None)
    session_store[user]["summary"] = ""

def add_message(user: str, role: str, content: str):
    if user not in session_store:
        set_memory_type(user, MEMORY_BUFFER)
    memory_type = session_store[user]["type"]
    messages = session_store[user]["messages"]
    messages.append({"role": role, "content": content})
    if memory_type == MEMORY_SUMMARY:
        # Summarize if over window
        window = session_store[user]["window"]
        if len(messages) > window:
            # Simple summarizer: join and truncate
            summary = session_store[user]["summary"]
            summary += " " + " ".join([m["content"] for m in list(messages)[:-window]])
            session_store[user]["summary"] = summary.strip()
            # Keep only last 'window' messages
            session_store[user]["messages"] = deque(list(messages)[-window:], maxlen=window)

def get_memory(user: str) -> Dict:
    if user not in session_store:
        return {"messages": [], "summary": ""}
    memory_type = session_store[user]["type"]
    messages = list(session_store[user]["messages"])
    summary = session_store[user]["summary"]
    return {"type": memory_type, "messages": messages, "summary": summary}

def clear_memory(user: str):
    if user in session_store:
        del session_store[user]

def get_memory_type(user: str) -> str:
    return session_store.get(user, {}).get("type", MEMORY_BUFFER) 