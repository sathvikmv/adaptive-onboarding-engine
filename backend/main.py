from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import networkx as nx
from typing import Dict
from graph import build_ontology_graph, analyze_gap, generate_learning_path

app = FastAPI(title="ElevateAI Adaptive Onboarding")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_skills: Dict[str, int]
    jd_skills: Dict[str, int]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ElevateAI Graph Engine Running"}

@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    ontology = build_ontology_graph()
    gaps = analyze_gap(payload.resume_skills, payload.jd_skills)
    
    if not gaps:
        return {"roadmap": [], "message": "No specific gaps. The user is ready for this role."}
        
    roadmap = generate_learning_path(gaps, ontology)
    
    response = {
        "status": "success",
        "total_gap_score": sum(g["gap_score"] for g in gaps.values()),
        "roadmap": roadmap
    }
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
