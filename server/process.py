import os
import pickle
from pathlib import Path
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DOCS_DIR = "docs"
INDEX_DIR = "faiss_index"
CACHE_FILE = "docs_cache.pkl"

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
            # Add metadata to each document
            for doc in loaded_docs:
                doc.metadata["source"] = file
            docs.extend(loaded_docs)
            print(f"✅ Loaded {file} with {len(loaded_docs)} pages/chunks")
        except Exception as e:
            print(f"⚠️  Failed to load {file}: {e}")
    return docs

def main():
    # Optional caching to speed up repeated runs
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "rb") as f:
            docs = pickle.load(f)
        print(f"📦 Loaded {len(docs)} documents from cache")
    else:
        docs = load_docs()
        with open(CACHE_FILE, "wb") as f:
            pickle.dump(docs, f)

    # Split documents into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,        # larger chunks give more context
        chunk_overlap=150      # overlap to preserve context
    )
    split_docs = splitter.split_documents(docs)
    print(f"📄 Split into {len(split_docs)} chunks")

    # Generate embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.from_documents(split_docs, embeddings)
    db.save_local(INDEX_DIR)
    print(f"✅ FAISS index saved at '{INDEX_DIR}'")

if __name__ == "__main__":
    main()
