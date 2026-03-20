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

class SkillExtractor:
    """
    Simulates intelligent parsing by extracting known skills from raw text.
    In a production app, this would use NLP/LLM.
    """
    def __init__(self, known_skills: List[str]):
        self.known_skills = known_skills

    def extract(self, text: str) -> Dict[str, int]:
        results = {}
        text_lower = text.lower()
        for skill in self.known_skills:
            # Simple keyword matching to simulate extraction
            if skill.lower() in text_lower:
                context = text_lower[max(0, text_lower.find(skill.lower()) - 20):text_lower.find(skill.lower()) + 20]
                if any(x in context for x in ["senior", "advanced", "expert", "lead"]):
                    results[skill] = 3
                elif any(x in context for x in ["junior", "beginner", "entry", "intern"]):
                    results[skill] = 1
                else:
                    results[skill] = 2
        return results

def generate_v2_pathway(
    resume_skills: Dict[str, int], 
    jd_skills: Dict[str, int], 
    course_catalog: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Generates a personalized learning roadmap grounded in the catalog with status info.
    """
    pathway = []
    scheduled_courses = set()
    
    # Identify target skills based on JD
    target_skills = list(jd_skills.keys())
    
    def add_course_with_deps(skill_name, depth=0):
        if depth > 10: return # Prevent cycles
        
        # Grounding: Find course in catalog
        course = next((c for c in course_catalog if c["target_skill"] == skill_name), None)
        if not course:
            return
            
        if course["course_title"] in scheduled_courses:
            return
            
        # Check prerequisites
        for prereq in course.get("prerequisites", []):
            if resume_skills.get(prereq, 0) < 2:
                add_course_with_deps(prereq, depth + 1)
        
        # Determine status
        is_missing = resume_skills.get(skill_name, 0) < jd_skills.get(skill_name, 1)
        
        # Add the course to pathway even if mastered? 
        # Actually, the user wants to see matched (green) and unmatched (red) in the graph.
        # We'll include all skills involved in the JD/Catalog for the graph.
        
        pathway.append({
            "step_order": len(pathway) + 1,
            "course_title": course["course_title"],
            "target_skill": skill_name,
            "status": "missing" if is_missing else "matched",
            "reasoning_trace": f"Skill [{skill_name}] is {'missing' if is_missing else 'already matched'} in the profile. Identified as a {'foundational' if depth > 0 else 'primary'} requirement."
        })
        scheduled_courses.add(course["course_title"])

    for skill in target_skills:
        add_course_with_deps(skill)
        
    return pathway
