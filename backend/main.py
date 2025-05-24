from fastapi import FastAPI
from routes import kg

app = FastAPI(title="Smart KG Backend")
app.include_router(kg.router, prefix="/kg")
