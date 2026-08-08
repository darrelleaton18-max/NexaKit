"use client";

import { useState } from "react";

const COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#10b981", // Green
  "#eab308", // Yellow
  "#f97316", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4"  // Cyan
];

export default function DecisionWheel({ activeTool }: { activeTool: string }) {
  if (activeTool !== "wheel-gen") return null;
  
  const [options, setOptions] = useState("Pizza\nBurgers\nTacos\nSushi\nCurry\nSteak");
  const [result, setResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Filter out empty lines
  const list = options.split('\n').map(o => o.trim()).filter(o => o);
  const N = list.length || 1; // Fallback to 1 to avoid division by zero

  // Build the dynamic CSS conic-gradient for the wheel slices
  const getSliceColor = (i: number) => {
    // Prevent the first and last slice from being the exact same color
    if (i === N - 1 && N % COLORS.length === 1) return COLORS[1];
    return COLORS[i % COLORS.length];
  };

  const gradientParts = list.length > 0 
    ? list.map((_, i) => {
        const start = (i * 360) / N;
        const end = ((i + 1) * 360) / N;
        return `${getSliceColor(i)} ${start}deg ${end}deg`;
      })
    : [`#334155 0deg 360deg`];

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  // Calculate text sizing based on the amount of slices
  let textSize = "text-lg md:text-xl";
  if (N > 12) textSize = "text-sm md:text-base";
  if (N > 24) textSize = "text-xs";

  const spin = () => {
    if (list.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setShowWinner(false);
    
    // Pick the winner
    const winningIndex = Math.floor(Math.random() * list.length);
    const winner = list[winningIndex];
    
    // Math to calculate exactly where the wheel needs to land
    // 1. Find the center of the winning slice in degrees
    const sliceCenter = (winningIndex * 360) / N + (180 / N);
    
    // 2. The pointer is on the right side (90 degrees in conic terms)
    // 3. We want: (sliceCenter + addedRotation) % 360 = 90
    const targetBaseRotation = 90 - sliceCenter;
    
    // 4. Determine how much we need to add to the CURRENT rotation to hit the target
    const currentMod = rotation % 360;
    let degreesToAdd = targetBaseRotation - currentMod;
    if (degreesToAdd <= 0) degreesToAdd += 360;
    
    // 5. Add a random offset within the slice so it doesn't land dead-center every time
    const randomOffset = (Math.random() * (360 / N) * 0.8) - ((360 / N) * 0.4);
    
    // 6. Add 5 full extra spins (1800 degrees) for dramatic physics
    const totalNewRotation = rotation + degreesToAdd + 1800 + randomOffset;
    
    setRotation(totalNewRotation);
    setResult(winner);
    
    // Wait for the CSS transition (5 seconds) to finish before showing the modal
    setTimeout(() => {
      setIsSpinning(false);
      setShowWinner(true);
    }, 5000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 relative">
      
      {/* WINNER MODAL OVERLAY */}
      {showWinner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm rounded-xl animate-in fade-in duration-300">
          <div className="bg-amber-400 text-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl text-center transform scale-100 animate-in zoom-in-75 duration-300 w-11/12 max-w-md border-4 border-white">
             <h3 className="text-xl md:text-2xl font-bold mb-2 opacity-80 uppercase tracking-widest">We have a winner!</h3>
             <p className="text-4xl md:text-5xl font-black mb-8 break-words leading-tight">{result}</p>
             <button 
                onClick={() => setShowWinner(false)} 
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95 shadow-md w-full"
             >
                Close & Play Again
             </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-1 dark:text-white">Spinning Decision Wheel</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Let fate decide. Enter your options on the right.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        
        {/* ========================================== */}
        {/* THE VISUAL WHEEL (LEFT/TOP)                */}
        {/* ========================================== */}
        <div className="lg:col-span-2 flex justify-center relative overflow-hidden py-4">
          
          {/* Right Pointer Triangle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 drop-shadow-xl flex items-center pr-2">
            <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[35px] border-t-transparent border-b-transparent border-r-slate-800 dark:border-r-white"></div>
          </div>

          <div className="relative w-full max-w-[500px] aspect-square">
            {/* The Spinning Wheel Element */}
            <div 
              className="w-full h-full rounded-full shadow-2xl overflow-hidden border-4 border-slate-100 dark:border-slate-800 relative"
              style={{
                background: conicGradient,
                transform: `rotate(${rotation}deg)`,
                // 5-second long cubic-bezier for a realistic physical deceleration
                transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0, 0.05, 1)' : 'none'
              }}
            >
              {/* Overlay the Text for Each Slice */}
              {list.length > 0 && list.map((item, i) => {
                const rotateAngle = (i * 360) / N + (180 / N);
                return (
                  <div
                    key={i}
                    className={`absolute top-1/2 left-1/2 origin-left flex items-center justify-end pr-8 md:pr-12 text-white font-bold drop-shadow-md ${textSize}`}
                    style={{
                      width: '50%',
                      // conic-gradient 0deg is Top. origin-left 0deg is Right.
                      // Offset by -90 to align the text dead center with the slice
                      transform: `translateY(-50%) rotate(${rotateAngle - 90}deg)`,
                    }}
                  >
                    <span className="truncate w-full text-right">{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Center Hub & Spin Button Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
              <button 
                onClick={spin}
                disabled={isSpinning || list.length === 0}
                className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-transform disabled:opacity-80 disabled:hover:scale-100 text-slate-800 dark:text-white font-black text-xl md:text-2xl"
              >
                SPIN
              </button>
            </div>

          </div>
        </div>
        
        {/* ========================================== */}
        {/* TEXT INPUTS (RIGHT/BOTTOM)                 */}
        {/* ========================================== */}
        <div className="lg:col-span-1 flex flex-col h-full bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-end mb-4">
            <label className="block text-sm font-bold dark:text-slate-300">Entries</label>
            <span className="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{list.length}</span>
          </div>
          
          <textarea 
            value={options} 
            onChange={e => setOptions(e.target.value)} 
            disabled={isSpinning}
            className="w-full flex-1 min-h-[300px] p-4 font-medium border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 disabled:opacity-70" 
            placeholder="Type your entries here...&#10;(One on each line)" 
          />
          
          <button 
            onClick={spin} 
            disabled={isSpinning || list.length === 0} 
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel"}
          </button>
        </div>

      </div>
    </div>
  );
}