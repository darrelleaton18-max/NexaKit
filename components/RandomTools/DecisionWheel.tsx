"use client";

import { useState } from "react";

export default function DecisionWheel({ activeTool }: { activeTool: string }) {
  if (activeTool !== "wheel-gen") return null;
  
  const [options, setOptions] = useState("Pizza\nBurgers\nTacos\nSushi");
  const [result, setResult] = useState("?");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    const list = options.split('\n').map(o => o.trim()).filter(o => o);
    if (list.length === 0) return;
    
    setIsSpinning(true);
    setResult("Spinning...");
    
    // Add 5 to 10 extra full rotations for dramatic effect, plus a random stopping slice
    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraSpins + randomOffset;
    
    setRotation(newRotation);
    
    // Wait for the 3-second CSS transition to finish before showing the result
    setTimeout(() => {
      const choice = list[Math.floor(Math.random() * list.length)];
      setResult(choice);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Spinning Decision Wheel</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Let fate decide. Enter your options below (one per line).</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <textarea 
          value={options} 
          onChange={e => setOptions(e.target.value)} 
          className="w-full h-full min-h-[300px] p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" 
          placeholder="Enter options here (one per line)..." 
        />
        
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center h-full justify-center overflow-hidden">
          
          <div className="relative mb-6 mt-4">
            {/* The Red Pointer */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 z-10 drop-shadow-md"></div>
            
            {/* The Visual Wheel */}
            <div 
              className="w-48 h-48 rounded-full border-4 border-slate-800 dark:border-slate-700 shadow-lg"
              style={{
                background: 'conic-gradient(#f59e0b 0deg 90deg, #3b82f6 90deg 180deg, #10b981 180deg 270deg, #ef4444 270deg 360deg)',
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
              }}
            />
          </div>
          
          <span className="text-3xl font-black text-slate-800 dark:text-white mb-6 min-h-[40px] break-words px-2">{result}</span>
          
          <button 
            onClick={spin} 
            disabled={isSpinning} 
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 disabled:opacity-70 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isSpinning ? "Deciding..." : "Spin the Wheel"}
          </button>
        </div>
      </div>
    </div>
  );
}