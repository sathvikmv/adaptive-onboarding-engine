import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface NeuralTraceProps {
  logs: string[];
}

export default function NeuralTrace({ logs }: NeuralTraceProps) {
  return (
    <div className="bg-black/80 border border-white/10 rounded-2xl p-4 font-mono text-[10px] h-48 overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
        <Terminal size={12} className="text-accent" />
        <span className="text-textDim font-bold uppercase tracking-widest text-[8px]">Inference Log v2.5.0</span>
      </div>
      <div className="space-y-1.5">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-2"
          >
            <span className="text-accent/50">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <span className={log.includes('CRITICAL') ? 'text-red-400' : log.includes('MATCHED') ? 'text-emerald-400' : 'text-gray-400'}>
              {log}
            </span>
          </motion.div>
        ))}
        {logs.length > 0 && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1.5 h-3 bg-accent ml-1"
          />
        )}
      </div>
    </div>
  );
}
