from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from model import Trainer
from database import Trainer_collection

router = APIRouter(prefix="/trainers", tags=["Trainers"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_trainer(trainer: Trainer):
    data = trainer.model_dump()

    # ✅ email normalize
    if "adminEmail" in data and data["adminEmail"]:
        data["adminEmail"] = data["adminEmail"].strip().lower()

    result = Trainer_collection.insert_one(data)

    return {
        "message": "Trainer added successfully",
        "id": str(result.inserted_id)
    }

@router.get("/")
def get_trainers():
    trainers = []
    for trainer in Trainer_collection.find():
        trainer["_id"] = str(trainer["_id"])
        trainers.append(trainer)
    return trainers

@router.get("/{email}")
def get_trainers_by_email(email: str):
    trainers = []

    # ✅ FIX 1: normalize email
    email = email.strip().lower()

    # ✅ FIX 2: case-insensitive search
    query = {
        "adminEmail": {
            "$regex": f"^{email}$",
            "$options": "i"
        }
    }

    for trainer in Trainer_collection.find(query):
        trainer["_id"] = str(trainer["_id"])
        trainers.append(trainer)

    return trainers

@router.put("/{trainer_id}")
def update_trainer(trainer_id: str, trainer: Trainer):
    result = Trainer_collection.update_one(
        {"_id": ObjectId(trainer_id)},
        {"$set": trainer.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Trainer not found")

    return {"message": "Trainer updated successfully"}

@router.delete("/{trainer_id}")
def delete_trainer(trainer_id: str):
    result = Trainer_collection.delete_one(
        {"_id": ObjectId(trainer_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trainer not found")

    return {"message": "Trainer deleted successfully"}