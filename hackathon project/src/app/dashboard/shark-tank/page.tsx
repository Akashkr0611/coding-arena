"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, DollarSign, Activity, AlertTriangle } from "lucide-react";

// Mock Investors
const INVESTORS = [
  { id: 1, name: "Marcus", role: "Aggressive VC", focus: "Disruptive Tech", color: "from-blue-500 to-blue-400", mood: 60, status: "Listening" },
  { id: 2, name: "Elena", role: "Conservative", focus: "Revenue/EBITDA", color: "from-amber-500 to-orange-400", mood: 40, status: "Skeptical" },
  { id: 3, name: "Jin", role: "Tech Angel", focus: "Engineering/AI", color: "from-purple-500 to-fuchsia-400", mood: 80, status: "Intrigued" },
  { id: 4, name: "Sarah", role: "Impact VC", focus: "Sustainability", color: "from-emerald-500 to-teal-400", mood: 50, status: "Waiting" }
];

export default function SharkTankMode() {
  const [pitchStep, setPitchStep] = useState(0); // 0: intro, 1: pitch, 2: q&a, 3: negotiation, 4: decision
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "system", text: "Welcome to the Arena. The investors are ready. State your core value proposition in one sentence." }
  ]);
  const [investorMoods, setInvestorMoods] = useState(INVESTORS);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const newHistory = [...chatHistory, { sender: "user", text: inputText }];
    setChatHistory(newHistory);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      if (pitchStep === 0) {
        setChatHistory([...newHistory, { sender: "Marcus", text: "Interesting claim. But how are you differentiating from existing players who have 100x your budget?" }]);
        setPitchStep(1);
        updateMood(1, 10); // Marcus gets a bit more interested
        updateMood(2, -5); // Elena gets skeptical
      } else if (pitchStep === 1) {
        setChatHistory([...newHistory, { sender: "Jin", text: "Your tech stack looks solid. The AI routing is clever. I'm leaning in." }]);
        setPitchStep(2);
        updateMood(3, 15);
      } else {
        setChatHistory([...newHistory, { sender: "Elena", text: "I'm out. The CAC is too high and I don't see a clear path to profitability within 24 months." }]);
        setPitchStep(3);
        updateMood(2, -40);
      }
    }, 1500);
  };

  const updateMood = (id: number, change: number) => {
    setInvestorMoods(prev => prev.map(inv => 
      inv.id === id ? { ...inv, mood: Math.max(0, Math.min(100, inv.mood + change)) } : inv
    ));
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col relative">
      <div className="absolute top-0 w-full h-[30vh] bg-red-500/5 blur-[150px] pointer-events-none" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-100">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Live Pitch Arena
          </h1>
          <p className="text-zinc-400">Current Valuation: $10M Post-Money</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-mono">RECORDING</Badge>
          <Badge variant="outline" className="border-zinc-700 text-zinc-300 font-mono">TIME: 03:24</Badge>
        </div>
      </div>

      {/* Investor Panels */}
      <div className="grid grid-cols-4 gap-4 mb-6 relative z-10">
        {investorMoods.map((inv) => (
          <motion.div key={inv.id} layout transition={{ type: "spring" }}>
            <Card className={`p-4 bg-zinc-900/80 border-zinc-800 backdrop-blur-xl relative overflow-hidden h-full flex flex-col justify-between ${inv.mood < 30 ? 'grayscale opacity-70' : ''}`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${inv.color}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-zinc-100">{inv.name}</h3>
                  <p className="text-xs text-zinc-400">{inv.role}</p>
                </div>
                {inv.mood > 70 && <Badge className="h-5 px-1.5 text-[10px] bg-emerald-500/20 text-emerald-400">Hot</Badge>}
                {inv.mood < 30 && <Badge className="h-5 px-1.5 text-[10px] bg-red-500/20 text-red-400">Out</Badge>}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Interest Level</span>
                  <span className="font-mono text-zinc-200">{inv.mood}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${inv.color}`}
                    animate={{ width: `${inv.mood}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="mt-2 text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {inv.status}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat / Pitch Interface */}
      <Card className="flex-1 flex flex-col bg-zinc-900/50 border-zinc-800 backdrop-blur-md overflow-hidden relative z-10">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <AnimatePresence>
            {chatHistory.map((chat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col max-w-[80%] ${chat.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                {chat.sender !== 'user' && chat.sender !== 'system' && (
                  <span className="text-xs font-bold text-zinc-400 mb-1 ml-1">{chat.sender}</span>
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  chat.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : chat.sender === 'system'
                      ? 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 w-full text-center rounded-lg italic'
                      : 'bg-zinc-800 text-zinc-100 rounded-tl-sm border border-zinc-700'
                }`}>
                  {chat.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-end gap-2">
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-xl bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-100">
            <Mic className="w-5 h-5 text-red-400" />
          </Button>
          <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center px-4 focus-within:border-blue-500 transition-all">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response or use microphone..."
              className="w-full h-12 bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <Button 
            onClick={handleSend}
            size="icon" 
            className="h-12 w-12 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
