# RAG AI Chatbot for Course Document Study

This project is a Retrieval-Augmented Generation (RAG) AI chatbot designed to help students study by uploading and querying course documents. Users can upload PDFs or other course materials, which are then processed and indexed for efficient retrieval and question answering.

## Features

- **Document Upload & Processing:** Upload course documents (PDFs) to the backend for indexing.
- **Semantic Search:** Uses FAISS for fast document retrieval.
- **AI Chatbot:** Ask questions about your uploaded documents and get context-aware answers.
- **Modern Web UI:** Built with Next.js for a responsive and user-friendly experience.

## Project Structure

```
client/   # Frontend (Next.js)
server/   # Backend (Python FastAPI, FAISS, document processing)
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd gdg-rag
```

### 2. Backend Setup (Python)

1. **Install dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```
2. **Process documents:**
   - Place your course PDFs in `server/docs/`.
   - Run the following to index documents:
     ```bash
     python process.py
     ```
3. **Start the backend server:**
   ```bash
   uvicorn app:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

1. **Install dependencies:**
   ```bash
   cd ../client
   npm install
   ```
2. **Start the frontend server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## Usage

- Upload your course documents via the backend or place them in `server/docs/` and re-run `python process.py`.
- Ask questions in the web UI about your uploaded documents.
- The chatbot will retrieve relevant information and generate answers using the indexed content.

## Notes

- Ensure both frontend and backend servers are running for full functionality.
- Re-run `python process.py` whenever you add new documents to `server/docs/`.
- The FAISS index and cache are stored in `server/faiss_index/` and `server/docs_cache.pkl`.

## Requirements

- Python 3.8+
- Node.js 18+

## License

MIT
