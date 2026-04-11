from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.models import User
from app.database import fake_users_db
from app.auth import hash_password, verify_password, create_access_token
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# REGISTER
@app.post("/register")
def register(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists") 
    hashed = hash_password(user.password)
    fake_users_db[user.username] = {
        "username": user.username,
        "password": hashed
    }
    return {"message": "User created"}

# LOGIN (OAuth2 style)
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password")

    token = create_access_token({"sub": user["username"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# PROTECTED ROUTE
@app.get("/protected")
def protected(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return {"message": "Access granted"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    

