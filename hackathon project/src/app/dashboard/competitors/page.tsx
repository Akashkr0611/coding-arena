"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Target, Users, Zap, Shield, Globe } from "lucide-react";

export default function CompetitorMap() {
  return (
    <div className="space-y-10 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black flex items-center gap-4 text-white tracking-tighter">
            <Map className="w-12 h-12 text-blue-500" />
            COMPETITOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">MAP</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg">Visualizing your position in the global startup ecosystem.</p>
        </div>
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-2 px-4 font-mono uppercase tracking-widest">Global Scan Active</Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* The Map / Grid */}
        <Card className="lg:col-span-8 p-1 relative bg-[#0e0e10]/80 border-zinc-800/50 backdrop-blur-3xl overflow-hidden rounded-[2rem] aspect-square lg:aspect-auto lg:h-[600px]">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            <div className="border-r border-b border-zinc-800/50 flex items-start p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Niche / Specialized</div>
            <div className="border-b border-zinc-800/50 flex items-start justify-end p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Leader / Aggressive</div>
            <div className="border-r border-zinc-800/50 flex items-end p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Incumbent / Legacy</div>
            <div className="flex items-end justify-end p-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Visionary / Emerging</div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-zinc-800/30" />
            <div className="h-full w-[1px] bg-zinc-800/30 absolute" />
          </div>

          {/* Competitor Nodes */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-[20%] left-[30%] group"
          >
            <div className="w-4 h-4 bg-zinc-600 rounded-full cursor-pointer hover:scale-150 transition-transform hover:bg-zinc-400" />
            <div className="absolute top-6 left-0 bg-zinc-900 border border-zinc-800 p-2 rounded text-[10px] text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Legacy Player A</div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-[15%] right-[20%] group"
          >
            <div className="w-4 h-4 bg-zinc-600 rounded-full cursor-pointer hover:scale-150 transition-transform hover:bg-zinc-400" />
            <div className="absolute top-6 left-0 bg-zinc-900 border border-zinc-800 p-2 rounded text-[10px] text-zinc-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Market Leader B</div>
          </motion.div>

          {/* YOUR STARTUP NODE */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute bottom-[30%] right-[35%] z-10"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] cursor-pointer hover:scale-110 transition-transform group border-4 border-[#09090b]">
              <Target className="w-6 h-6 text-white" />
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black px-3 py-1 rounded text-[10px] whitespace-nowrap uppercase tracking-widest shadow-xl">Nexus Data (YOU)</div>
            </div>
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
          </motion.div>
        </Card>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 bg-[#0e0e10]/60 border-zinc-800/50 backdrop-blur-3xl">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Strategic Gap</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              You are positioned in the <span className="text-blue-400 font-bold">Visionary</span> quadrant. While you lack the sheer market volume of the incumbents, your <span className="text-white font-bold">Innovation Velocity</span> is 3.4x faster.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-300">Moat Strength: High</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-zinc-300">Disruption Potential: 82%</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-blue-600/5 border-blue-500/20 backdrop-blur-3xl">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Blue Ocean Opportunity
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Incumbents are ignoring the mid-market segment due to high CAC. Your automated onboarding flow reduces this cost by 90%, creating a clear winning wedge.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
