# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built using Test-Driven Development (TDD).
The system supports authentication, role-based authorization, inventory management,
and a responsive frontend UI.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin / User)

### 🍭 Sweet Management
- View all sweets
- Search by name or category
- Purchase sweets
- Admin-only create, update, delete sweets

### 📦 Inventory
- Stock decreases on purchase
- Purchase disabled when stock is zero

### 🎨 Frontend
- React SPA (Vite)
- Responsive UI
- Admin-only UI controls
- Clean UX for login/register

---

## 🧪 Test-Driven Development (TDD)

This project follows the **Red–Green–Refactor** methodology:

1. **Red** – Write failing tests
2. **Green** – Implement minimal code to pass tests
3. **Refactor** – Improve structure and readability

### ✔ Covered Test Areas
- Authentication flows
- Authorization rules
- Inventory updates
- API validations

Tests are located at:

backend/app/tests/

Run tests:
```bash
pytest
```
### 🛠 Tech Stack
Backend

FastAPI

SQLite

SQLAlchemy

JWT Authentication

Pytest

Frontend

React (Vite)

Axios

Responsive CSS

### 🏃 Local Setup
Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL:
```bash
http://127.0.0.1:8000
```
Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend URL:
```bash
http://localhost:5173
```
### 👤 Admin Access

Admin privileges are controlled via the is_admin flag in the database.

Example (SQLite):
```bash
UPDATE users SET is_admin = 1 WHERE username = 'admin';
```
### 🤖 My AI Usage
Tools Used

ChatGPT

How AI Was Used

Boilerplate code generation

Writing unit tests

Debugging issues

UI/UX improvements

Reflection

AI helped accelerate development and improve code quality, but all logic,
architecture decisions, and refactoring were reviewed and implemented manually.

