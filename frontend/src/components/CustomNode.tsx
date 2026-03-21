import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle2, Circle, Zap } from 'lucide-react';

export default function CustomNode({ data }: any) {
  const isCompleted = data.status === 'completed';
  const confidence = (data.confidence * 100).toFixed(0);
  
  return (
    <div className={`p-4 rounded-2xl border bg-[#0c0c0e]/90 backdrop-blur-xl shadow-2xl transition-all duration-300 ${isCompleted ? 'border-emerald-500/30' : 'border-accent/30'} min-w-[220px]`}>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-accent" />
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 size={16} className="text-emerald-400" />
            ) : (
              <Circle size={16} className="text-accent animate-pulse" />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-textDim">{data.target_level}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
            <Zap size={10} className="text-accent" />
            <span className="text-[9px] font-bold text-accent">{confidence}%</span>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-white mb-1">{data.skill}</div>
          <div className="text-[10px] text-textDim leading-tight line-clamp-2">
             {data.reasoning?.explanation || data.reasoning}
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-accent'}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-accent" />
    </div>
  );
}
