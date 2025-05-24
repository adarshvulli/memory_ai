from fastapi import FastAPI
from routes import kg, kg_edit

app = FastAPI(title="Smart KG Backend")
app.include_router(kg.router, prefix="/kg")
app.include_router(kg_edit.router, prefix="/kg")
