# 1. Imports and setup
import os
import pickle
from pathlib import Path

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Project directories
DOCS_DIR = "docs"            # Folder containing PDF/TXT files
INDEX_DIR = "faiss_index"    # Where we’ll save the FAISS index
CACHE_FILE = "docs_cache.pkl"  # Optional cache to avoid reprocessing

# 2. Document Loader
def load_docs():
    """Load PDFs and text files from DOCS_DIR with metadata."""
    docs = []
    for file in os.listdir(DOCS_DIR):
        path = os.path.join(DOCS_DIR, file)
        try:
            if file.lower().endswith(".pdf"):
                loader = PyPDFLoader(path)
            else:
                loader = TextLoader(path)

            loaded_docs = loader.load()

            # Add metadata (filename) to each document
            for doc in loaded_docs:
                doc.metadata["source"] = file

            docs.extend(loaded_docs)
            print(f"✅ Loaded {file} with {len(loaded_docs)} pages/chunks")

        except Exception as e:
            print(f"⚠️  Failed to load {file}: {e}")

    return docs

# 3. Main flow (caching, splitting, embedding, indexing)
def main():
    # --- Step 1: Load or cache documents ---
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "rb") as f:
            docs = pickle.load(f)
        print(f"📦 Loaded {len(docs)} documents from cache")
    else:
        docs = load_docs()
        with open(CACHE_FILE, "wb") as f:
            pickle.dump(docs, f)

    # --- Step 2: Split into smaller chunks ---
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,       # max characters per chunk
        chunk_overlap=150     # overlap to preserve context
    )
    split_docs = splitter.split_documents(docs)
    print(f"📄 Split into {len(split_docs)} chunks")

    # --- Step 3: Generate embeddings ---
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    db = FAISS.from_documents(split_docs, embeddings)

    # --- Step 4: Save index for retrieval later ---
    db.save_local(INDEX_DIR)
    print(f"✅ FAISS index saved at '{INDEX_DIR}'")

# 4. Run the script
if __name__ == "__main__":
    main()

