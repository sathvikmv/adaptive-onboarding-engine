import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, BarChart3, Users, ArrowRight, ShieldCheck, Globe, Star, Sparkles, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:border-accent/30"
  >
    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-accent" size={28} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-accent transition-colors">{title}</h3>
    <p className="text-textDim leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ececec] selection:bg-accent/30 selection:text-white overflow-x-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-4 backdrop-blur-md border-b border-white/5 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20"
          >
            <Orbit size={22} />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter">
            ELEVATE<span className="text-accent font-light">AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-10 text-[13px] font-bold uppercase tracking-widest text-textDim">
          {['Features', 'Engine', 'Pricing', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <Link to="/graph" className="group relative px-6 py-2.5 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            Launch Engine <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-sm"
            >
              <Sparkles size={12} className="animate-spin-slow" /> Intelligence at the Core
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.95] text-white">
              BUILD PRODUCTS, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-blue-500 animate-gradient-x">NOT JUST TEAM.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-textDim mb-14 leading-relaxed font-medium">
              The world's first <span className="text-white">topological skill analysis engine</span>. We map the gap between your talent's current state and the project's requirements with neural precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/graph" className="group px-10 py-5 bg-accent hover:bg-accent/90 text-white rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all shadow-[0_0_40px_rgba(90,84,249,0.3)] hover:shadow-accent/50 flex items-center justify-center gap-3">
                Initialize Evaluation <Zap size={18} fill="currentColor" />
              </Link>
              <button className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all backdrop-blur-sm">
                Technical Blueprint
              </button>
            </div>
          </motion.div>

          {/* Floating Stats */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
            {[
              { label: 'Latency', val: '45ms', desc: 'Real-time Analysis' },
              { label: 'Edge nodes', val: '1.2M+', desc: 'Global Graph' },
              { label: 'Precision', val: '99.9%', desc: 'LLM Reasoning' },
              { label: 'Efficiency', val: '4x', desc: 'Training Speed' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-left group"
              >
                <div className="text-4xl font-black text-white mb-2 group-hover:text-accent transition-colors">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest font-black text-accent mb-1">{stat.label}</div>
                <div className="text-xs text-textDim font-medium">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-40 px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-white">
                  POWERING THE <br />NEXT GENERATION.
                </h2>
                <p className="text-textDim text-lg font-medium">
                  Traditional onboarding is a flat line. ElevateAI is a multidimensional graph that evolves with your team's expertise.
                </p>
              </div>
              <div className="h-px bg-white/10 flex-1 hidden md:block mx-12 mb-8" />
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 cursor-not-allowed hover:border-white/20 transition-colors">
                  <ArrowRight size={20} className="rotate-180" />
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/5 transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Globe}
                title="Neural Ontology"
                desc="Our engine understands semantic relationships between skills, allowing it to predict prerequisites with uncanny accuracy."
                delay={0.1}
              />
              <FeatureCard 
                icon={BarChart3}
                title="ROI Projection"
                desc="Instantly visualize the monetary and temporal impact of targeted learning pathways versus generic training."
                delay={0.2}
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="Enterprise Vault"
                desc="Military-grade encryption for your organization's talent data. SOC2 compliant and privacy-first by design."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-8">
          <div className="max-w-5xl mx-auto rounded-[3rem] bg-accent p-12 md:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-10 leading-[1.1]">
                READY TO SCALE <br />WITHOUT LIMITS?
              </h2>
              <p className="text-white/80 text-xl font-medium mb-16 max-w-xl">
                Join 500+ engineering teams already using ElevateAI to optimize their talent lifecycle.
              </p>
              <Link to="/graph" className="px-12 py-6 bg-white text-black rounded-2xl text-base font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all transform hover:scale-105">
                Join the Network
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Orbit className="text-accent" size={32} />
              <span className="text-2xl font-black tracking-tighter">ELEVATE<span className="text-accent">AI</span></span>
            </div>
            <p className="text-textDim text-sm max-w-xs leading-relaxed font-medium">
              Architecting the future of human-AI collaboration through advanced graph theory and skill mapping.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Product</h4>
            <ul className="space-y-4 text-textDim text-sm font-medium">
              <li><a href="#" className="hover:text-accent transition-colors">Engine</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4 text-textDim text-sm font-medium">
              <li><a href="#" className="hover:text-accent transition-colors">Manifesto</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-textDim">
          <p>© 2026 ELEVATEAI CORP. SYSTEM READY.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">STATUS: ONLINE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
