import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState, Position, MiniMap, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import dagre from 'dagre';
import { Settings, FileText, Zap, Activity, Cpu, ArrowLeft, BookOpen, BrainCircuit, Upload, CheckCircle2, XCircle, Terminal, HelpCircle, ShieldCheck, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CustomNode from '../components/CustomNode';
import NeuralTrace from '../components/NeuralTrace';

const API = "http://backend:8000"; // ✅ FIXED FOR DOCKER

const nodeTypes = { custom: CustomNode };

const minimapStyle = {
  backgroundColor: '#050505',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
};

const DEFAULT_CATALOG = [
  { "course_title": "Modern JavaScript Deep Dive", "target_skill": "JavaScript", "prerequisites": [] },
  { "course_title": "TypeScript for Enterprise", "target_skill": "TypeScript", "prerequisites": ["JavaScript"] },
  { "course_title": "React Architecture & Patterns", "target_skill": "React", "prerequisites": ["JavaScript"] },
  { "course_title": "Advanced React Performance", "target_skill": "Advanced React", "prerequisites": ["React", "TypeScript"] },
  { "course_title": "Fullstack Node.js & Express", "target_skill": "Node.js", "prerequisites": ["JavaScript"] },
  { "course_title": "Mastering GraphQL & Apollo", "target_skill": "GraphQL", "prerequisites": ["JavaScript", "Node.js"] }
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
      x: nodeWithPosition.x - 140,
      y: nodeWithPosition.y - 50,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export default function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [courseCatalog, setCourseCatalog] = useState(JSON.stringify(DEFAULT_CATALOG, null, 2));

  // ✅ FILE UPLOAD FIXED
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API}/api/upload-resume`, formData);
      setResumeText(res.data.text);
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ ANALYZE FIXED
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await axios.post(`${API}/api/analyze`, {
        resume_text: resumeText,
        jd_text: jdText,
        course_catalog: JSON.parse(courseCatalog),
      });

      setResult(res.data);

    } catch (e) {
      alert("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      
      {/* HEADER */}
      <header className="p-4 border-b border-gray-800 flex justify-between">
        <h1 className="font-bold text-lg">ELEVATE AI</h1>
        <Link to="/">Back</Link>
      </header>

      {/* MAIN */}
      <main className="flex flex-1">

        {/* LEFT PANEL */}
        <div className="w-[400px] p-4 space-y-4 border-r border-gray-800">
          
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Resume"
            className="w-full h-24 bg-gray-900 p-2"
          />

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Job Description"
            className="w-full h-24 bg-gray-900 p-2"
          />

          <input type="file" onChange={handleFileUpload} />

          <button
            onClick={handleAnalyze}
            className="w-full bg-blue-600 p-2"
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1">
          {result ? (
            <pre className="p-4 text-green-400">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Data Yet
            </div>
          )}
        </div>

      </main>
    </div>
  );
}