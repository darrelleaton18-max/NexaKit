"use client";

import { useState, useEffect, useRef } from "react";

export default function Stopwatch({ activeTool }: { activeTool: string }) {
  if (activeTool !== "stopwatch") return null;

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(prev => prev + 10), 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isRunning) setLaps(prev => [time, ...prev]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Precision Stopwatch</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Track time with millisecond precision and record split laps.</p>

      <div className="flex flex-col items-center">
        <div className="text-6xl md:text-8xl font-black font-mono text-neutral-800 dark:text-white tabular-nums tracking-tight mb-8 drop-shadow-sm">
          {formatTime(time)}
        </div>

        <div className="flex gap-4 mb-8 w-full max-w-sm">
          <button 
            onClick={() => setIsRunning(!isRunning)} 
            className={`flex-1 font-bold py-4 rounded-xl text-white text-lg transition-transform active:scale-95 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button 
            onClick={isRunning ? handleLap : handleReset} 
            className="flex-1 font-bold py-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-lg transition-transform active:scale-95"
          >
            {isRunning ? "Lap" : "Reset"}
          </button>
        </div>

        {laps.length > 0 && (
          <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 max-h-[250px] overflow-y-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">
                <tr><th className="p-3">Lap</th><th className="p-3 text-right">Split Time</th><th className="p-3 text-right">Total Time</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                {laps.map((lapTime, i) => {
                  const previousLap = laps[i + 1] || 0;
                  const split = lapTime - previousLap;
                  return (
                    <tr key={i} className="text-neutral-700 dark:text-neutral-300">
                      <td className="p-3 text-neutral-400">{(laps.length - i).toString().padStart(2, '0')}</td>
                      <td className="p-3 text-right text-orange-600 dark:text-sky-400 font-bold">{formatTime(split)}</td>
                      <td className="p-3 text-right">{formatTime(lapTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}