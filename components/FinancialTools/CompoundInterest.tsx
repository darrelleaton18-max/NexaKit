"use client";

import { useState } from "react";

export default function CompoundInterest({ activeTool }: { activeTool: string }) {
  if (activeTool !== "compound-calc") return null;

  const [ciPrincipal, setCiPrincipal] = useState<number | "">(10000);
  const [ciRate, setCiRate] = useState<number | "">(6);
  const [ciYears, setCiYears] = useState<number | "">(10);
  const [ciFreq, setCiFreq] = useState<number>(12);

  const calculateCI = () => {
    const P = Number(ciPrincipal) || 0, r = (Number(ciRate) || 0) / 100, t = Number(ciYears) || 0, n = ciFreq;
    const amount = P * Math.pow(1 + r / n, n * t);
    return { total: amount, interest: amount - P };
  };
  
  const ciData = calculateCI();
  const formatGeneric = (val: number) => new Intl.NumberFormat('en-GB', { style: "currency", currency: "GBP" }).format(val);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Compound Interest Calculator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Project future investment growth using compound interest formulas.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Initial (£)</label><input type="number" value={ciPrincipal} onChange={(e) => setCiPrincipal(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Annual Rate (%)</label><input type="number" value={ciRate} onChange={(e) => setCiRate(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Years</label><input type="number" value={ciYears} onChange={(e) => setCiYears(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Frequency</label><select value={ciFreq} onChange={(e) => setCiFreq(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value={12}>Monthly</option><option value={1}>Yearly</option></select></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl text-center"><span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">FUTURE BALANCE</span><span className="block text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">{formatGeneric(ciData.total)}</span></div>
        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">INTEREST EARNED</span><span className="block text-2xl md:text-3xl font-black text-blue-900 dark:text-sky-200 mt-1">{formatGeneric(ciData.interest)}</span></div>
      </div>
    </div>
  );
}