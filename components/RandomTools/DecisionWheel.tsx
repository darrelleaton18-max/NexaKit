"use client";

import { useState } from "react";

export default function DecisionWheel({ activeTool }: { activeTool: string }) {
  if (activeTool !== "wheel-gen") return null;
  
  const [options, setOptions] = useState("Pizza\nBurgers\nTacos\nSushi");
  const [result, setResult] = useState("?");
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    const list = options.split('\n').map(o => o.trim()).filter(o => o);
    if (list.length === 0) return;
    
    setIsSpinning(true);
    setResult("Spinning...");
    
    setTimeout(() => {
      const choice = list[Math.floor(Math.random() * list.length)];
      setResult(choice);
      setIsSpinning(false);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Spinning Decision Wheel</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Let fate decide. Enter your options below (one per line).</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <textarea 
          value={options} 
          onChange={e => setOptions(e.target.value)} 
          className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" 
          placeholder="Enter options here (one per line)..." 
        />
        
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center h-full justify-center">
          <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 transition-transform ${isSpinning ? 'animate-spin border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-900 text-transparent' : 'border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30'}`}>
            <span className="text-4xl font-black text-amber-600 dark:text-amber-400">{isSpinning ? "🌀" : "🎯"}</span>
          </div>
          
          <span className="text-2xl font-bold dark:text-white mb-6 min-h-[32px] break-all">{result}</span>
          
          <button 
            onClick={spin} 
            disabled={isSpinning} 
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isSpinning ? "Deciding..." : "Spin the Wheel"}
          </button>
        </div>
      </div>
    </div>
  );
}