#!/bin/bash
# install.sh
# Installation script for Unix/Linux/Mac

echo "Creating Python virtual environment in backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "Installing Node.js dependencies in frontend..."
cd frontend
npm install
cd ..

echo "Done. You can now start the backend and frontend manually."
echo "To start backend: cd backend; source venv/bin/activate; uvicorn app.main:app --reload"
echo "To start frontend: cd frontend; npm run dev"