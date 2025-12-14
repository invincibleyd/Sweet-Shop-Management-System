from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.auth.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user = db.query(User).filter(User.id == payload["id"]).first()
    if not user:
        raise HTTPException(status_code=401)
    return user

def admin_only(user=Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403)
    return user
