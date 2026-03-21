from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any
from graph import SkillExtractor, generate_v2_pathway, PDFParser

app = FastAPI(title="ElevateAI Onboarding Engine V2.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    resume_text: str
    jd_text: str
    course_catalog: List[Dict[str, Any]]
    user_profile: Dict[str, Any] = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ElevateAI Onboarding Engine V3.0 (Winning Package) Running"}

@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    content = await file.read()
    text = PDFParser.extract_text(content)
    return {"text": text}

@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    # 1. Extract all skills mentioned in the catalog
    known_skills = list(set([c["target_skill"] for c in payload.course_catalog] + 
                           [p for c in payload.course_catalog for p in c.get("prerequisites", [])]))
    
    extractor = SkillExtractor(known_skills)
    
    # 2. Intelligent Parsing (LLM-Simulated)
    resume_profile = extractor.extract(payload.resume_text)
    jd_requirements = extractor.extract(payload.jd_text)
    
    # 3. Dynamic Mapping & Skill Gap Identification (Optimized)
    result = generate_v2_pathway(resume_profile, jd_requirements, payload.course_catalog, payload.user_profile)
    
    # Build XAI Trace Dashboard data
    response = {
        "intelligent_parsing": {
            "resume_profile": resume_profile,
            "jd_requirements": jd_requirements
        },
        "skill_gap_analysis": {
            "missing_competencies": [s for s, level in jd_requirements.items() if resume_profile.get(s, 0) < level],
            "confidence_scores": {s: (resume_profile.get(s, 0) / (jd_requirements.get(s, 2) or 2)) for s in jd_requirements}
        },
        "adaptive_learning_pathway": result["steps"],
        "optimization_metrics": result["metrics"]
    }
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
