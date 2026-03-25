from fastapi import APIRouter, HTTPException
from model import StartupApplication
from database import profile_collection

router = APIRouter(prefix="/startup", tags=["Startups"])

@router.post("/")
def submit_startup(startup: StartupApplication):
    result = profile_collection.insert_one(startup.model_dump())
    return {"message": "Startup application submitted", "id": str(result.inserted_id)}

@router.get("/by-email/{email}")
def get_startup_by_email(email: str):
    startup = profile_collection.find_one({"email": email})
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    startup["_id"] = str(startup["_id"])
    return startup

@router.put("/")
def update_startup(data: StartupApplication):
    result = profile_collection.update_one(
        {"email": data.email},
        {"$set": data.model_dump(exclude_unset=True)}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Startup not found")

    return {"message": "Startup updated successfully"}

@router.delete("/{email}")
def delete_startup(email: str):
    result = profile_collection.delete_one({"email": email})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Startup not found")

    return {"message": "Startup deleted successfully"}
