# install.ps1
# Installation script for Windows (PowerShell)

Write-Host "Creating Python virtual environment in backend..."
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
cd ..

Write-Host "Installing Node.js dependencies in frontend..."
cd frontend
npm install
cd ..

Write-Host "Done. You can now start the backend and frontend manually."
Write-Host "To start backend: cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload"
Write-Host "To start frontend: cd frontend; npm run dev"