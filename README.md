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

### Automatic Installation (Recommended)

You can use the included scripts to automate the installation of dependencies for both backend and frontend.

#### On Windows (PowerShell):

```powershell
./install.ps1
```

#### On Unix/Linux/Mac:

```bash
chmod +x install.sh
./install.sh
```

These scripts will create the Python virtual environment, install backend requirements, and install Node.js dependencies for the frontend.

After completion, follow the on-screen instructions to start the backend and frontend servers.

---

### Manual Installation

#### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Recommended) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

#### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

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
