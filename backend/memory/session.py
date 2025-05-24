from collections import defaultdict, deque

class SessionMemoryManager:
    def __init__(self, max_turns: int = 6):
        self.max_turns = max_turns
        self.memory_store = defaultdict(lambda: deque(maxlen=max_turns * 2))

    def add_message(self, session_id: str, role: str, content: str):
        self.memory_store[session_id].append({"role": role, "content": content})

    def get_context(self, session_id: str):
        return list(self.memory_store[session_id])

    def clear_session(self, session_id: str):
        self.memory_store[session_id].clear()

session_memory = SessionMemoryManager()
