"use client";

import { useState, useEffect } from "react";

type Envelope = { id: string; name: string; limit: number; spent: number };

export default function EnvelopeBudget({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [envName, setEnvName] = useState("");
  const [envLimit, setEnvLimit] = useState<number | "">("");

  const [selectedEnvId, setSelectedEnvId] = useState("");
  const [spendAmount, setSpendAmount] = useState<number | "">("");

  useEffect(() => {
    const saved = localStorage.getItem("nexakit-envelopes");
    if (saved) setEnvelopes(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("nexakit-envelopes", JSON.stringify(envelopes));
  }, [envelopes, mounted]);

  if (activeTool !== "envelope-budget" || !mounted) return null;

  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  const addEnvelope = () => {
    if (!envName || !envLimit) return;
    setEnvelopes([...envelopes, { id: crypto.randomUUID(), name: envName, limit: Number(envLimit), spent: 0 }]);
    setEnvName(""); setEnvLimit("");
  };

  const logSpend = () => {
    if (!selectedEnvId || !spendAmount) return;
    setEnvelopes(envelopes.map(env => 
      env.id === selectedEnvId ? { ...env, spent: env.spent + Number(spendAmount) } : env
    ));
    setSpendAmount("");
  };

  const getEnvColor = (spent: number, limit: number) => {
    const pct = spent / limit;
    if (pct >= 0.9) return "bg-red-500";
    if (pct >= 0.75) return "bg-amber-400";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Digital Envelope Wallet</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Set fixed cash caps and log daily spending instantly.</p>
      <div className="flex items-center gap-2 mb-6 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-md w-fit border border-emerald-200 dark:border-emerald-800/50">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Data is securely saved in browser memory and persists on page refresh
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase text-xs tracking-wider">Create New Envelope</h3>
          <div className="flex flex-col gap-3">
            <input type="text" value={envName} onChange={e => setEnvName(e.target.value)} placeholder="Envelope Name (e.g. Groceries)" className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
            <div className="flex gap-2">
              <input type="number" value={envLimit} onChange={e => setEnvLimit(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Monthly Cap (£)" className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
              <button onClick={addEnvelope} className="px-6 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">Add</button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
          <h3 className="font-bold text-blue-700 dark:text-sky-400 mb-4 uppercase text-xs tracking-wider">Log a Transaction</h3>
          <div className="flex flex-col gap-3">
            <select value={selectedEnvId} onChange={e => setSelectedEnvId(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white">
              <option value="">Select Envelope...</option>
              {envelopes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="number" value={spendAmount} onChange={e => setSpendAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Spend Amount (£)" className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
              <button onClick={logSpend} className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Deduct</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {envelopes.map(env => (
          <div key={env.id} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg dark:text-white">{env.name}</span>
              <button onClick={() => setEnvelopes(envelopes.filter(e => e.id !== env.id))} className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="block text-[10px] uppercase text-slate-500">Remaining</span>
                <span className={`text-2xl font-black ${env.limit - env.spent < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                  {formatMoney(env.limit - env.spent)}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase text-slate-500">Cap</span>
                <span className="font-mono text-sm dark:text-slate-400">{formatMoney(env.limit)}</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 mt-3 overflow-hidden">
              <div className={`h-2 rounded-full transition-all duration-500 ${getEnvColor(env.spent, env.limit)}`} style={{ width: `${Math.min(100, (env.spent / env.limit) * 100)}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}