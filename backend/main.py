from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, kg

app = FastAPI(title="Knowledge Graph Chat API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(kg.router, prefix="/kg", tags=["knowledge-graph"])

@app.get("/")
async def root():
    return {"message": "Welcome to Knowledge Graph Chat API"} 