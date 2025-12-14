from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Sweet(Base):
    __tablename__ = "sweets"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
