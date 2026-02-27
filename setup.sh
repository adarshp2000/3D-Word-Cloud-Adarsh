#!/bin/bash

echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload &

echo "Setting up frontend..."
cd ../frontend
npm install
npm run dev
