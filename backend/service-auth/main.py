# main.py - Partie 1 : Les imports

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import os
from passlib.context import CryptContext
from jose import JWTError, jwt
from cassandra.cluster import Cluster
from cassandra.query import dict_factory
import httpx

# main.py - Partie 2 : Configuration

# Configuration JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "votre_secret_key_tres_longue_et_aleatoire_123456789")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

# Configuration Cassandra
CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "cassandra")
CASSANDRA_KEYSPACE = "ent_est"

# Configuration du hashage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialisation de FastAPI
app = FastAPI(title="Service Auth - ENT EST Salé")

# Configuration CORS (pour que le frontend puisse appeler ce service)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, mettez l'adresse de votre frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration du security bearer (pour récupérer le token)
security = HTTPBearer()

# Variable globale pour la session Cassandra
cassandra_session = None

# main.py - Partie 3 : Connexion à la base de données

@app.on_event("startup")
async def startup_event():
    """Au démarrage du service, on se connecte à Cassandra"""
    global cassandra_session
    
    try:
        cluster = Cluster([CASSANDRA_HOST])
        cassandra_session = cluster.connect()
        cassandra_session.row_factory = dict_factory
        
        # Créer le keyspace s'il n'existe pas
        cassandra_session.execute("""
            CREATE KEYSPACE IF NOT EXISTS ent_est 
            WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
        """)
        
        cassandra_session.set_keyspace(CASSANDRA_KEYSPACE)
        
        # Créer la table users si elle n'existe pas
        cassandra_session.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id UUID PRIMARY KEY,
                email TEXT,
                password_hash TEXT,
                full_name TEXT,
                role TEXT,
                created_at TIMESTAMP
            )
        """)
        
        print(f"✅ Connecté à Cassandra sur {CASSANDRA_HOST}")
        
    except Exception as e:
        print(f"❌ Erreur de connexion à Cassandra: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """À l'arrêt du service, on ferme la connexion"""
    global cassandra_session
    if cassandra_session:
        cassandra_session.shutdown()
        
    
# main.py - Partie 4 : Modèles Pydantic

class UserCreate(BaseModel):
    """Modèle pour créer un utilisateur"""
    email: str
    password: str
    full_name: str
    role: str = "etudiant"  # etudiant, professeur, admin

class UserLogin(BaseModel):
    """Modèle pour la connexion"""
    email: str
    password: str

class Token(BaseModel):
    """Modèle pour la réponse de connexion"""
    access_token: str
    token_type: str
    user_id: str
    email: str
    role: str
    full_name: str

class TokenData(BaseModel):
    """Modèle pour le contenu du token"""
    user_id: str
    email: str
    role: str

# main.py - Partie 5 : Fonctions utilitaires

def hash_password(password: str) -> str:
    """Hash un mot de passe"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Crée un token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Récupère l'utilisateur à partir du token JWT"""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role")
        
        if user_id is None:
            raise credentials_exception
        
        token_data = TokenData(user_id=user_id, email=email, role=role)
        
    except JWTError:
        raise credentials_exception
    
    # Vérifier que l'utilisateur existe toujours
    query = "SELECT * FROM users WHERE user_id = %s"
    result = cassandra_session.execute(query, (uuid.UUID(token_data.user_id),))
    user = result.one()
    
    if user is None:
        raise credentials_exception
    
    return user

# main.py - Partie 6 : Endpoints API

@app.get("/health")
async def health_check():
    """Vérifie que le service est vivant"""
    return {"status": "healthy", "service": "auth"}

@app.post("/register", response_model=Token)
async def register(user: UserCreate):
    """Inscription d'un nouvel utilisateur"""
    
    # Vérifier si l'email existe déjà
    query = "SELECT * FROM users WHERE email = %s ALLOW FILTERING"
    existing = cassandra_session.execute(query, (user.email,)).one()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Cet email est déjà utilisé"
        )
    
    # Créer l'utilisateur
    user_id = uuid.uuid4()
    hashed_password = hash_password(user.password)
    created_at = datetime.utcnow()
    
    query = """
        INSERT INTO users (user_id, email, password_hash, full_name, role, created_at)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    cassandra_session.execute(
        query,
        (user_id, user.email, hashed_password, user.full_name, user.role, created_at)
    )
    
    # Créer un token
    access_token = create_access_token(
        data={"sub": str(user_id), "email": user.email, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user_id),
        email=user.email,
        role=user.role,
        full_name=user.full_name
    )

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Connexion d'un utilisateur existant"""
    
    # Chercher l'utilisateur par email
    query = "SELECT * FROM users WHERE email = %s ALLOW FILTERING"
    result = cassandra_session.execute(query, (user.email,))
    db_user = result.one()
    
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier le mot de passe
    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Email ou mot de passe incorrect"
        )
    
    # Créer le token
    access_token = create_access_token(
        data={"sub": str(db_user["user_id"]), "email": db_user["email"], "role": db_user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=str(db_user["user_id"]),
        email=db_user["email"],
        role=db_user["role"],
        full_name=db_user["full_name"]
    )

@app.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur connecté"""
    return {
        "user_id": str(current_user["user_id"]),
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"],
        "created_at": str(current_user["created_at"])
    }

@app.post("/verify")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifie qu'un token est valide"""
    user = await get_current_user(credentials)
    return {
        "valid": True,
        "user_id": str(user["user_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    
# main.py - Partie 7 : Lancement (à la fin du fichier)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)    