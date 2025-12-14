from pydantic import BaseModel

class SweetCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetUpdate(SweetCreate):
    pass
