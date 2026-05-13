"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SmartToy, Brain, Zap, TrendingUp, MessageSquare, ShieldCheck, Target } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="space-y-10 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black flex items-center gap-4 text-white tracking-tighter">
            <Brain className="w-12 h-12 text-purple-500" />
            VC <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">INSIGHTS</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg">Deep-dive qualitative analysis from 50+ simulated investor perspectives.</p>
        </div>
        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 py-2 px-4 font-mono uppercase tracking-widest">Synthesis Complete</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          {
            persona: "The Silicon Valley Maverick",
            sentiment: "Aggressive Bull",
            quote: "I don't care about your current revenue. I care about how you own the protocol layer. If you win here, you win the entire stack.",
            color: "blue",
            impact: "High"
          },
          {
            persona: "The Conservative GP",
            sentiment: "Cautious",
            quote: "The unit economics are still fuzzy. I need to see a clearer path to 70% gross margins before we can lead a Series A.",
            color: "amber",
            impact: "Medium"
          },
          {
            persona: "The Tech Evangelist",
            sentiment: "Enthusiastic",
            quote: "Your integration of vector databases with real-time streaming is the most elegant solution I've seen this year. Pure engineering magic.",
            color: "purple",
            impact: "Strong"
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 h-full bg-[#0e0e10]/80 border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden flex flex-col">
              <div className={`absolute top-0 left-0 w-full h-1 bg-${item.color}-500/50`} />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-white text-lg tracking-tight">{item.persona}</h3>
                  <Badge variant="ghost" className={`p-0 text-xs font-bold text-${item.color}-400 uppercase tracking-widest`}>{item.sentiment}</Badge>
                </div>
                <MessageSquare className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-zinc-300 italic leading-relaxed mb-8 flex-1">"{item.quote}"</p>
              <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conviction Level</span>
                <span className={`text-sm font-black text-${item.color}-400`}>{item.impact}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-10 bg-gradient-to-br from-purple-600/10 to-transparent border-zinc-800/50 backdrop-blur-3xl">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Consensus Strengths</h2>
          <div className="space-y-6">
            {[
              { label: "Technical Defensibility", val: "92%", icon: ShieldCheck, color: "emerald" },
              { label: "Market Timing", val: "88%", icon: Zap, color: "amber" },
              { label: "Founder-Market Fit", val: "95%", icon: TrendingUp, color: "blue" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-zinc-300">{stat.label}</span>
                    <span className={`text-sm font-black text-${stat.color}-400`}>{stat.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${stat.color}-500`} style={{ width: stat.val }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-10 bg-[#0e0e10]/60 border-zinc-800/50 backdrop-blur-3xl">
          <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Critical Weaknesses</h2>
          <div className="space-y-4">
            {[
              "High Customer Acquisition Cost (CAC) in early-stage models.",
              "Potential dependency on third-party LLM pricing structures.",
              "Niche focus might limit the 'Unicorn' scale perceived by some GPs."
            ].map((text, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-500/[0.03] border border-red-500/10">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
