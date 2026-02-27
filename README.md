# 3D Word Cloud (TF-IDF + React + FastAPI)

This is a full-stack NLP project that:
- Takes text input
- Extracts important words using TF-IDF
- Displays them in an interactive 3D visualization

## Tech Stack
Backend: Python + FastAPI  
Frontend: React + Vite  
NLP: TF-IDF (Scikit-learn)

## How to Run

Backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend:
cd frontend
npm install
npm run dev
