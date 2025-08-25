from fastapi import FastAPI
from pydantic import BaseModel
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama  # you can swap with OpenAI if needed

INDEX_DIR = "faiss_index"

# Load FAISS
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = FAISS.load_local(INDEX_DIR, embeddings, allow_dangerous_deserialization=True)

retriever = db.as_retriever(search_kwargs={"k": 3})
llm = Ollama(model="llama3")  # Make sure `ollama` is running locally

qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

app = FastAPI()

class Question(BaseModel):
    query: str

@app.post("/chat")
def chat(q: Question):
    answer = qa.run(q.query)
    return {"answer": answer}
