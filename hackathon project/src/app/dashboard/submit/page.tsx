"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Brain, ChevronRight, ChevronLeft, Rocket, Database, Layers, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmitPitch() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const FORM_STEPS = [
    {
      title: "Core Identity",
      icon: Rocket,
      description: "Define the basic DNA of your startup.",
      fields: [
        { label: "Startup Name", placeholder: "e.g. PitchRank AI", type: "text" },
        { label: "The Idea (One Sentence)", placeholder: "We are the X for Y...", type: "text" },
        { label: "Problem Being Solved", placeholder: "What pain point are you fixing?", type: "textarea" },
        { label: "Industry Focus", placeholder: "Select industry", type: "select", options: ["AI/ML", "B2B SaaS", "Fintech", "Healthtech", "Web3", "Consumer"] }
      ]
    },
    {
      title: "Market & Strategy",
      icon: Layers,
      description: "How you plan to win and monetize.",
      fields: [
        { label: "Target Audience", placeholder: "Who is paying for this?", type: "text" },
        { label: "Revenue Model", placeholder: "e.g. Subscription, Transactional...", type: "select", options: ["B2B Subscription", "B2C Subscription", "Marketplace", "Usage-based", "Ad-supported"] },
        { label: "Pricing Strategy", placeholder: "e.g. $99/mo per seat", type: "text" },
        { label: "Target Market Size (TAM)", placeholder: "e.g. $15B", type: "text" }
      ]
    },
    {
      title: "Competitive Edge",
      icon: ShieldCheck,
      description: "Defensibility and technical advantage.",
      fields: [
        { label: "Direct Competitors", placeholder: "Who are you displacing?", type: "text" },
        { label: "Unique Advantage (Moat)", placeholder: "Why can't Google just build this?", type: "textarea" },
        { label: "Core Tech Stack", placeholder: "e.g. Next.js, Python, Pinecone...", type: "text" },
        { label: "Current Traction", placeholder: "e.g. 500 waitlist, $10k MRR", type: "text" }
      ]
    },
    {
      title: "Team & Execution",
      icon: Database,
      description: "The people behind the product.",
      fields: [
        { label: "Founder Experience", placeholder: "e.g. ex-Stripe, 2x founder", type: "text" },
        { label: "Team Size", placeholder: "Current full-time employees", type: "select", options: ["Solo", "2-5", "6-15", "16-50", "50+"] },
        { label: "Funding Stage", placeholder: "Current stage", type: "select", options: ["Bootstrapped", "Pre-seed", "Seed", "Series A"] },
        { label: "Social Presence", placeholder: "Twitter/LinkedIn links...", type: "text" }
      ]
    }
  ];

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI thinking steps
    const intervals = [
      setTimeout(() => setAnalysisStep(1), 1500),
      setTimeout(() => setAnalysisStep(2), 3000),
      setTimeout(() => setAnalysisStep(3), 4500),
      setTimeout(() => router.push('/dashboard'), 6000)
    ];

    return () => intervals.forEach(clearTimeout);
  };

  const currentStepData = FORM_STEPS[step];

  return (
    <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col relative z-10">
      
      {!isAnalyzing && (
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-zinc-100 tracking-tight">AI Growth Intelligence Engine</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">Upload your pitch deck or manually configure your startup DNA. Our proprietary LLMs will simulate thousands of market conditions to predict your growth trajectory.</p>
        </div>
      )}

      {isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1px] border-blue-500/20" />
            <div className="absolute inset-4 rounded-full border-[1px] border-purple-500/30" />
            <div className="absolute inset-8 rounded-full border-[1px] border-emerald-500/40" />
            
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-blue-500"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border-r-2 border-purple-400"
            />
            
            <Brain className="w-16 h-16 text-blue-400 animate-pulse relative z-10" />
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          </div>

          <h2 className="text-3xl font-bold text-zinc-100 mb-6">Running Monte Carlo Simulations</h2>
          
          <div className="w-full max-w-md space-y-4">
            {[
              { label: "Vectorizing Market Context", icon: Database, color: "text-blue-400", active: analysisStep >= 0 },
              { label: "Evaluating Competitor Moats", icon: ShieldCheck, color: "text-purple-400", active: analysisStep >= 1 },
              { label: "Projecting 5-Year Financials", icon: Zap, color: "text-emerald-400", active: analysisStep >= 2 },
              { label: "Synthesizing YC Investor Feedback", icon: Brain, color: "text-amber-400", active: analysisStep >= 3 }
            ].map((task, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${task.active ? 'bg-zinc-900/80 border-zinc-700 shadow-lg' : 'opacity-30 border-transparent grayscale'}`}>
                {task.active ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <task.icon className={`w-5 h-5 ${task.color}`} />
                  </motion.div>
                ) : (
                  <task.icon className="w-5 h-5 text-zinc-600" />
                )}
                <span className={task.active ? 'text-zinc-100 font-medium' : 'text-zinc-500'}>{task.label}</span>
                {task.active && i === analysisStep && (
                  <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Quick Upload Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-blue-900/10 border-blue-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center text-center py-8 relative z-10 border-2 border-dashed border-blue-500/30 rounded-xl hover:border-blue-500/60 cursor-pointer transition-colors bg-zinc-950/50">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-zinc-100 mb-2">Smart Deck Upload</h3>
                <p className="text-sm text-zinc-400">Drop your PDF pitch deck. Our AI will auto-extract all necessary parameters instantly.</p>
              </div>
            </Card>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-4">Setup Progress</h4>
              <div className="space-y-4">
                {FORM_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${i < step ? 'bg-emerald-500/20 text-emerald-400' : i === step ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-zinc-800 text-zinc-500'}`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${i <= step ? 'text-zinc-200' : 'text-zinc-600'}`}>{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Wizard Form */}
          <Card className="lg:col-span-8 p-8 bg-zinc-900/80 border-zinc-800 shadow-2xl backdrop-blur-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: `${((step + 1) / FORM_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex items-center gap-4 mb-8 mt-2">
              <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-300">
                <currentStepData.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">{currentStepData.title}</h2>
                <p className="text-zinc-400 text-sm">{currentStepData.description}</p>
              </div>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {currentStepData.fields.map((field, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea 
                          className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-zinc-100 placeholder:text-zinc-600 min-h-[100px] resize-none" 
                          placeholder={field.placeholder}
                        />
                      ) : field.type === 'select' ? (
                        <select className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-zinc-100 appearance-none">
                          <option value="" disabled selected>Select option...</option>
                          {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-zinc-100 placeholder:text-zinc-600" 
                          placeholder={field.placeholder} 
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800/50">
              <Button 
                variant="outline" 
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {step < FORM_STEPS.length - 1 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="bg-zinc-100 text-zinc-900 hover:bg-white px-8"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={simulateAnalysis}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 shadow-[0_0_15px_rgba(37,99,235,0.4)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  Initiate AI Analysis
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Sparkles(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
}
