from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.security import hash_password, verify_password, create_token
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException
router = APIRouter(prefix="/api/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = User(username=data.username, password=hash_password(data.password))
    db.add(user)
    db.commit()
    return {"msg": "registered"}

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"id": user.id, "is_admin": user.is_admin})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

