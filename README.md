# Login App

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License"/>
</p>

## Overview

Login App is a full-stack authentication system featuring a modern React frontend and a FastAPI backend. It allows users to register, log in, and manage their sessions securely. The project is designed for easy deployment and extensibility, following best practices for security and code organization.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User registration
- JWT-based authentication and session management
- Responsive and modern UI
- Secure password hashing
- Modular and scalable codebase

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** FastAPI, Python
- **Database:** SQLite (can be replaced with PostgreSQL, MySQL, etc.)

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Python >= 3.9
- pip

## Installation

### Instalación automática (recomendada)

Puedes usar los scripts incluidos para automatizar la instalación de dependencias tanto del backend como del frontend.

#### En Windows (PowerShell):

```powershell
./install.ps1
```

#### En Unix/Linux/Mac:

```bash
chmod +x install.sh
./install.sh
```

Estos scripts crearán el entorno virtual de Python, instalarán los requirements del backend y las dependencias de Node.js en el frontend.

Al finalizar, sigue las instrucciones que aparecen en pantalla para arrancar el backend y el frontend.

---

### Instalación manual

#### Backend Setup

1. Navega al directorio `backend`:
   ```bash
   cd backend
   ```
2. (Recomendado) Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   # En Windows
   venv\Scripts\activate
   # En Mac/Linux
   source venv/bin/activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicia el servidor FastAPI:
   ```bash
   uvicorn app.main:app --reload
   ```
   El backend estará disponible en `http://localhost:8000`.

#### Frontend Setup

1. Navega al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la app de React:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`.

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. Register a new user or log in with your credentials.
3. Explore the app's features.

## Project Structure

```
backend/
  app/
    auth.py
    database.py
    main.py
    models.py
    schemas.py
  requirements.txt
frontend/
  src/
    api.js
    App.jsx
    components/
      Login.jsx
      Register.jsx
  package.json
  vite.config.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for suggestions or improvements.

## License

This project is licensed under the MIT License.

## Contact

For questions, feedback, or business inquiries, please contact:

- **Project Maintainer:** [Your Name](mailto:your.email@example.com)
- **GitHub Issues:** [Open an issue](https://github.com/yourusername/your-repo/issues)
