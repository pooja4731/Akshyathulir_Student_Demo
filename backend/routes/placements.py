from fastapi import APIRouter
from model import Placement
from database import placement_collection

router = APIRouter(prefix="/placements", tags=["Placements"])

@router.post("/")
def create_placement(placement: Placement):
    result = placement_collection.insert_one(placement.model_dump())
    return {"message": "Placement added successfully", "id": str(result.inserted_id)}

@router.get("/{email}")
def get_placements(email: str):
    placements = []
    for placement in placement_collection.find({"adminEmail": email}):
        placement["_id"] = str(placement["_id"])
        placements.append(placement)
    return placements