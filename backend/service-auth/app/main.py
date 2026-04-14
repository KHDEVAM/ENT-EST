from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, Dict
import hashlib

# ========== CONFIGURATION ==========
app = FastAPI()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ========== HASHAGE SIMPLE (sans bcrypt) ==========
def hash_password(password: str) -> str:
    """Hashage simple avec SHA256 (pour tester)"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    """Vérification du mot de passe"""
    return hash_password(plain) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    import jwt
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ========== MODÈLE ==========
class User(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

# ========== BASE DONNÉES ==========
fake_users_db: Dict[str, dict] = {}

# ========== ENDPOINTS ==========

@app.get("/")
def root():
    return {"message": "Service Auth - ENT EST Salé"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/register")
def register(user: User):
    print(f"📝 Tentative inscription: {user.username}")
    
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed = hash_password(user.password)
    fake_users_db[user.username] = {
        "username": user.username,
        "password": hashed,
        "email": user.email,
        "full_name": user.full_name
    }
    
    print(f"✅ Utilisateur créé: {user.username}")
    print(f"📊 Base: {list(fake_users_db.keys())}")
    
    return {"message": "User created", "username": user.username}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"🔐 Tentative connexion: {form_data.username}")
    
    user = fake_users_db.get(form_data.username)
    
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password")
    
    token = create_access_token({"sub": user["username"]})
    
    print(f"✅ Connexion réussie: {form_data.username}")
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/protected")
def protected(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    import jwt
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Access granted", "user": payload.get("sub")}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ========== CORS ==========
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== LANCEMENT ==========
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)