from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

class Schedule(BaseModel):
    day: str
    time: str
    title: str
    teacher: str
    group: str