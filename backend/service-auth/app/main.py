from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import jwt

from app.database import fake_users_db
from app.schedule import router as schedule_router

# ========== CONFIG ==========
app = FastAPI()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ========== TOKEN ==========
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ========== ROUTES ==========

@app.get("/")
def root():
    return {"message": "API running"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    user = fake_users_db.get(form_data.username)

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if form_data.password != user["password"]:
        raise HTTPException(status_code=400, detail="Wrong password")

    token = create_access_token({
        "sub": user["username"],
        "role": user.get("role", "user")
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/protected")
def protected(token: str):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Access granted", "user": payload.get("sub")}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/admin")
def admin_route(token: str):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admins only")

        return {"message": "Welcome Admin", "user": payload.get("sub")}

    except:
        raise HTTPException(status_code=401, detail="Invalid token")


# ========== INCLUDE ROUTERS ==========
app.include_router(schedule_router)


# ========== CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)