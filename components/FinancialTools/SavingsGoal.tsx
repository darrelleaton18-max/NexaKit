"use client";

import { useState, useEffect } from "react";

type Deposit = { id: string; date: string; amount: number };

export default function SavingsGoal({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<number>(10000);
  const [current, setCurrent] = useState<number>(0);
  const [history, setHistory] = useState<Deposit[]>([]);
  
  const [addAmount, setAddAmount] = useState<number | "">("");
  const [addDate, setAddDate] = useState("");

  useEffect(() => {
    const savedT = localStorage.getItem("nexakit-save-target");
    const savedH = localStorage.getItem("nexakit-save-history");
    
    if (savedT) setTarget(Number(savedT));
    
    if (savedH) {
      const parsedHistory = JSON.parse(savedH);
      setHistory(parsedHistory);
      setCurrent(parsedHistory.reduce((sum: number, item: Deposit) => sum + item.amount, 0));
    } else {
      // Backwards compatibility: Wrap existing flat savings into a historical deposit
      const savedC = localStorage.getItem("nexakit-save-current");
      if (savedC && Number(savedC) > 0) {
        const initialDeposit = { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], amount: Number(savedC) };
        setHistory([initialDeposit]);
        setCurrent(Number(savedC));
      }
    }
    
    setAddDate(new Date().toISOString().split('T')[0]); // Default to today
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nexakit-save-target", target.toString());
      localStorage.setItem("nexakit-save-history", JSON.stringify(history));
      localStorage.setItem("nexakit-save-current", current.toString());
    }
  }, [target, history, current, mounted]);

  if (activeTool !== "savings-goal" || !mounted) return null;

  const progress = Math.min(100, Math.max(0, (current / (target || 1)) * 100));
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);

  const handleAdd = () => {
    if (addAmount && addDate) {
      const amountNum = Number(addAmount);
      const newDeposit = { id: crypto.randomUUID(), date: addDate, amount: amountNum };
      
      // Add and sort by date descending (newest first)
      const newHistory = [newDeposit, ...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setHistory(newHistory);
      setCurrent(newHistory.reduce((sum, item) => sum + item.amount, 0));
      setAddAmount("");
    }
  };

  const handleDelete = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    setCurrent(newHistory.reduce((sum, item) => sum + item.amount, 0));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Rainy-Day Emergency Fund</h2>
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Rainy-Day Emergency Fund</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Set a target, track your deposits, and celebrate your milestones.</p>
      <div className="flex items-center gap-2 mb-8 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-md w-fit border border-emerald-200 dark:border-emerald-800/50">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Data is securely saved in browser memory and persists on page refresh
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Update Goal Target (£)</label>
          <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} className="w-full p-4 text-xl font-bold border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Add to Savings</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} className="p-4 font-bold border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount (£)" className="flex-1 w-full p-4 text-xl font-bold border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
            <button onClick={handleAdd} className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">Deposit</button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold dark:text-white">Deposit History</h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{history.length} Transactions</span>
          </div>

          <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono bg-slate-50 dark:bg-slate-900">
                {history.map(h => (
                  <tr key={h.id} className="dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">{new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400">+{formatMoney(h.amount)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(h.id)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}