#!/bin/bash
# install.sh
# Script de instalación para Unix/Linux/Mac

echo "Creando entorno virtual de Python en backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "Instalando dependencias de Node.js en frontend..."
cd frontend
npm install
cd ..

echo "Listo. Puedes iniciar el backend y frontend manualmente."
echo "Para backend: cd backend; source venv/bin/activate; uvicorn app.main:app --reload"
echo "Para frontend: cd frontend; npm run dev"
