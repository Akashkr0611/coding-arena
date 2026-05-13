"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BarChart3, 
  Brain, 
  Play, 
  Target, 
  Users, 
  Sparkles, 
  Shield, 
  Zap,
  Globe,
  TrendingUp,
  Briefcase
} from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-blue-500/30 overflow-x-hidden relative text-zinc-100 font-sans">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/60 backdrop-blur-2xl border-b border-zinc-800/50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-300">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">PITCHRANK <span className="text-blue-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#simulator" className="hover:text-blue-400 transition-colors">Simulator</a>
          <a href="#investors" className="hover:text-blue-400 transition-colors">Investors</a>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-bold tracking-tight transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Launch App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Next-Gen Venture Intelligence</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
              PREDICT YOUR <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-500">NEXT ROUND.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-zinc-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
              Face the Arena. Our proprietary AI simulates thousands of investor personas to stress-test your business model before you ever step into the room.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/dashboard/submit">
                <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl group bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] border-t border-blue-400/30 transition-all hover:-translate-y-1">
                  Start Analysis
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard/shark-tank">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl border-zinc-800 bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-800/60 text-zinc-100 transition-all hover:-translate-y-1">
                  <Play className="mr-3 w-6 h-6 text-purple-500 fill-purple-500/20" />
                  Shark Tank Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Showcase Grid */}
          <div id="features" className="mt-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: "VC Persona Simulation", 
                desc: "Battle-test your pitch against 50+ AI personas ranging from aggressive growth VCs to conservative angels.",
                color: "blue"
              },
              { 
                icon: TrendingUp, 
                title: "Predictive Valuation", 
                desc: "Our ML engine processes real-world market data to estimate your current and post-round valuation accurately.",
                color: "purple"
              },
              { 
                icon: Shield, 
                title: "Moat Intelligence", 
                desc: "Advanced competitive analysis that identifies vulnerabilities in your defensibility and product-market fit.",
                color: "emerald"
              },
              { 
                icon: Globe, 
                title: "Market Simulation", 
                desc: "Run 10,000+ Monte Carlo simulations to see how your startup survives different economic cycles.",
                color: "blue"
              },
              { 
                icon: Zap, 
                title: "Breakeven Analysis", 
                desc: "Precisely estimate your time to profitability based on burn rates, team growth, and market traction.",
                color: "amber"
              },
              { 
                icon: Briefcase, 
                title: "GTM Optimizer", 
                desc: "AI-driven suggestions for your Go-To-Market strategy to maximize investor alignment and scaling potential.",
                color: "red"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-10 h-full bg-[#0e0e10]/60 border-zinc-800/50 hover:border-blue-500/30 transition-all group cursor-pointer shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${f.color}-600/5 blur-[60px] group-hover:bg-${f.color}-600/10 transition-colors`} />
                  <div className={`w-14 h-14 rounded-2xl bg-${f.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-${f.color}-500/20`}>
                    <f.icon className={`w-7 h-7 text-${f.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{f.title}</h3>
                  <p className="text-zinc-500 leading-relaxed text-lg font-medium">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Simulator Preview */}
          <section id="simulator" className="mt-48">
            <Card className="p-12 md:p-20 bg-gradient-to-br from-blue-600/10 via-zinc-900/40 to-purple-600/10 border-zinc-800/50 shadow-3xl backdrop-blur-3xl rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-left">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-6 py-1.5 px-4">AI ENGINE ACTIVE</Badge>
                  <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                    INTELLIGENCE <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">IN REAL-TIME.</span>
                  </h2>
                  <p className="text-xl text-zinc-400 mb-10 leading-relaxed font-medium">
                    Our platform integrates Stitch's high-fidelity UI with a custom-trained ML backend to give you institutional-grade insights. No more guessing—just data.
                  </p>
                  <div className="flex flex-col gap-6">
                    {[
                      "94.2% AI Prediction Accuracy",
                      "500+ Market Variables Analyzed",
                      "Instant Strategic Suggestions"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-zinc-200 font-bold tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500/20 blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity" />
                  <Card className="bg-[#09090b]/80 border-zinc-700/50 shadow-2xl backdrop-blur-2xl p-8 rounded-3xl relative z-10 transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="flex border-b border-zinc-800 pb-4 mb-6 items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Growth_Sim_v2.0</div>
                    </div>
                    <div className="space-y-6">
                      <div className="h-40 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex items-end justify-between gap-3">
                        {[60, 45, 90, 65, 85, 55, 100].map((h, i) => (
                          <div key={i} className="w-full bg-gradient-to-t from-blue-500/10 to-blue-500 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                          <div className="text-xs text-zinc-500 mb-1">Exit Multiplier</div>
                          <div className="text-2xl font-black text-white">12.4x</div>
                        </div>
                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                          <div className="text-xs text-zinc-500 mb-1">Confidence Score</div>
                          <div className="text-2xl font-black text-emerald-400">89%</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="mt-48 pb-40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
                READY TO <br/>
                <span className="text-blue-500">GO BIG?</span>
              </h2>
              <Link href="/dashboard">
                <Button size="lg" className="h-20 px-16 text-2xl font-black rounded-[2rem] bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                  Enter The Arena
                </Button>
              </Link>
            </motion.div>
          </section>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-[#09090b]/80 backdrop-blur-xl py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="font-bold text-zinc-400 uppercase tracking-widest text-xs">PitchRank AI &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
