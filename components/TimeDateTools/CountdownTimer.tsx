"use client";

import { useState, useEffect, useRef } from "react";

export default function CountdownTimer({ activeTool }: { activeTool: string }) {
  if (activeTool !== "countdown") return null;

  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  
  const [inputH, setInputH] = useState<number | "">("");
  const [inputM, setInputM] = useState<number | "">("");
  const [inputS, setInputS] = useState<number | "">("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, timeRemaining]);

  const handleStart = () => {
    if (timeRemaining === 0) {
      const h = Number(inputH) || 0;
      const m = Number(inputM) || 0;
      const s = Number(inputS) || 0;
      const totalSeconds = (h * 3600) + (m * 60) + s;
      if (totalSeconds > 0) {
        setTimeRemaining(totalSeconds);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const addTime = (seconds: number) => {
    setTimeRemaining(prev => prev + seconds);
  };

  const formatOutput = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Countdown Timer</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Set a custom duration or use quick-add buttons to start counting down.</p>

      {timeRemaining === 0 && !isRunning ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex gap-4 mb-6">
            <div className="text-center"><input type="number" placeholder="00" value={inputH} onChange={e => setInputH(e.target.value === "" ? "" : Number(e.target.value))} className="w-20 md:w-24 p-4 text-3xl font-bold text-center border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white" /><span className="block text-xs font-bold text-neutral-400 mt-2 uppercase tracking-wider">Hours</span></div>
            <span className="text-4xl font-bold text-neutral-300 dark:text-neutral-700 mt-4">:</span>
            <div className="text-center"><input type="number" placeholder="00" value={inputM} onChange={e => setInputM(e.target.value === "" ? "" : Number(e.target.value))} className="w-20 md:w-24 p-4 text-3xl font-bold text-center border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white" /><span className="block text-xs font-bold text-neutral-400 mt-2 uppercase tracking-wider">Mins</span></div>
            <span className="text-4xl font-bold text-neutral-300 dark:text-neutral-700 mt-4">:</span>
            <div className="text-center"><input type="number" placeholder="00" value={inputS} onChange={e => setInputS(e.target.value === "" ? "" : Number(e.target.value))} className="w-20 md:w-24 p-4 text-3xl font-bold text-center border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white" /><span className="block text-xs font-bold text-neutral-400 mt-2 uppercase tracking-wider">Secs</span></div>
          </div>
          
          <button onClick={handleStart} className="w-full max-w-sm bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl text-lg transition-transform active:scale-95 shadow-md shadow-orange-500/20">
            Start Timer
          </button>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button onClick={() => setTimeRemaining(300)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">5 Mins</button>
            <button onClick={() => setTimeRemaining(900)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">15 Mins</button>
            <button onClick={() => setTimeRemaining(1800)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">30 Mins</button>
            <button onClick={() => setTimeRemaining(3600)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">1 Hour</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className={`text-7xl md:text-9xl font-black font-mono tabular-nums tracking-tight mb-8 drop-shadow-sm ${timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-neutral-800 dark:text-white'}`}>
            {formatOutput(timeRemaining)}
          </div>
          
          <div className="flex gap-4 w-full max-w-sm mb-6">
            <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 font-bold py-4 rounded-xl text-white text-lg transition-transform active:scale-95 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
              {isRunning ? "Pause" : "Resume"}
            </button>
            <button onClick={() => { setIsRunning(false); setTimeRemaining(0); }} className="flex-1 font-bold py-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-lg transition-transform active:scale-95">
              Reset
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => addTime(60)} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-sky-400 font-bold text-xs rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">+ 1 Min</button>
            <button onClick={() => addTime(300)} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-sky-400 font-bold text-xs rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">+ 5 Mins</button>
          </div>
        </div>
      )}
    </div>
  );
}