"use client";

import { useState, useEffect } from "react";

type Item = { id: string; name: string; value: number };

export default function NetWorthTracker({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<Item[]>([]);
  const [liabilities, setLiabilities] = useState<Item[]>([]);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState<number | "">("");

  useEffect(() => {
    const savedAssets = localStorage.getItem("nexakit-assets");
    const savedLiabs = localStorage.getItem("nexakit-liabs");
    if (savedAssets) setAssets(JSON.parse(savedAssets));
    if (savedLiabs) setLiabilities(JSON.parse(savedLiabs));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nexakit-assets", JSON.stringify(assets));
      localStorage.setItem("nexakit-liabs", JSON.stringify(liabilities));
    }
  }, [assets, liabilities, mounted]);

  if (activeTool !== "net-worth" || !mounted) return null;

  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const addItem = (type: "asset" | "liability") => {
    if (!newName || !newValue) return;
    const newItem = { id: crypto.randomUUID(), name: newName, value: Number(newValue) };
    if (type === "asset") setAssets([...assets, newItem]);
    else setLiabilities([...liabilities, newItem]);
    setNewName(""); setNewValue("");
  };

  const removeItem = (id: string, type: "asset" | "liability") => {
    if (type === "asset") setAssets(assets.filter(a => a.id !== id));
    else setLiabilities(liabilities.filter(l => l.id !== id));
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Net Worth & Asset Tracker</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Your data is securely saved only in your local browser.</p>

      <div className={`p-6 rounded-xl border mb-8 text-center ${netWorth >= 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30' : 'bg-red-50 border-red-200 dark:bg-red-900/30'}`}>
        <span className="block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Total Net Worth</span>
        <span className={`text-4xl md:text-5xl font-black ${netWorth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{formatMoney(netWorth)}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Savings Account" className="flex-1 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <input type="number" value={newValue} onChange={e => setNewValue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount (£)" className="w-full md:w-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <button onClick={() => addItem("asset")} className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">+ Asset</button>
        <button onClick={() => addItem("liability")} className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">+ Liability</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-700">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400">Assets (What you own)</h3>
            <span className="font-bold dark:text-white">{formatMoney(totalAssets)}</span>
          </div>
          <div className="space-y-2">
            {assets.map(a => (
              <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="dark:text-slate-300 font-medium">{a.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono dark:text-white">{formatMoney(a.value)}</span>
                  <button onClick={() => removeItem(a.id, "asset")} className="text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-700">
            <h3 className="font-bold text-red-600 dark:text-red-400">Liabilities (What you owe)</h3>
            <span className="font-bold dark:text-white">{formatMoney(totalLiabilities)}</span>
          </div>
          <div className="space-y-2">
            {liabilities.map(l => (
              <div key={l.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="dark:text-slate-300 font-medium">{l.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono dark:text-white">{formatMoney(l.value)}</span>
                  <button onClick={() => removeItem(l.id, "liability")} className="text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}