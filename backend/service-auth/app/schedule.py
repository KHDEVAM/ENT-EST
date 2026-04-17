from fastapi import APIRouter, HTTPException
from app.database import fake_schedule_db
from app.models import Schedule

router = APIRouter(prefix="/api/schedule", tags=["Schedule"])


# =========================
# GET ALL SCHEDULES
# =========================
@router.get("/")
def get_all_schedules():
    return fake_schedule_db


# =========================
# GET BY GROUP
# =========================
@router.get("/group/{group_name}")
def get_schedule_by_group(group_name: str):

    result = [
        item for item in fake_schedule_db
        if item["group"] == group_name
    ]

    return result


# =========================
# CREATE SCHEDULE
# =========================
@router.post("/")
def create_schedule(item: Schedule):

    new_item = {
        "id": len(fake_schedule_db) + 1,
        "day": item.day,
        "time": item.time,
        "title": item.title,
        "teacher": item.teacher,
        "group": item.group
    }

    fake_schedule_db.append(new_item)

    return {
        "message": "Schedule created successfully",
        "data": new_item
    }


# =========================
# DELETE SCHEDULE
# =========================
@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int):

    global fake_schedule_db

    fake_schedule_db = [
        item for item in fake_schedule_db
        if item["id"] != schedule_id
    ]

    return {"message": "Schedule deleted successfully"}