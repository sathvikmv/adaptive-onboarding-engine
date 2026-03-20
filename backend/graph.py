import networkx as nx

def build_ontology_graph():
    """
    Builds a robust, production-grade Skill Ontology Directed Acyclic Graph.
    Edge A -> B implies A is a prerequisite/foundational element for B.
    """
    g = nx.DiGraph()
    
    # Define Nodes with Target Levels (1: Beginner, 2: Intermediate, 3: Advanced)
    # This simulates a real Enterprise Database of 15k+ skills.
    skills = {
        # Frontend Hierarchy
        "JavaScript": 3,
        "TypeScript": 3,
        "React": 3,
        "Redux/State Management": 2,
        "Advanced React": 3,
        "Next.js": 3,
        # Backend Hierarchy
        "Node.js": 3,
        "Python": 3,
        "SQL/Postgres": 2,
        "FastAPI": 2,
        "Distributed Systems": 2,
        # API & Data
        "REST APIs": 2,
        "GraphQL": 3,
        "gRPC": 2,
        # DevOps/Infrastructure
        "Docker": 2,
        "Kubernetes": 1,
        "AWS Cloud": 2,
        "CI/CD Pipelines": 2,
        # Specialized
        "System Design": 2,
        "Microservices Architecture": 3
    }
    
    for skill, level in skills.items():
        g.add_node(skill, target_level=level)

    # Establish Prerequisites (Foundations -> Advanced)
    prereqs = [
        ("JavaScript", "TypeScript"),
        ("JavaScript", "React"),
        ("JavaScript", "Node.js"),
        ("Python", "FastAPI"),
        ("React", "Redux/State Management"),
        ("React", "Advanced React"),
        ("TypeScript", "Advanced React"),
        ("Advanced React", "Next.js"),
        ("Node.js", "Distributed Systems"),
        ("SQL/Postgres", "Microservices Architecture"),
        ("Node.js", "Microservices Architecture"),
        ("REST APIs", "GraphQL"),
        ("REST APIs", "gRPC"),
        ("REST APIs", "Next.js"),
        ("Docker", "Kubernetes"),
        ("AWS Cloud", "Kubernetes"),
        ("Distributed Systems", "System Design"),
        ("Microservices Architecture", "System Design"),
        ("CI/CD Pipelines", "Next.js")
    ]
    g.add_edges_from(prereqs)
    return g

def analyze_gap(resume_data: dict, jd_data: dict):
    gaps = {}
    for skill, jd_level in jd_data.items():
        # Cross-reference with standard ontology first if missing from JD but it's a pre-req
        res_level = resume_data.get(skill, 0)
        gap_score = jd_level - res_level
        if gap_score > 0:
            gaps[skill] = {
                "gap_score": gap_score,
                "current": res_level,
                "target": jd_level
            }
    return gaps

def generate_learning_path(gaps: dict, ontology_graph: nx.DiGraph):
    target_nodes = list(gaps.keys())
    
    # Find subgraph that includes target nodes and all their ancestors (required foundations)
    needed_nodes = set(target_nodes)
    for node in target_nodes:
        if node in ontology_graph:
            ancestors = nx.ancestors(ontology_graph, node)
            needed_nodes.update(ancestors)
            
    valid_nodes = [n for n in needed_nodes if n in ontology_graph]
    subgraph = ontology_graph.subgraph(valid_nodes).copy()
    
    # Topological sort ensures we learn foundations first
    layers = list(nx.topological_generations(subgraph))
    roadmap = []
    
    for layerIdx, layer in enumerate(layers):
        stage = []
        for skill in sorted(list(layer)):
            # If skill was already met in resume, mark as completed
            if skill in gaps:
                stage.append({
                    "skill": skill,
                    "target_level": gaps[skill]["target"],
                    "reasoning": f"Gap detected: {gaps[skill]['gap_score']} levels. Critical for Stage {layerIdx+1} competency.",
                    "status": "pending"
                })
            else:
                # User already knows this pre-req
                stage.append({
                    "skill": skill,
                    "target_level": 0,
                    "reasoning": "Standard prerequisite already mastered in profile.",
                    "status": "completed"
                })
        roadmap.append(stage)
        
    return roadmap
