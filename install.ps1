# install.ps1
# Script de instalación para Windows (PowerShell)

Write-Host "Creando entorno virtual de Python en backend..."
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
cd ..

Write-Host "Instalando dependencias de Node.js en frontend..."
cd frontend
npm install
cd ..

Write-Host "Listo. Puedes iniciar el backend y frontend manualmente."
Write-Host "Para backend: cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload"
Write-Host "Para frontend: cd frontend; npm run dev"
