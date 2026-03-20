import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle2, Circle } from 'lucide-react';

export default function CustomNode({ data }: any) {
  const isCompleted = data.status === 'completed';
  
  return (
    <div className={`react-flow__node-custom ${data.status}`}>
      <Handle type="target" position={Position.Top} className="!bg-accent" />
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <Circle size={16} className="text-accent" />
        )}
        <div>
          <div className="font-semibold">{data.skill}</div>
          <div className="text-[10px] text-textDim mt-1 leading-tight line-clamp-2" title={data.reasoning}>
             {data.label || data.reasoning}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent" />
    </div>
  );
}
