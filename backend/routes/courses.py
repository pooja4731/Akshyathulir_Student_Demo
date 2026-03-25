from fastapi import APIRouter, HTTPException
from bson import ObjectId
from model import Courses
from database import courses_collection

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/")
def create_course(course: Courses):
    result = courses_collection.insert_one(course.model_dump())
    return {"message": "Course added successfully", "id": str(result.inserted_id)}

@router.get("/{email}")
def get_courses(email: str):
    courses = []

    for course in courses_collection.find({"adminEmail": email}):
        course["_id"] = str(course["_id"])
        courses.append(course)

    return courses

@router.put("/{course_id}")
def update_course(course_id: str, course: Courses):
    result = courses_collection.update_one(
        {"_id": ObjectId(course_id)},
        {"$set": course.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"message": "Course updated successfully"}

@router.delete("/{course_id}")
def delete_course(course_id: str):
    result = courses_collection.delete_one(
        {"_id": ObjectId(course_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")

    return {"message": "Course deleted successfully"}
