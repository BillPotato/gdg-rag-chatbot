# GDG RAG Chatbot

A study-focused AI chatbot that combines RAG + authentication + persistent chat history.

Ask questions about your course files, get concise answers from an OpenRouter model, and keep each user's chat history in Firestore.

## Why this project

- Retrieval over local docs with FAISS (`server/docs/`)
- FastAPI backend for chat APIs
- Next.js + Clerk frontend for secure sign-in
- Firestore-backed user chat history

## Quickstart

### 1. Add environment files

`server/.env`

```sh
OPENROUTER_API_KEY=your_key_here
MODEL=your_model_name
```

`client/.env.local`

```sh
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Also place your Firebase Admin credentials at `server/firebase_credentials.json`.

### 2. Index your docs

Put PDFs or text files in `server/docs/`, then run:

```bash
cd server
pip install -r requirements.txt
python process.py
```

### 3. Run backend

```bash
uvicorn app:app --reload
```

Backend: `http://localhost:8000`

### 4. Run frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Docker (optional)

```bash
docker compose -f docker-compose.dev.yml up --build
```

App via nginx: `http://localhost:8080`

## Heads up

- Re-run `python process.py` whenever docs change.
- Backend expects the FAISS index to exist before startup.

## TODOs

- Add automated deployment workflow
- Implement document upload system
