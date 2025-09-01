# Stepwise - Hierarchical Task Management

A task management application that allows breaking down complex tasks into manageable subtasks using AI assistance.

## Features
- Hierarchical task trees with unlimited nesting
- AI-powered task splitting
- Inline notes and tips
- Real-time task completion tracking

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, Python
- **Development**: VS Code with GitHub Copilot

## Getting Started
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend  
cd frontend
npm install
npm start
```

## Project Structure
```
e:\Stepwise\
├── backend/
│   ├── requirements.txt
│   └── main.py (assumed)
├── frontend/
│   └── src/
│       └── components/
│           └── TaskTree.jsx
└── .github/
    └── copilot-instructions.md
```
