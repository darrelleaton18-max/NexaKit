"use client";

import { useState } from "react";

export default function StatisticsCalculator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "stats-calc") return null;

  const [input, setInput] = useState("10, 25, 30, 45, 50, 50, 65");

  const calcStats = () => {
    const strClean = input.replace(/[^0-9.,-]/g, ' ').replace(/,/g, ' ');
    const arr = strClean.split(/\s+/).filter(v => v !== '').map(Number).filter(n => !isNaN(n));
    
    if (arr.length === 0) return null;

    arr.sort((a, b) => a - b);
    const count = arr.length;
    const sum = arr.reduce((a, b) => a + b, 0);
    const min = arr[0];
    const max = arr[count - 1];
    const mean = sum / count;
    const range = max - min;
    
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;

    const freq: Record<number, number> = {};
    arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
    let maxFreq = 0;
    let mode: number[] = [];
    for (const key in freq) {
      if (freq[key] > maxFreq) { maxFreq = freq[key]; mode = [Number(key)]; }
      else if (freq[key] === maxFreq) { mode.push(Number(key)); }
    }

    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
    const sd = Math.sqrt(variance);

    return { count, sum, mean, median, mode: mode.join(", "), range, min, max, variance, sd };
  };

  const stats = calcStats();

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Statistics Data Calculator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Calculate mean, median, mode, variance, and standard deviation instantly.</p>

      <div className="mb-6">
        <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Data Set (Comma or Space Separated)</label>
        <textarea 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="w-full h-24 p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white font-mono" 
          placeholder="e.g. 5, 10, 15.5, 20"
        />
      </div>

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Count" val={stats.count.toString()} />
          <StatBox label="Sum" val={stats.sum.toFixed(2)} />
          <StatBox label="Mean (Average)" val={stats.mean.toFixed(2)} highlight />
          <StatBox label="Median" val={stats.median.toFixed(2)} highlight />
          <StatBox label="Mode" val={stats.mode} />
          <StatBox label="Range" val={stats.range.toFixed(2)} />
          <StatBox label="Min / Max" val={`${stats.min} / ${stats.max}`} />
          <StatBox label="Standard Dev (σ)" val={stats.sd.toFixed(2)} highlight />
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg text-center text-neutral-500 dark:text-neutral-400">Please enter valid numbers.</div>
      )}
    </div>
  );
}

function StatBox({ label, val, highlight = false }: { label: string, val: string, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800' : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-700'}`}>
      <span className={`block text-xs font-bold mb-1 ${highlight ? 'text-orange-600 dark:text-sky-400' : 'text-neutral-500 dark:text-neutral-400'}`}>{label}</span>
      <span className="block text-xl font-mono font-bold text-neutral-800 dark:text-neutral-100">{val.replace(/\.00$/, '')}</span>
    </div>
  );
}