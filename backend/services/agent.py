import json
import os
import sqlite3
from typing import TypedDict, List, Optional

from google import genai
from langgraph.graph import END, StateGraph
from langgraph.checkpoint.memory import MemorySaver

from backend.services.rag import retrieve_similar_records

# --------------------------------------------------------------
# 1. Initialize Gemini client (new SDK)
# --------------------------------------------------------------
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --------------------------------------------------------------
# 2. Define the agent's state
# --------------------------------------------------------------
class PatientState(TypedDict):
    patient_id: int
    messages: List[dict]
    current_message: str
    retrieved_context: List[str]
    symptoms: List[str]
    pain_level: Optional[int]
    risk: Optional[str]
    response: Optional[str]
    need_clarification: bool
    clarification_question: Optional[str]

# --------------------------------------------------------------
# 3. Node functions
# --------------------------------------------------------------
def retrieve_context(state: PatientState) -> PatientState:
    """Retrieve relevant patient records from Chroma."""
    pid = state["patient_id"]
    query = state["current_message"]
    state["retrieved_context"] = retrieve_similar_records(pid, query)
    return state

def parse_input(state: PatientState) -> PatientState:
    """Use Gemini to extract symptoms, pain level, and risk."""
    context = "\n".join(state["retrieved_context"])
    prompt = f"""
    Patient message: {state['current_message']}
    Relevant history: {context}
    Extract:
    - symptoms (list)
    - pain_level (0-10 or null)
    - risk (LOW/MEDIUM/HIGH)
    Return JSON.
    """
    response = gemini_client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )
    try:
        data = json.loads(response.text)
    except Exception:
        data = {"symptoms": [], "pain_level": None, "risk": "LOW"}

    state.update({
        "symptoms": data.get("symptoms", []),
        "pain_level": data.get("pain_level"),
        "risk": data.get("risk", "LOW"),
    })
    return state

def assess_risk(state: PatientState) -> PatientState:
    """Decide whether to ask for clarification."""
    vague = any(w in state["current_message"].lower() for w in ["not sure", "maybe", "a little"])
    if vague and not state["symptoms"] and state["risk"] != "HIGH":
        state["need_clarification"] = True
        state["clarification_question"] = "Can you describe your symptoms in more detail?"
    else:
        state["need_clarification"] = False
    return state

def generate_response(state: PatientState) -> PatientState:
    """Craft the final answer – dynamic for low/medium, static for high/clarification."""
    if state["need_clarification"]:
        # Static clarification question (can be made dynamic later)
        state["response"] = state["clarification_question"]
    elif state["risk"] == "HIGH":
        # Static urgent message (ensures clarity)
        state["response"] = (
            "I'm concerned. Please contact your doctor immediately or go to the ER. "
            "I've notified your care team."
        )
        # Create an alert in the SQLite database
        db = sqlite3.connect(os.getenv("DATABASE_PATH", "data/patients.db"))
        db.execute(
            "INSERT INTO alerts (patient_id, alert_type, reason) VALUES (?, ?, ?)",
            (state["patient_id"], "high_risk", state["current_message"]),
        )
        db.commit()
        db.close()
    else:
        # --- Dynamic response for LOW / MEDIUM risk ---
        # Build conversation history (last 3 exchanges)
        history_lines = []
        for m in state["messages"][-3:]:
            history_lines.append(f"User: {m['user']}")
            history_lines.append(f"Assistant: {m['assistant']}")
        history = "\n".join(history_lines)

        prompt = f"""
You are a caring medical assistant conducting a post‑surgery follow‑up.

Patient's last message: "{state['current_message']}"
Extracted symptoms: {state['symptoms']}
Pain level: {state['pain_level']}
Risk level: {state['risk']}

Recent conversation:
{history}

Respond empathetically and concisely. For LOW risk, reassure and remind to rest. For MEDIUM risk, advise monitoring and contacting a doctor if symptoms worsen. Do not include any JSON, just the response.
"""
        response = gemini_client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        state["response"] = response.text.strip()
    return state

def update_history(state: PatientState) -> PatientState:
    """Append the current exchange to the conversation history."""
    state["messages"].append({
        "user": state["current_message"],
        "assistant": state["response"]
    })
    return state

# --------------------------------------------------------------
# 4. Build the LangGraph
# --------------------------------------------------------------
builder = StateGraph(PatientState)
builder.add_node("retrieve", retrieve_context)
builder.add_node("parse", parse_input)
builder.add_node("assess", assess_risk)
builder.add_node("respond", generate_response)
builder.add_node("update", update_history)

builder.set_entry_point("retrieve")
builder.add_edge("retrieve", "parse")
builder.add_edge("parse", "assess")
builder.add_edge("assess", "respond")
builder.add_edge("respond", "update")
builder.add_edge("update", END)

# Use an in‑memory checkpointer to avoid async issues
checkpointer = MemorySaver()
agent_graph = builder.compile(checkpointer=checkpointer)

# --------------------------------------------------------------
# 5. Public function to run the agent
# --------------------------------------------------------------
def run_agent(patient_id: int, message: str) -> PatientState:
    """Invoke the agent for a given patient and message."""
    config = {"configurable": {"thread_id": str(patient_id)}}
    initial_state = {
        "patient_id": patient_id,
        "messages": [],
        "current_message": message,
        "retrieved_context": [],
        "symptoms": [],
        "pain_level": None,
        "risk": None,
        "response": None,
        "need_clarification": False,
        "clarification_question": None,
    }
    return agent_graph.invoke(initial_state, config=config)