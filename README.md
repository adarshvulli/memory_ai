# 🧠 Memory AI – Your Personalized Knowledge Graph Assistant

## 🚀 Inspiration

We were inspired by a simple but powerful idea: *What if an AI could remember you—not just what you say, but who you are?*  
Traditional AI tools offer impressive responses but forget everything once the session ends. We wanted to build something deeper—an assistant that learns through conversation, remembers over time, and helps users understand themselves better. From that vision, **Memory AI** was born: the first personalized assistant that constructs a dynamic knowledge graph of your interests, skills, and traits.

---

## 💡 What it does

**Memory AI** is a graph-powered personalized assistant that:
- Builds a **dynamic knowledge graph** about you through natural conversation
- Tracks your **interests**, **skills**, **topics of expertise**, and **personality traits**
- Offers **context-aware** and **trait-aware** responses
- Lets you **view, edit, and manage** your knowledge profile
- Learns and evolves with every interaction—like a second brain

Whether you're chatting about hobbies or professional goals, Memory AI listens, understands, and builds your digital memory in real time.

---

## 🔧 How we built it

### 🖥️ Frontend
- **React + TypeScript + Vite** for a modern, performant UI
- **Tailwind CSS + shadcn/ui** for clean, responsive design
- **React Context API** for lightweight state management
- **Axios** for backend communication (REST + WebSocket ready)

### ⚙️ Backend
- **FastAPI** to serve RESTful APIs and manage session memory
- **Neo4j** as the persistent graph database for structured knowledge
- **OpenAI GPT-3.5-turbo** for intelligent, natural language responses
- **NLP pipeline** to extract traits and categorize them into graph nodes
- **In-memory session history** to maintain context during conversations

---

## 🚧 Challenges we ran into

- **Scope vs. personalization**: Keeping memory meaningful while managing complexity
- **Accurate trait extraction** from unstructured conversation using NLP
- **Mapping free-form chat to structured graph data** in Neo4j
- **UI design** that balanced utility, visibility, and clarity

---

## 🏆 Accomplishments that we're proud of

- Built a complete memory loop: from user input → NLP → graph → personalized response
- Live **Neo4j integration** with dynamic trait visualization and updates
- Developed a **visual knowledge dashboard** for managing memory
- Demonstrated **visible personalization**, not just hidden prompt injection

---

## 📚 What we learned

- Graph databases enable flexible and explainable personalization
- Subtle UX signals (e.g., remembering a user’s name) dramatically improve trust
- True personalization needs to be **transparent** and **user-editable**
- Real-time learning is most effective when **users feel in control**

---

## 🚀 What's next for Memory AI

- ✅ Integrate **Faiss** for vector-enhanced memory recall
- ✅ Support **multi-session history** and long-term memory persistence
- ✅ Add **model switcher** for use with local models (Ollama, Claude, Mistral)
- ✅ Enable **voice support** for hands-free interaction
- ✅ Provide **exportable knowledge graphs** for self-reflection or sharing
- ✅ Enhance graph UI with **analytical insights** into your digital self

**Our vision**: every person deserves an AI that truly knows them—not just one that responds to them.
