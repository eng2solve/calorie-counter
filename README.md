# Calorie Counter

This is the full-stack **Calorie Counter** application, with a FastAPI backend and a Vite + React + TypeScript frontend.  
You can sign up, log in, and fetch calorie & nutrition info for dishes.

---

## 🗂 Repository Structure

frontend/
├── .env
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.tsx
    ├── Footer.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    │   └── bg.jpg
    ├── components/
    │   ├── ResultCard.tsx
    │   ├── Spinner.tsx
    │   
    ├── lib/
    │   ├── api.ts
    │   └── utils.ts
    ├── pages/
    │   ├── GetCalories.tsx
    │   ├── Login.tsx
    │   └── Signup.tsx
    └── stores/
        └── authStore.ts

backend/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
├── run.py
├── app/
│   ├── __init__.py
│   ├── auth.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   |
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── calorie_routes.py
│   │   
│   └── utils/
│       ├── rate_limiter.py
│       ├── usda_client.py
│      
└── tests/
    └── test_api.py


- `backend/` – FastAPI server  
- `frontend/` – Vite + React frontend  
- `.env.example` in each side gives you a template to set up environment variables.

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (version 14+ recommended)  
- Python (version 3.8+ recommended)  
- Git  

---

### Clone
clone the project from the 
https://github.com/eng2solve/calorie-counter

### Backend and Frontend  Setup
Follow the README file 

