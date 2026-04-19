from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

# Point this to your RUNNING auth service login URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8000/login")

SECRET_KEY = "secret123" # Must match Auth Service
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Session expirée ou invalide")