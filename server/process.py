import os
import faiss
import pickle
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

DOCS_DIR = "docs"
INDEX_DIR = "faiss_index"

def load_docs():
    docs = []
    for file in os.listdir(DOCS_DIR):
        path = os.path.join(DOCS_DIR, file)
        if file.endswith(".pdf"):
            loader = PyPDFLoader(path)
        else:
            loader = TextLoader(path)
        docs.extend(loader.load())
    return docs

def main():
    docs = load_docs()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.from_documents(split_docs, embeddings)
    db.save_local(INDEX_DIR)
    print("✅ FAISS index saved!")

if __name__ == "__main__":
    main()
