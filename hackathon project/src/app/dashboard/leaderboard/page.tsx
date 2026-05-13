"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Star, Zap, Globe, Search, Filter } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Nexus Data", score: 94, category: "AI/ML", change: "+2", isYou: true, valuation: "$12.4M" },
  { rank: 2, name: "EcoFlow", score: 91, category: "ClimateTech", change: "-1", isYou: false, valuation: "$8.1M" },
  { rank: 3, name: "FinTrack", score: 88, category: "Fintech", change: "0", isYou: false, valuation: "$15.0M" },
  { rank: 4, name: "HealthSync", score: 85, category: "HealthTech", change: "+4", isYou: false, valuation: "$4.2M" },
  { rank: 5, name: "Eduluminate", score: 82, category: "EdTech", change: "-1", isYou: false, valuation: "$2.9M" },
];

export default function Leaderboard() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-3 uppercase tracking-widest px-3 py-1 text-[10px] font-black">Elite Circle</Badge>
          <h1 className="text-5xl font-black flex items-center gap-4 text-white tracking-tighter">
            <Trophy className="w-12 h-12 text-amber-400" />
            GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">RANKINGS</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg">The definitive list of high-potential startups as analyzed by the PitchRank Engine.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Arena..." 
              className="bg-[#0e0e10] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all w-64 text-zinc-200"
            />
          </div>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 text-zinc-300">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Trophy, title: "#1 Ranked", val: "Nexus Data", sub: "Score: 94", color: "amber" },
          { icon: Zap, title: "Velocity King", val: "HealthSync", sub: "+4 Positions", color: "blue" },
          { icon: Globe, title: "Market Cap", val: "$42.6M", sub: "Total Arena Vol", color: "purple" }
        ].map((stat, i) => (
          <Card key={i} className="p-Stat p-8 bg-[#0e0e10]/60 border-zinc-800/50 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-[40px]`} />
            <div className="flex items-center gap-4 mb-4">
              <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              <h3 className="font-black text-zinc-500 uppercase tracking-widest text-xs">{stat.title}</h3>
            </div>
            <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.val}</div>
            <div className="text-sm text-zinc-400 font-medium">{stat.sub}</div>
          </Card>
        ))}
      </div>

      <Card className="bg-[#0e0e10]/80 border-zinc-800/50 backdrop-blur-3xl overflow-hidden shadow-3xl rounded-3xl">
        <div className="grid grid-cols-12 gap-6 p-6 border-b border-zinc-800/50 text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-900/20">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Startup Entity</div>
          <div className="col-span-2">Vertical</div>
          <div className="col-span-2">Est. Valuation</div>
          <div className="col-span-2 text-center">Venture Score</div>
          <div className="col-span-1 text-center">Trend</div>
        </div>

        <div className="divide-y divide-zinc-800/30">
          {LEADERBOARD_DATA.map((startup, i) => (
            <motion.div 
              key={startup.rank}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`grid grid-cols-12 gap-6 p-6 items-center hover:bg-white/[0.02] transition-all cursor-pointer group ${startup.isYou ? 'bg-blue-500/[0.03] border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="col-span-1 text-center font-black text-2xl text-zinc-600 group-hover:text-white transition-colors">
                {startup.rank.toString().padStart(2, '0')}
              </div>
              <div className="col-span-4 flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${startup.isYou ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-xl text-white tracking-tight flex items-center gap-3">
                    {startup.name}
                    {startup.isYou && <Badge className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5">ELITE</Badge>}
                  </div>
                  <div className="text-xs text-zinc-500 font-medium tracking-tight">Active since 2024</div>
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-bold px-3 py-1">{startup.category}</Badge>
              </div>
              <div className="col-span-2 text-zinc-300 font-black tracking-tight text-lg">
                {startup.valuation}
              </div>
              <div className="col-span-2 text-center">
                <div className={`text-3xl font-black tracking-tighter ${startup.score > 90 ? 'text-emerald-400' : startup.score > 85 ? 'text-blue-400' : 'text-white'}`}>
                  {startup.score}
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                {startup.change.startsWith('+') ? (
                  <div className="text-emerald-400 flex flex-col items-center gap-1">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-[10px] font-black">{startup.change}</span>
                  </div>
                ) : startup.change === "0" ? (
                  <div className="text-zinc-700 font-black">-</div>
                ) : (
                  <div className="text-red-500 flex flex-col items-center gap-1">
                    <TrendingUp className="w-5 h-5 rotate-180" />
                    <span className="text-[10px] font-black">{startup.change}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
