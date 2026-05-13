"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, CalendarDays, DollarSign, Brain, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const chartData = [
  { year: "Year 1", revenue: 500000, users: 10000, ebitda: -200000 },
  { year: "Year 2", revenue: 1500000, users: 45000, ebitda: -500000 },
  { year: "Year 3", revenue: 4200000, users: 150000, ebitda: 100000 },
  { year: "Year 4", revenue: 9800000, users: 400000, ebitda: 1800000 },
  { year: "Year 5", revenue: 21000000, users: 1000000, ebitda: 6000000 },
];

export default function GrowthForecast() {
  const [formData, setFormData] = useState({
    total_funding: 2000000,
    team_size: 15,
    market_size: 500000000,
    monthly_burn: 120000,
    monthly_revenue: 45000,
    growth_rate: 0.15
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-100">
            <Brain className="w-8 h-8 text-purple-500" />
            ML-Powered Strategy Engine
          </h1>
          <p className="text-zinc-400">Trained on real-world market patterns to predict valuation, burnout, and growth milestones.</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Generate Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <Card className="lg:col-span-1 p-6 bg-zinc-900/40 border-zinc-800 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-zinc-400" />
            Parameters
          </h2>
          <div className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1 block">
                  {key.replace(/_/g, ' ')}
                </label>
                <input 
                  type="number" 
                  value={value}
                  onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value)})}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Prediction Results */}
        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-zinc-900/60 border-zinc-800 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-12 h-12" />
                  </div>
                  <div className="text-xs text-zinc-500 mb-1">Predicted Valuation</div>
                  <div className="text-2xl font-bold text-emerald-400">${(prediction.valuation / 1000000).toFixed(1)}M</div>
                </Card>
                <Card className="p-4 bg-zinc-900/60 border-zinc-800 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <div className="text-xs text-zinc-500 mb-1">Burnout Risk</div>
                  <div className={`text-2xl font-bold ${prediction.burnout_estimate > 0.7 ? 'text-red-400' : prediction.burnout_estimate > 0.4 ? 'text-amber-400' : 'text-blue-400'}`}>
                    {(prediction.burnout_estimate * 100).toFixed(0)}%
                  </div>
                </Card>
                <Card className="p-4 bg-zinc-900/60 border-zinc-800 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CalendarDays className="w-12 h-12" />
                  </div>
                  <div className="text-xs text-zinc-500 mb-1">Est. Breakeven</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {prediction.breakeven_months === 0 ? 'Profitable' : `${prediction.breakeven_months} Mos`}
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-purple-500/5 border-purple-500/20 shadow-xl backdrop-blur-md">
                <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI Strategic Suggestions
                </h3>
                <ul className="space-y-3">
                  {prediction.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                      <span className="text-purple-500 font-bold">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl p-10 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-zinc-100 font-bold text-xl mb-2">Ready for Simulation</h3>
              <p className="text-zinc-500 max-w-sm">Adjust your parameters and click "Generate Analysis" to run the ML model.</p>
            </div>
          )}
        </div>
      </div>

      <Card className="p-6 bg-zinc-900/40 border-zinc-800 shadow-lg backdrop-blur-md mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Projected 5-Year Trajectory</h2>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Based on ML Analysis</Badge>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="year" stroke="#71717a" tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#f4f4f5' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
