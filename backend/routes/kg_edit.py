from fastapi import APIRouter
from models import AddKGItem, UpdateKGItem, DeleteKGItem
from services.kg_crud import view_kg, add_kg_item, update_kg_item, delete_kg_item

router = APIRouter()

# View full KG for a user
@router.get("/view/{user_name}")
def get_user_kg(user_name: str):
    print(f"Fetching KG for user: {user_name}")
    return view_kg(user_name)

# Add new info to KG
@router.post("/add")
def add_item(request: AddKGItem):
    return add_kg_item(request.user_name, request.field, request.value)

# Update info in KG
@router.put("/update")
def update_item(request: UpdateKGItem):
    return update_kg_item(request.user_name, request.field, request.old_value, request.new_value)

# Delete info from KG
@router.delete("/delete")
def delete_item(request: DeleteKGItem):
    return delete_kg_item(request.user_name, request.field, request.value)
