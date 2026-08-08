"use client";

import { useState, useEffect } from "react";

type Sub = { id: string; name: string; cost: number; cycle: "monthly" | "annual"; nextDate: string };

export default function SubscriptionTracker({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState<number | "">("");
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nexakit-subs");
    if (saved) setSubs(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("nexakit-subs", JSON.stringify(subs));
  }, [subs, mounted]);

  if (activeTool !== "sub-tracker" || !mounted) return null;

  const totalMonthly = subs.reduce((sum, sub) => sum + (sub.cycle === "monthly" ? sub.cost : sub.cost / 12), 0);
  const totalAnnual = subs.reduce((sum, sub) => sum + (sub.cycle === "annual" ? sub.cost : sub.cost * 12), 0);
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  const addSub = () => {
    if (!name || !cost) return;
    setSubs([...subs, { id: crypto.randomUUID(), name, cost: Number(cost), cycle, nextDate }]);
    setName(""); setCost("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Recurring Subscriptions</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Audit your monthly leaks and track upcoming billing dates.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
          <span className="block text-sm font-bold text-blue-600 dark:text-sky-400 uppercase mb-1">True Monthly Cost</span>
          <span className="text-3xl font-black text-blue-900 dark:text-white">{formatMoney(totalMonthly)}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">True Annual Cost</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white">{formatMoney(totalAnnual)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Service (Netflix, Gym...)" className="flex-1 min-w-[150px] p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <input type="number" value={cost} onChange={e => setCost(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Cost (£)" className="w-24 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <select value={cycle} onChange={e => setCycle(e.target.value as "monthly" | "annual")} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white">
          <option value="monthly">Monthly</option>
          <option value="annual">Yearly</option>
        </select>
        <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" title="Next Billing Date" />
        <button onClick={addSub} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Add</button>
      </div>

      <div className="space-y-3">
        {subs.sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()).map(s => (
          <div key={s.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="mb-2 sm:mb-0">
              <span className="font-bold text-lg dark:text-white block">{s.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Renews: {s.nextDate || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg dark:text-white font-bold">{formatMoney(s.cost)} <span className="text-sm font-normal text-slate-500">/{s.cycle === 'monthly' ? 'mo' : 'yr'}</span></span>
              <button onClick={() => setSubs(subs.filter(x => x.id !== s.id))} className="text-red-400 hover:text-red-600 font-bold px-2">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}