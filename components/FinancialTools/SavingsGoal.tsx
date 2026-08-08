"use client";

import { useState, useEffect } from "react";

export default function SavingsGoal({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<number>(10000);
  const [current, setCurrent] = useState<number>(0);
  const [addAmount, setAddAmount] = useState<number | "">("");

  useEffect(() => {
    const savedT = localStorage.getItem("nexakit-save-target");
    const savedC = localStorage.getItem("nexakit-save-current");
    if (savedT) setTarget(Number(savedT));
    if (savedC) setCurrent(Number(savedC));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nexakit-save-target", target.toString());
      localStorage.setItem("nexakit-save-current", current.toString());
    }
  }, [target, current, mounted]);

  if (activeTool !== "savings-goal" || !mounted) return null;

  const progress = Math.min(100, Math.max(0, (current / (target || 1)) * 100));
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);

  const handleAdd = () => {
    if (addAmount) {
      setCurrent(prev => prev + Number(addAmount));
      setAddAmount("");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Rainy-Day Emergency Fund</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Set a target, track your deposits, and celebrate your milestones.</p>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Savings</span>
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{formatMoney(current)}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Goal</span>
            <span className="text-xl font-bold dark:text-slate-300">{formatMoney(target)}</span>
          </div>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-6 mb-2 overflow-hidden shadow-inner border border-slate-300 dark:border-slate-950">
          <div className="bg-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2" style={{ width: `${progress}%` }}>
            {progress > 10 && <span className="text-[10px] font-bold text-white shadow-sm">{progress.toFixed(1)}%</span>}
          </div>
        </div>
        
        {progress >= 100 && (
          <p className="text-center text-emerald-600 dark:text-emerald-400 font-bold mt-4 animate-bounce">🎉 Goal Achieved! Emergency Fund Fully Funded! 🎉</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Update Goal Target (£)</label>
          <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} className="w-full p-4 text-xl font-bold border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Add to Savings (£)</label>
          <div className="flex gap-2">
            <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 500" className="w-full p-4 text-xl font-bold border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            <button onClick={handleAdd} className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">Deposit</button>
          </div>
        </div>
      </div>
    </div>
  );
}