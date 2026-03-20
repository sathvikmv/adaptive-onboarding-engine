import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { Settings, FileText, Zap, Activity, Cpu, ArrowLeft, TrendingUp, Clock, DollarSign, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CustomNode from '../components/CustomNode';

const nodeTypes = { custom: CustomNode };

export default function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [resumeSkills, setResumeSkills] = useState('{\n  "JavaScript": 3,\n  "Node.js": 2,\n  "React": 2\n}');
  const [jdSkills, setJdSkills] = useState('{\n  "JavaScript": 3,\n  "TypeScript": 3,\n  "React": 3,\n  "Node.js": 2,\n  "Advanced React": 3,\n  "GraphQL": 2\n}');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:8000/api/analyze', {
        resume_skills: JSON.parse(resumeSkills),
        jd_skills: JSON.parse(jdSkills),
      });

      const { roadmap, total_gap_score } = res.data;
      
      // Compute ROI Mock stats
      const totalSkillsCount = Object.keys(JSON.parse(jdSkills)).length;
      const skippedSkillsCount = roadmap.flat().filter((s:any) => s.status === 'completed').length;
      const hoursPerSkill = 15;
      const timeSaved = skippedSkillsCount * hoursPerSkill;
      const costSaved = timeSaved * 60; // $60/hr avg. dev rate

      setResult({ 
        roadmap, 
        total_gap_score,
        timeSaved,
        costSaved,
        efficiency: Math.round((skippedSkillsCount / totalSkillsCount) * 100)
      });

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const Y_SPACING = 150;
      const X_SPACING = 300;

      roadmap.forEach((stage: any[], stageIdx: number) => {
        stage.forEach((item: any, itemIdx: number) => {
          const nodeId = item.skill;
          newNodes.push({
            id: nodeId,
            type: 'custom',
            position: { x: itemIdx * X_SPACING, y: stageIdx * Y_SPACING },
            data: { ...item },
          });

          if (stageIdx > 0) {
              const prevStage = roadmap[stageIdx - 1];
              if(prevStage.length > 0) {
                 newEdges.push({
                     id: `e-${prevStage[itemIdx % prevStage.length].skill}-${nodeId}`,
                     source: prevStage[itemIdx % prevStage.length].skill,
                     target: nodeId,
                     animated: item.status === 'pending',
                     style: { stroke: item.status === 'pending' ? '#5a54f9' : '#10b981', strokeWidth: 2 }
                 });
              }
          }
        });
      });
      setNodes(newNodes);
      setEdges(newEdges);

    } catch (e) {
      alert("Error building topology graph. Please ensure JSON data is valid.");
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-screen bg-background text-textMain flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/10 glass-panel flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-textDim hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white">
                <Cpu size={20} />
             </div>
             <h1 className="text-xl font-bold tracking-tight">Elevate<span className="text-accent">AI</span> <span className="text-textDim text-sm font-normal ml-2">Dashboard</span></h1>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
             <TrendingUp size={14} /> Live Graph Engine
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left Sidebar - Inputs */}
        <section className="w-full lg:w-[400px] border-r border-white/10 glass-panel flex flex-col p-6 overflow-y-auto z-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><FileText size={18} className="text-accent"/> Resume Matrix</h2>
            <textarea value={resumeSkills} onChange={e => setResumeSkills(e.target.value)} className="w-full h-32 bg-background border border-white/10 rounded-xl p-3 text-sm font-mono focus:border-accent outline-none text-gray-300 transition-all focus:ring-1 focus:ring-accent/20"/>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><Settings size={18} className="text-accent"/> Role Requirements</h2>
            <textarea value={jdSkills} onChange={e => setJdSkills(e.target.value)} className="w-full h-32 bg-background border border-white/10 rounded-xl p-3 text-sm font-mono focus:border-accent outline-none text-gray-300 transition-all focus:ring-1 focus:ring-accent/20"/>
          </div>
          
          <button onClick={handleAnalyze} disabled={analyzing} className="w-full py-4 bg-accent hover:bg-[#4d47df] text-white rounded-xl font-bold flex items-center justify-center gap-3 glow-btn transition-all shadow-lg shadow-accent/20">
            {analyzing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={18}/></motion.div> : <><Zap size={18} fill="currentColor" /> Generate Adaptive Pathway</>}
          </button>

          {result && (
            <AnimatePresence>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 space-y-4">
                    <div className="p-5 bg-accentDim border border-accent/20 rounded-2xl">
                        <h3 className="font-bold text-accent mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest"><TrendingUp size={16}/> Business Impact Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/40 p-4 rounded-xl border border-white/5 shadow-inner">
                                <div className="text-textDim text-[10px] font-bold mb-1 flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> Time Saved</div>
                                <div className="text-2xl font-black">{result.timeSaved}h</div>
                            </div>
                            <div className="bg-background/40 p-4 rounded-xl border border-white/5 shadow-inner">
                                <div className="text-textDim text-[10px] font-bold mb-1 flex items-center gap-1 uppercase tracking-tighter"><DollarSign size={10} /> Cost ROI</div>
                                <div className="text-2xl font-black text-emerald-400">${result.costSaved.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border border-white/10 rounded-2xl bg-panel/30">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest"><ListOrdered size={16}/> Efficiency Rating</h3>
                        <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${result.efficiency}%` }} 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-purple-500 rounded-full"
                            />
                        </div>
                        <div className="text-right text-xs font-bold text-accent">{result.efficiency}% Optimization Rate</div>
                    </div>
                </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* Right Area - Visualization graph */}
        <section className="flex-1 bg-panel relative flex flex-col min-h-[500px]">
          {result ? (
            <div className="flex-1 relative">
                <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView className="bg-[#0a0a0b]">
                   <Background color="#333" gap={25} size={1} variant="dots" />
                   <Controls className="!bg-[#151618] !border-white/10 !fill-white rounded-lg overflow-hidden shadow-2xl" />
                   <MiniMap 
                      nodeStrokeColor={(n: any) => n.data.status === 'completed' ? '#10b981' : '#5a54f9'}
                      nodeColor={(n: any) => n.data.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(90,84,249,0.1)'}
                      className="!bg-[#151618] !border-white/10 !p-2 rounded-2xl overflow-hidden hidden md:block"
                   />
                </ReactFlow>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 -z-10 opacity-20 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/20 rounded-full animate-pulse" />
                </div>
                <Activity size={48} className="mb-6 text-accent animate-bounce" />
                <h3 className="text-2xl font-black tracking-tight mb-2 italic">Waiting for Input Analysis.</h3>
                <p className="text-textDim max-w-sm text-center font-medium leading-relaxed">Our Graph Engine will generate a topological skill roadmap. Click the button to initialize the neural evaluator pipeline.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
