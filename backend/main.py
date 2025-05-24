from fastapi import FastAPI
from routes import kg, kg_edit

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Smart KG Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(kg.router, prefix="/kg")
app.include_router(kg_edit.router, prefix="/kg")
