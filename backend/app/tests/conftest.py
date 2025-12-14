import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.auth.security import create_token

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def admin_token(db):
    admin = User(username="admin", password="admin123", is_admin=True)
    db.add(admin)
    db.commit()
    return create_token({"sub": admin.username, "is_admin": True})

@pytest.fixture
def user_token(db):
    user = User(username="user", password="user123", is_admin=False)
    db.add(user)
    db.commit()
    return create_token({"sub": user.username, "is_admin": False})
