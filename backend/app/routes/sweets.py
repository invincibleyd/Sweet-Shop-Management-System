from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.sweet import Sweet
from app.schemas.sweet import SweetCreate, SweetUpdate
from app.auth.deps import get_db, get_current_user, admin_only

router = APIRouter(prefix="/api/sweets")

@router.get("")
def list_sweets(db: Session = Depends(get_db)):
    return db.query(Sweet).all()

@router.post("", dependencies=[Depends(get_current_user)])
def add_sweet(data: SweetCreate, db: Session = Depends(get_db)):
    sweet = Sweet(**data.dict())
    db.add(sweet)
    db.commit()
    return sweet

@router.put("/{id}", dependencies=[Depends(get_current_user)])
def update_sweet(id: int, data: SweetUpdate, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(id)
    for k, v in data.dict().items():
        setattr(sweet, k, v)
    db.commit()
    return sweet

@router.delete("/{id}", dependencies=[Depends(admin_only)])
def delete_sweet(id: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(id)
    db.delete(sweet)
    db.commit()
    return {"msg": "deleted"}

@router.post("/{id}/purchase", dependencies=[Depends(get_current_user)])
def purchase(id: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(id)
    if sweet.quantity <= 0:
        return {"error": "out of stock"}
    sweet.quantity -= 1
    db.commit()
    return sweet

@router.post("/{id}/restock", dependencies=[Depends(admin_only)])
def restock(id: int, qty: int, db: Session = Depends(get_db)):
    sweet = db.query(Sweet).get(id)
    sweet.quantity += qty
    db.commit()
    return sweet
