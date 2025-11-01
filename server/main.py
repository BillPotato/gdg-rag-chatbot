# 1. imports and setup
import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# LangChain imports
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore





# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(r"C:\Users\HP\Documents\Deadline-folder\test\gdg-rag-chatbot\server\gdgg-483b9-firebase-adminsdk-fbsvc-f874a91cd5.json")
    firebase_admin.initialize_app(cred)

fire_db = firestore.client()
# Disable HuggingFace tokenizers parallelism warning
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# 2. env variables
# Load environment variables from .env
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# Directories
DOCS_DIR = "docs"
INDEX_DIR = "faiss_index"

# 3. FAISS Vector DB Index Loader
def load_faiss_index():
    """Load the FAISS index with HuggingFace embeddings."""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = FAISS.load_local(INDEX_DIR, embeddings, allow_dangerous_deserialization=True)
    return db

# 4. LLM Setup
# Initialize LLM (through OpenRouter API)
llm = ChatOpenAI(
    model="meta-llama/llama-3.3-8b-instruct:free",
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": "http://localhost:3000",  # replace with your frontend URL
        "X-Title": "GDG-RAG App"
    }
)

# 5. prompt template
# Define a system prompt
system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, use your own knowledge. "
    "Use three sentences maximum and keep the answer concise."
    "\n\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# 6. create retrieval-augmented QA chain
# Load FAISS index
db = load_faiss_index()
retriever = db.as_retriever(search_kwargs={"k": 3})

# Create QA chain
question_answer_chain = create_stuff_documents_chain(llm, prompt)
qa_chain = create_retrieval_chain(retriever, question_answer_chain)

# 7. FastAPI app setup
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 8. API Routes
class Question(BaseModel):
    query: str

@app.post("/chat")
def chat(q: Question):
    """Answer a question using the retrieval-augmented QA chain."""
    response = qa_chain.invoke({"input": q.query})
    prompt_data = {
        "side": "user",
        "text": q.query,
        "timestamp": firestore.SERVER_TIMESTAMP
    }
    answer_data = {
        "side": "bot",
        "text": response["answer"],
        "timestamp": firestore.SERVER_TIMESTAMP
    }
    doc_ref = fire_db.collection("chats")
    doc_ref.add(prompt_data)
    doc_ref.add(answer_data)
    return {"answer": response["answer"]}



#Endpoint to get all chats 
@app.get("/chat")
def get_chats():
    """Retrieve all chat messages from Firestore."""
    chats = []
    docs = fire_db.collection("chats").order_by("timestamp").where("side", "==", "user").stream()
    for doc in docs:
        chat = doc.to_dict()
        chats.append(chat.get("text"))
    return {"chats": chats}
# 9. Run the app
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)