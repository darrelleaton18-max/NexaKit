"use client";

import { useState } from "react";

export default function PercentageCalculator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "pct-calc") return null;

  const [val1A, setVal1A] = useState<number | "">(""); const [val1B, setVal1B] = useState<number | "">("");
  const [val2A, setVal2A] = useState<number | "">(""); const [val2B, setVal2B] = useState<number | "">("");
  const [val3A, setVal3A] = useState<number | "">(""); const [val3B, setVal3B] = useState<number | "">("");

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Percentage Calculator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly solve the three most common percentage problems.</p>
      
      <div className="space-y-6">
        {/* Mode 1: What is X% of Y */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">What is</span>
          <input type="number" value={val1A} onChange={(e) => setVal1A(e.target.value === "" ? "" : Number(e.target.value))} className="w-24 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="%" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">% of</span>
          <input type="number" value={val1B} onChange={(e) => setVal1B(e.target.value === "" ? "" : Number(e.target.value))} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="Value" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">?</span>
          <div className="ml-auto w-full md:w-auto bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-sky-300 px-6 py-3 rounded-lg font-mono font-bold text-lg text-center min-w-[120px]">
            {val1A !== "" && val1B !== "" ? ((Number(val1A) / 100) * Number(val1B)).toFixed(2) : "0.00"}
          </div>
        </div>

        {/* Mode 2: X is what % of Y */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
          <input type="number" value={val2A} onChange={(e) => setVal2A(e.target.value === "" ? "" : Number(e.target.value))} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="Value 1" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">is what % of</span>
          <input type="number" value={val2B} onChange={(e) => setVal2B(e.target.value === "" ? "" : Number(e.target.value))} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="Value 2" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">?</span>
          <div className="ml-auto w-full md:w-auto bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-lg font-mono font-bold text-lg text-center min-w-[120px]">
            {val2A !== "" && val2B !== "" && Number(val2B) !== 0 ? ((Number(val2A) / Number(val2B)) * 100).toFixed(2) + "%" : "0.00%"}
          </div>
        </div>

        {/* Mode 3: % Change */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">% change from</span>
          <input type="number" value={val3A} onChange={(e) => setVal3A(e.target.value === "" ? "" : Number(e.target.value))} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="Val 1" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">to</span>
          <input type="number" value={val3B} onChange={(e) => setVal3B(e.target.value === "" ? "" : Number(e.target.value))} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white text-center" placeholder="Val 2" />
          <span className="text-sm font-bold dark:text-slate-300 whitespace-nowrap">?</span>
          <div className="ml-auto w-full md:w-auto bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-6 py-3 rounded-lg font-mono font-bold text-lg text-center min-w-[120px]">
            {val3A !== "" && val3B !== "" && Number(val3A) !== 0 ? (((Number(val3B) - Number(val3A)) / Math.abs(Number(val3A))) * 100).toFixed(2) + "%" : "0.00%"}
          </div>
        </div>
      </div>
    </div>
  );
}