import chromadb
from google import genai
import os
import uuid

CHROMA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'chroma_db')
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(name="patient_records")

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# C:\Users\karth\OneDrive\Desktop\KLH\patient-agent\backend\services\rag.py

def embed_text(query_text):
    # Change 'text-embedding-004' to 'gemini-embedding-001'
    result = gemini_client.models.embed_content(
        model="gemini-embedding-001", 
        contents=query_text
    )
    return result.embeddings[0].values
def add_patient_record(patient_id, record_text, metadata=None):
    embedding = embed_text(record_text)
    record_id = f"{patient_id}_{uuid.uuid4()}"
    collection.add(
        embeddings=[embedding],
        documents=[record_text],
        metadatas=[{"patient_id": patient_id, **(metadata or {})}],
        ids=[record_id]
    )

def retrieve_similar_records(patient_id, query_text, top_k=5):
    query_embedding = embed_text(query_text)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"patient_id": patient_id}
    )
    return results['documents'][0] if results['documents'] else []

def delete_patient_records(patient_id):
    all_ids = collection.get(where={"patient_id": patient_id})['ids']
    if all_ids:
        collection.delete(ids=all_ids)