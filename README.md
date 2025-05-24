# Knowledge Graph Chat Application

A modern chat application that uses knowledge graphs to maintain context and personalization in conversations. The application is built using a microservices architecture with FastAPI backend and React frontend.

## Architecture Overview

### Components

1. **Frontend (React + Material-UI)**
   - Split-pane interface with chat and knowledge graph editor
   - Real-time updates for both chat and knowledge graph
   - Modern UI with Material-UI components
   - Located in `frontend/` directory

2. **Backend (FastAPI)**
   - RESTful API endpoints for chat and knowledge graph operations
   - Located in `backend/` directory
   - Key components:
     - `main.py`: FastAPI application setup
     - `routers/`: API endpoint definitions
     - `services/`: Business logic and external service integrations
     - `utils/`: Helper functions and utilities

3. **Neo4j Database**
   - Graph database for storing knowledge triples
   - Accessible via Neo4j Browser at http://localhost:7474
   - Default credentials: neo4j/test

4. **ChromaDB**
   - Vector database for semantic search
   - Stores chat history and enables context-aware responses
   - Accessible at http://localhost:8000

### Directory Structure

```
memory_ai/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── services/
│   │   ├── neo4j_client.py
│   │   └── vector_client.py
│   ├── routers/
│   │   ├── chat.py
│   │   └── kg.py
│   └── utils/
│       └── extract_triples.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── App.js
        ├── components/
        │   ├── ChatPane.js
        │   └── MemoryEditor.js
        └── services/
            └── api.js
```

## API Endpoints

### Chat Endpoints
- `POST /chat`: Send a message and get a response
- `GET /chat/history`: Get chat history for a user

### Knowledge Graph Endpoints
- `GET /kg/{user_id}`: Get user's knowledge graph
- `POST /kg/{user_id}`: Add a new triple to the knowledge graph
- `DELETE /kg/{user_id}`: Delete a triple from the knowledge graph

## Setup and Installation

1. **Prerequisites**
   - Docker and Docker Compose
   - Node.js (for local frontend development)
   - Python 3.11+ (for local backend development)

2. **Running with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Accessing the Services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs
   - Neo4j Browser: http://localhost:7474
   - ChromaDB: http://localhost:8000

## Development

### Backend Development
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

### Frontend Development
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Features

1. **Chat Interface**
   - Real-time message exchange
   - Context-aware responses
   - Message history

2. **Knowledge Graph Editor**
   - Add/remove knowledge triples
   - Visual representation of relationships
   - Real-time updates

3. **Vector Search**
   - Semantic search capabilities
   - Context-aware responses
   - Memory retrieval

## Security

- CORS enabled for frontend-backend communication
- Environment variables for sensitive data
- Docker container isolation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
