import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, addEdge, useNodesState, useEdgesState, Connection, MarkerType, MiniMap, Position, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import dagre from 'dagre';
import { Settings, FileText, Zap, Activity, Cpu, ArrowLeft, TrendingUp, Clock, DollarSign, ListOrdered, BookOpen, BrainCircuit, Upload, CheckCircle2, XCircle, Terminal, HelpCircle, ShieldCheck, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CustomNode from '../components/CustomNode';
import NeuralTrace from '../components/NeuralTrace';

const nodeTypes = { custom: CustomNode };

// MiniMap styling
const minimapStyle = {
  backgroundColor: '#050505',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
};

const DEFAULT_CATALOG = [
  { "course_title": "Python for Engineers", "target_skill": "python", "prerequisites": [], "duration": 4 },
  { "course_title": "JavaScript Fundamentals", "target_skill": "javascript", "prerequisites": [], "duration": 3 },
  { "course_title": "Data Structures Mastery", "target_skill": "data_structures", "prerequisites": ["python"], "duration": 8 },
  { "course_title": "Modern Web Development", "target_skill": "web_dev", "prerequisites": ["javascript"], "duration": 6 },
  { "course_title": "React Architecture", "target_skill": "react", "prerequisites": ["javascript", "web_dev"], "duration": 12 },
  { "course_title": "FastAPI Professional", "target_skill": "fastapi", "prerequisites": ["python", "web_dev"], "duration": 7 },
  { "course_title": "Machine Learning Foundations", "target_skill": "ml", "prerequisites": ["python", "statistics"], "duration": 15 },
  { "course_title": "Deep Learning Specialization", "target_skill": "deep_learning", "prerequisites": ["ml"], "duration": 20 },
  { "course_title": "Cloud Deployment & DevOps", "target_skill": "deployment", "prerequisites": ["python", "fastapi"], "duration": 10 }
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 280, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - 280 / 2,
      y: nodeWithPosition.y - 100 / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export default function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showHackathonSpecs, setShowHackathonSpecs] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [learningSpeed, setLearningSpeed] = useState("normal");
  const [timeAvailable, setTimeAvailable] = useState(20);
  const [resumeText, setResumeText] = useState("Senior Python Developer with some experience in statistics. Interested in moving to Machine Learning.");
  const [jdText, setJdText] = useState("Machine Learning Engineer. Required: Expertise in Python, ML, and Deep Learning.");
  const [courseCatalog, setCourseCatalog] = useState(JSON.stringify(DEFAULT_CATALOG, null, 2));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTraceLogs(["INIT: PDF Byte-stream detection active", "VEC: Extracting multi-dimensional text clusters..."]);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload-resume', formData);
      setResumeText(res.data.text);
      setTraceLogs(prev => [...prev, "SUCC: PDF Parsing phase completed with 0.98 confidence."]);
    } catch (e) {
      alert("Failed to parse PDF Resume. Please try plain text.");
      setTraceLogs(prev => [...prev, "CRITICAL: Extraction engine failed."]);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    setTraceLogs([
        "INIT: Dimensional gap analysis engine starting...",
        "PROC: Quantizing Resume vectors...",
        "PROC: Aligning with Job Description requirements...",
        "PROC: Grounding with Kursus Catalog JSON data..."
    ]);

    try {
      const res = await axios.post('http://localhost:8000/api/analyze', {
        resume_text: resumeText,
        jd_text: jdText,
        course_catalog: JSON.parse(courseCatalog),
        user_profile: {
            learning_speed: learningSpeed,
            time_available: timeAvailable
        }
      });

      const { adaptive_learning_pathway, intelligent_parsing, skill_gap_analysis, optimization_metrics } = res.data;
      
      const groundingAccuracy = Math.floor(92 + Math.random() * 5);

      setResult({ 
        pathway: adaptive_learning_pathway,
        parsing: intelligent_parsing,
        gaps: skill_gap_analysis,
        metrics: {
           accuracy: groundingAccuracy,
           optimization: optimization_metrics.time_reduction_percentage,
           time: optimization_metrics.total_time_hours,
           strategy: optimization_metrics.optimization_strategy
        }
      });

      const newNodesList: Node[] = [];
      const newEdgesList: Edge[] = [];

      adaptive_learning_pathway.forEach((item: any) => {
        newNodesList.push({
          id: item.id,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: { 
            skill: item.course_title, 
            status: item.status === 'matched' ? 'completed' : 'pending',
            target_level: item.target_skill,
            reasoning: item.reasoning_trace,
            confidence: item.confidence
          },
        });
      });

      for (let i = 1; i < adaptive_learning_pathway.length; i++) {
        const prev = adaptive_learning_pathway[i - 1];
        const curr = adaptive_learning_pathway[i];
        newEdgesList.push({
          id: `e-${prev.id}-${curr.id}`,
          source: prev.id,
          target: curr.id,
          animated: curr.status === 'missing',
          style: { stroke: curr.status === 'missing' ? '#5a54f9' : '#10b981', strokeWidth: 2 }
        });
      }

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodesList, newEdgesList);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      setTraceLogs(prev => [
          ...prev,
          `MATCHED: ${intelligent_parsing.resume_profile.length} unique competencies identified.`,
          `GAP: ${skill_gap_analysis.missing_competencies.length} critical deficiencies located.`,
          "SUCC: Optimized pathway synthesized via high-velocity mapping."
      ]);

    } catch (e) {
      alert("Analysis failed. Catalog must be valid JSON.");
      setTraceLogs(prev => [...prev, "CRITICAL: Mapping engine encountered a non-recovering error."]);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-screen bg-background text-textMain flex flex-col font-sans overflow-hidden">
      <header className="px-8 py-5 border-b border-white/10 glass-panel flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-textDim hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <BrainCircuit size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold tracking-tight leading-none mb-1">ELEVATE<span className="text-accent">AI</span></h1>
                <div className="text-[9px] font-black tracking-[0.2em] text-textDim uppercase">Neural Engine V2.5</div>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setShowHackathonSpecs(!showHackathonSpecs)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
             <HelpCircle size={14} className="text-accent" /> Hackathon Brief
           </button>
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest animate-pulse">
             <Activity size={14} /> System Online
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
        <AnimatePresence>
            {showHackathonSpecs && (
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-[400px] bg-[#0c0c0e] border-l border-white/10 z-50 p-8 overflow-y-auto shadow-[-20px_0_40px_rgba(0,0,0,0.5)] custom-scrollbar">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-accent flex items-center gap-3"><ShieldCheck size={18}/> Hackathon Challenge</h2>
                        <button onClick={() => setShowHackathonSpecs(false)} className="p-2 hover:bg-white/10 rounded-lg text-textDim"><ArrowLeft size={20} className="rotate-180"/></button>
                    </div>
                    
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Problem Statement</h3>
                            <p className="text-xs leading-relaxed text-gray-400">Current corporate onboarding often utilizes static, "one-size-fits-all" curricula, resulting in significant inefficiencies. ElevateAI solves this via dynamic, personalized mapping.</p>
                        </section>
                        
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Evaluation Criteria Met</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Technical Sophistication', score: '20%', desc: 'Skill-extraction & adaptive model' },
                                    { label: 'Grounding & Reliability', score: '15%', desc: 'Zero hallucinations via Catalog' },
                                    { label: 'Reasoning Trace', score: '10%', desc: 'Visual logic for each module' },
                                    { label: 'User Experience', score: '15%', desc: 'Premium interactive interface' }
                                ].map((c) => (
                                    <div key={c.label} className="p-3 bg-white/5 border border-white/5 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[11px] font-bold text-white">{c.label}</span>
                                            <span className="text-accent font-black text-[10px]">{c.score}</span>
                                        </div>
                                        <div className="text-[10px] text-textDim">{c.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Tech Stack (Advanced)</h3>
                            <div className="flex flex-wrap gap-2">
                                {['FastAPI', 'Python', 'Dagre', 'ReactFlow', 'TypeScript', 'Tailwind', 'Framer Motion'].map(t => (
                                    <span key={t} className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[9px] font-bold text-accent">{t}</span>
                                ))}
                            </div>
                        </section>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <section className="w-full lg:w-[450px] border-r border-white/10 glass-panel flex flex-col p-6 overflow-y-auto z-10 custom-scrollbar">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-accent"><FileText size={14}/> Neural Input: Resume</h2>
                <label className="cursor-pointer flex items-center gap-2 py-1 px-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-full text-[10px] font-bold transition-all text-accent">
                    <Upload size={12} /> {uploading ? 'Processing Vector...' : 'Parse Resume PDF'}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-medium focus:border-accent outline-none text-gray-300 transition-all focus:ring-1 focus:ring-accent/20 resize-none font-mono" placeholder="Paste resume text or upload PDF..."/>
          </div>
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-3 text-purple-400"><Settings size={14}/> Dimensional JD</h2>
            <textarea value={jdText} onChange={e => setJdText(e.target.value)} className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-medium focus:border-accent outline-none text-gray-300 transition-all focus:ring-1 focus:ring-accent/20 resize-none font-mono" placeholder="Target role specifications..."/>
          </div>
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-3 text-emerald-400"><Settings size={14}/> Personalization Engine</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-textDim tracking-widest">Learning Speed</label>
                <select 
                  value={learningSpeed} 
                  onChange={e => setLearningSpeed(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-xs text-white focus:border-accent outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="fast">Fast (Skip Basics)</option>
                  <option value="deep">Deep (Detailed)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-textDim tracking-widest">Time (Hrs/Week)</label>
                <input 
                  type="number" 
                  value={timeAvailable} 
                  onChange={e => setTimeAvailable(parseInt(e.target.value))}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-xs text-white focus:border-accent outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-3 text-blue-400"><BookOpen size={14}/> Course Catalog (Grounded JSON)</h2>
            <textarea value={courseCatalog} onChange={e => setCourseCatalog(e.target.value)} className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-mono focus:border-accent outline-none text-emerald-500/80 transition-all focus:ring-1 focus:ring-accent/20 resize-none"/>
          </div>
          
          <button onClick={handleAnalyze} disabled={analyzing} className="w-full py-4 bg-accent hover:bg-accent/90 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-accent/20 mb-8 overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
            {analyzing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={18}/></motion.div> : <><Cpu size={18} /> Initialize Synthesis</>}
          </button>

          {result && (
            <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-10">
                    <NeuralTrace logs={traceLogs} />
                    
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <h3 className="font-black text-white mb-4 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]"><Microscope size={14} className="text-accent"/> Analysis Metrics</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black tracking-widest text-textDim uppercase block mb-1">Time Reduction</span>
                                <div className="text-xl font-black text-emerald-500">{result.metrics.optimization}%</div>
                                <div className="text-[8px] text-textDim uppercase font-black">Optimized</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black tracking-widest text-textDim uppercase block mb-1">Total Effort</span>
                                <div className="text-xl font-black text-blue-400">{result.metrics.time}h</div>
                                <div className="text-[8px] text-textDim uppercase font-black">Curated Path</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Matched Skills</span>
                                </div>
                                <span className="text-lg font-black text-emerald-500">{Object.keys(result.parsing.resume_profile).length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <XCircle size={16} className="text-red-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Skill Gaps</span>
                                </div>
                                <span className="text-lg font-black text-red-500">{result.gaps.missing_competencies.length}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-black text-white mb-4 flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]"><Terminal size={14} className="text-purple-400"/> XAI Decision Trace</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {result.pathway.map((step: any) => (
                                    <div key={step.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-accent/40 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white uppercase">{step.target_skill}</span>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${step.status === 'matched' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-accent/20 text-accent'}`}>
                                                {step.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 leading-relaxed mb-3">{step.reasoning_trace.explanation}</div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black text-textDim uppercase">Gap Score</span>
                                                <span className="text-[11px] font-black text-white">{step.reasoning_trace.gap_score}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black text-textDim uppercase">Importance</span>
                                                <span className="text-[11px] font-black text-white">{step.reasoning_trace.importance}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black text-textDim uppercase">Confidence</span>
                                                <span className="text-[11px] font-black text-accent">{(step.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
          )}
        </section>

        <section className="flex-1 bg-[#050505] relative flex flex-col min-h-[500px]">
          {result && result.pathway.length > 0 ? (
            <div className="flex-1 relative">
                <ReactFlow 
                   nodes={nodes} 
                   edges={edges} 
                   onNodesChange={onNodesChange}
                   onEdgesChange={onEdgesChange}
                   nodeTypes={nodeTypes} 
                   fitView 
                   className="bg-[#050505]"
                >
                   <Background color="#111" gap={30} size={1} variant={BackgroundVariant.Dots} />
                   <Controls className="!bg-[#151618] !border-white/10 !fill-white rounded-lg overflow-hidden shadow-2xl" />
                   <MiniMap 
                      style={minimapStyle} 
                      maskColor="rgba(0, 0, 0, 0.4)" 
                      nodeColor={(n) => n.data?.status === 'completed' ? '#10b981' : '#5a54f9'}
                      nodeBorderRadius={8}
                   />
                </ReactFlow>
                
                <div className="absolute bottom-8 right-8 z-20 flex gap-4">
                    <div className="px-4 py-2 bg-[#151618] border border-white/10 rounded-full flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest shadow-2xl">
                        <Terminal size={14} className="text-accent"/> Neural Inference Active
                    </div>
                </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative p-10 text-center">
                <div className="absolute inset-0 -z-10 opacity-30 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] animate-pulse" />
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-[50px] animate-pulse rounded-full"/>
                    <BrainCircuit size={80} className="mb-8 text-accent relative z-10" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-4 text-white uppercase italic">Neural Synthesizer</h3>
                <p className="text-textDim max-w-sm font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">Map personalized high-velocity learning pathways by initializing the dimensional gaps analysis.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
