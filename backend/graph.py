import networkx as nx
import re
from typing import List, Dict, Any
from pypdf import PdfReader
import io

class PDFParser:
    """
    Extracts text from uploaded PDF files.
    """
    @staticmethod
    def extract_text(file_content: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            return f"Error parsing PDF: {str(e)}"

# --- ADVANCED SKILL ONTOLOGY (Knowledge Graph) ---
SKILL_GRAPH = {
    "python": {"level_required": 2, "deps": [], "difficulty": 1, "domain": "Software"},
    "javascript": {"level_required": 2, "deps": [], "difficulty": 1, "domain": "Software"},
    "data_structures": {"level_required": 3, "deps": ["python"], "difficulty": 2, "domain": "Software"},
    "web_dev": {"level_required": 2, "deps": ["javascript"], "difficulty": 2, "domain": "Software"},
    "react": {"level_required": 3, "deps": ["javascript", "web_dev"], "difficulty": 3, "domain": "Software"},
    "fastapi": {"level_required": 3, "deps": ["python", "web_dev"], "difficulty": 2, "domain": "Software"},
    "ml": {"level_required": 3, "deps": ["python", "statistics"], "difficulty": 4, "domain": "Software"},
    "statistics": {"level_required": 2, "deps": [], "difficulty": 2, "domain": "Data"},
    "deep_learning": {"level_required": 4, "deps": ["ml"], "difficulty": 5, "domain": "Software"},
    "deployment": {"level_required": 2, "deps": ["python", "fastapi"], "difficulty": 3, "domain": "Software"},
}

def propagate_levels(user_levels: Dict[str, int]) -> Dict[str, int]:
    """
    Recursively propagate skill levels through the graph.
    If a user knows ML, they likely have foundational python/stats.
    """
    propagated = user_levels.copy()
    changed = True
    while changed:
        changed = False
        for skill, data in SKILL_GRAPH.items():
            if skill not in propagated:
                # If there's a skill with dependencies, check if user has them
                deps = data.get("deps", [])
                if deps:
                    # Logic: Level is avg of deps - 1 (simulated regression)
                    avg_dep = sum(propagated.get(d, 0) for d in deps) / len(deps)
                    inferred = max(0, int(avg_dep) - 1)
                    if inferred > propagated.get(skill, 0):
                        propagated[skill] = inferred
                        changed = True
    return propagated

class SkillExtractor:
    """
    LLM-Powered Skill Extraction (Simulated for this implementation).
    In production, this calls OpenAI/VertexAI with a JSON schema.
    """
    def __init__(self, known_skills: List[str]):
        self.known_skills = known_skills

    def extract(self, text: str) -> Dict[str, int]:
        # SIMULATED LLM PROMPT OUTPUT
        # prompt = f"Extract skills from: {text}. Target: {self.known_skills}. Output JSON: {skill: level}"
        results = {}
        text_lower = text.lower()
        for skill in self.known_skills:
            if skill.lower() in text_lower:
                # Semantic matching logic (simulated)
                score = 2
                if any(x in text_lower for x in ["senior", "lead", "architect"]): score = 3
                if any(x in text_lower for x in ["junior", "intern"]): score = 1
                results[skill] = score
        
        # Apply propagation
        return propagate_levels(results)

def generate_v2_pathway(
    resume_skills: Dict[str, int], 
    jd_skills: Dict[str, int], 
    course_catalog: List[Dict[str, Any]],
    user_profile: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Generates an OPTIMIZED, PERSONALIZED learning pathway with XAI trace.
    """
    user_profile = user_profile or {"learning_speed": "normal", "time_available": 20}
    pathway = []
    scheduled_courses = set()
    total_time = 0
    
    # Adaptive Optimization logic
    # 1. Sort catalog by 'difficulty' and 'time' if possible
    # 2. Filter based on user profile
    
    def add_course_with_deps(skill_name, depth=0):
        if depth > 10: return
        
        course = next((c for c in course_catalog if c["target_skill"] == skill_name), None)
        if not course: return
        if course["course_title"] in scheduled_courses: return
            
        # Optimization: skip if learning_speed is 'fast' and user has level 2+
        if user_profile.get("learning_speed") == "fast" and resume_skills.get(skill_name, 0) >= 2:
            return

        # Check prerequisites
        for prereq in course.get("prerequisites", []):
            if resume_skills.get(prereq, 0) < 2:
                add_course_with_deps(prereq, depth + 1)
        
        # Calculate Confidence Score
        req_level = SKILL_GRAPH.get(skill_name, {}).get("level_required", 2)
        current_level = resume_skills.get(skill_name, 0)
        confidence = min(1.0, current_level / req_level)
        
        is_missing = current_level < jd_skills.get(skill_name, req_level)
        
        path_step = {
            "id": f"step-{len(pathway)+1}",
            "course_title": course["course_title"],
            "target_skill": skill_name,
            "status": "missing" if is_missing else "matched",
            "confidence": confidence,
            "time_estimate": course.get("duration", 5), # Hours
            "reasoning_trace": {
                "gap_score": jd_skills.get(skill_name, req_level) - current_level,
                "importance": "High" if depth == 0 else "Foundation",
                "dependency_status": "Satisfied" if depth == 0 else "Resolving",
                "explanation": f"Selected {skill_name} because you are at level {current_level} but {jd_skills.get(skill_name, req_level)} is required."
            }
        }
        
        pathway.append(path_step)
        scheduled_courses.add(course["course_title"])
        return course.get("duration", 5)

    for skill in jd_skills:
        time_added = add_course_with_deps(skill)
        if time_added: total_time += time_added
        
    # Evaluation Metrics
    raw_time = sum(c.get("duration", 5) for c in course_catalog if c["target_skill"] in jd_skills)
    optimized_time = total_time
    
    return {
        "steps": pathway,
        "metrics": {
            "total_time_hours": optimized_time,
            "time_reduction_percentage": round(((raw_time - optimized_time) / raw_time * 100), 1) if raw_time > 0 else 0,
            "optimization_strategy": "Minimum Time to Competency"
        }
    }
