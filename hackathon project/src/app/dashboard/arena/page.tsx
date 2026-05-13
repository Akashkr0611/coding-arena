"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Zap, TrendingUp, Users, Target, Brain } from "lucide-react";
import { useState } from "react";

const COMPARISON = {
  player: {
    name: "Your Startup",
    score: 88,
    metrics: {
      innovation: 92,
      market_fit: 85,
      scalability: 88,
      team: 90
    }
  },
  rival: {
    name: "Market Leader (Incumbent)",
    score: 74,
    metrics: {
      innovation: 65,
      market_fit: 95,
      scalability: 70,
      team: 80
    }
  }
};

export default function BattleArena() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 text-white tracking-tighter">
            <Sword className="w-10 h-10 text-red-500" />
            BATTLE ARENA
          </h1>
          <p className="text-zinc-400 font-medium">Head-to-head simulation against industry incumbents.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 py-2 px-4 font-mono uppercase tracking-widest">Live Simulation</Badge>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-2 px-4 font-mono uppercase tracking-widest">AI Consensus: 84%</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
        {/* Player Startup */}
        <Card className="lg:col-span-4 p-8 bg-[#0e0e10]/80 border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.1)] backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{COMPARISON.player.name}</h2>
              <Badge variant="outline" className="text-blue-400 border-blue-400/20">Challenger</Badge>
            </div>
            <div className="text-4xl font-black text-blue-500">{COMPARISON.player.score}</div>
          </div>
          
          <div className="space-y-6">
            {Object.entries(COMPARISON.player.metrics).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  <span>{key.replace('_', ' ')}</span>
                  <span className="text-blue-400">{val}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* VS Divider */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse" />
            <span className="text-4xl font-black text-white italic tracking-tighter relative z-10">VS</span>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] uppercase tracking-widest">
            Run Conflict Sim
          </Button>
          <div className="text-center">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Strategy Forecast</p>
            <p className="text-sm text-emerald-400 font-bold tracking-tight">"Disruption Highly Probable"</p>
          </div>
        </div>

        {/* Rival Startup */}
        <Card className="lg:col-span-4 p-8 bg-[#0e0e10]/80 border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.1)] backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
          <div className="flex justify-between items-start mb-8">
            <div className="text-4xl font-black text-red-600">{COMPARISON.rival.score}</div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{COMPARISON.rival.name}</h2>
              <Badge variant="outline" className="text-red-400 border-red-400/20">Defender</Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {Object.entries(COMPARISON.rival.metrics).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  <span className="text-red-400">{val}%</span>
                  <span>{key.replace('_', ' ')}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] ml-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 bg-[#0e0e10]/40 border-zinc-800/50 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Victory Path
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            The incumbent's weak point is <span className="text-white font-bold">Innovation Velocity</span>. By doubling down on your proprietary LLM architecture, you can achieve a 4x efficiency gain that their legacy systems cannot match.
          </p>
        </Card>
        <Card className="p-8 bg-[#0e0e10]/40 border-zinc-800/50 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Vulnerability Detected
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Your startup is currently trailing in <span className="text-white font-bold">Market Penetration</span>. Focus on the SMB segment where the rival has high friction and low customer satisfaction scores.
          </p>
        </Card>
        <Card className="p-8 bg-[#0e0e10]/40 border-zinc-800/50 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Market Shock Sim
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            In a "Market Downturn" scenario, your lean operational structure gives you an 18-month survival advantage over the incumbent's high-overhead model.
          </p>
        </Card>
      </div>
    </div>
  );
}
