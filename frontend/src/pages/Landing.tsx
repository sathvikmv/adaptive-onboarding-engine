import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, BarChart3, Users, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 border-b border-white/5 glass-panel flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(90,84,249,0.5)]">
            <Cpu size={22} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Elevate<span className="text-accent">AI</span></h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-textDim">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#solutions" className="hover:text-accent transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
        </div>
        <Link to="/graph" className="bg-accent hover:bg-[#4d47df] px-6 py-2.5 rounded-full text-sm font-semibold transition-all glow-btn inline-flex items-center gap-2">
          Launch Dashboard <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-8 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-100px] left-[-10px] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-8">
            <Zap size={14} fill="currentColor" /> The Next-Gen Training Layer
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Standardized Onboarding <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Is Obsolete.</span>
          </h1>
          <p className="max-w-2xl text-xl text-textDim mb-12 leading-relaxed">
            ElevateAI generates hyper-personalized learning pathways by dynamically analyzing skill gaps between resumes and requirements. Stop wasting time on what you already know.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mb-24">
            <Link to="/graph" className="bg-accent hover:bg-[#4d47df] px-10 py-4 rounded-xl text-lg font-bold transition-all glow-btn flex items-center justify-center gap-2">
              Start Evaluation <ArrowRight size={20} />
            </Link>
            <button className="px-10 py-4 rounded-xl text-lg font-bold border border-white/10 hover:bg-white/5 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl">
          {[
            { label: 'Time Saved', val: '42%', desc: 'per new hire' },
            { label: 'RoI Generated', val: '$2.5k', desc: 'avg. per candidate' },
            { label: 'Accuracy', val: '98.4%', desc: 'parsing precision' },
            { label: 'Skills Indexed', val: '15k+', desc: 'global ontology' },
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-2xl border border-white/5 glass-panel">
              <div className="text-3xl font-bold text-accent mb-1">{stat.val}</div>
              <div className="text-sm font-semibold mb-2">{stat.label}</div>
              <div className="text-xs text-textDim">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-8 bg-panel/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-6 italic">Built for High-Growth Teams.</h2>
            <p className="text-textDim text-lg max-w-xl">
              We combined advanced Graph Theory with LLM Reasoning to create the first automated skill backfilling engine.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe className="text-blue-400" />,
                title: 'Global Ontology Network',
                desc: 'Access our vast database of prerequisites across Tech, Finance, and Design hierarchies.'
              },
              {
                icon: <BarChart3 className="text-emerald-400" />,
                title: 'ROI Visualizer',
                desc: 'Get instant reports on training efficiency and cost savings compared to traditional linear onboarding.'
              },
              {
                icon: <ShieldCheck className="text-purple-400" />,
                title: 'Enterprise Compliance',
                desc: 'Role-based access, data encryption, and local LLM deployment support for maximum privacy.'
              }
            ].map((f, i) => (
              <div key={i} className="group cursor-default">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-textDim leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Cpu className="text-accent" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Elevate<span className="text-accent">AI</span></h1>
        </div>
        <p className="text-textDim text-sm">© 2026 ElevateAI Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
