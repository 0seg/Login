# 🔐 Login — Aplicación de Autenticación (Frontend + Backend)

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&style=flat-square" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&style=flat-square" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&style=flat-square" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&style=flat-square" alt="Vite"/>
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="Licencia MIT"/>
</p>

---

## Descripción breve (mi proyecto)

Esta es mi versión personal de una app de autenticación full‑stack. La hice para mi portafolio y para tener un proyecto real que muestre cómo conecto frontend y backend, cómo manejo sesiones y cómo resuelvo flujos clave como registro, login y recuperación de contraseña.

En pocas palabras:

- Frontend en React + TypeScript con un cliente API que renueva tokens automáticamente.
- Backend en FastAPI con código modular (auth, modelos, esquemas).
- Seguridad práctica: contraseñas hasheadas con `bcrypt`, JWTs (access + refresh).
- Flujo de reseteo pensado para desarrollo: el token se imprime en consola y aparece en un toast para pruebas rápidas.

## Principales funcionalidades

- Registro, inicio de sesión y cierre de sesión (JWT)
- Renovación de `accessToken` mediante `refreshToken` (sesiones persistentes)
- Recuperación y reseteo de contraseña con token de un solo uso (flujo dev)
- Edición de perfil y cambio de contraseña desde la UI
- Rate limiting básico para intentos de login (implementación in-memory para demo)
- Notificaciones tipo toast y validación de formularios en el frontend

## Stack tecnológico

- Frontend: React, TypeScript, Vite
- Backend: FastAPI, Python, SQLAlchemy
- Hashing: bcrypt (contraseñas)
- Base de datos (dev): SQLite (configurable)

## Requisitos

- Node.js (recomendado >= 20)
- npm
- Python 3.10+

## Inicio rápido (desarrollo)

1. Instalar dependencias (backend)

PowerShell:

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
```

Unix/macOS:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Ejecutar backend (por defecto en http://localhost:8000)

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

3. Instalar y arrancar frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Endpoints principales

- `POST /register` — crear usuario
- `POST /login` — iniciar sesión (devuelve accessToken + refreshToken)
- `POST /refresh` — obtener nuevo accessToken usando refreshToken
- `GET /me` — obtener datos del usuario autenticado
- `POST /forgot-password` — solicitar token de recuperación (dev: token mostrado en consola/toast)
- `POST /reset-password` — resetear contraseña con token

## Estructura de carpetas (resumen)

```
Login/
├─ backend/
│  └─ app/ (auth.py, main.py, models.py, schemas.py, database.py)
├─ frontend/
│  └─ src/ (components, hooks, api.ts, App.tsx)
└─ README.md
```

## Capturas

Incluye imágenes en `./screenshots/` para mostrar la UI (login, registro, dashboard, settings).

## Licencia

Licencia MIT — ver archivo `LICENSE`.
