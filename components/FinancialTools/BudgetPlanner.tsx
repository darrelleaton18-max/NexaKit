"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string; planned: number; spent: number; cleared: boolean };

export default function BudgetPlanner({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [income, setIncome] = useState<number>(3000);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [newName, setNewName] = useState("");
  const [newPlanned, setNewPlanned] = useState<number | "">("");

  useEffect(() => {
    const savedInc = localStorage.getItem("nexakit-income");
    const savedCats = localStorage.getItem("nexakit-categories");
    if (savedInc) setIncome(Number(savedInc));
    if (savedCats) setCategories(JSON.parse(savedCats));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nexakit-income", income.toString());
      localStorage.setItem("nexakit-categories", JSON.stringify(categories));
    }
  }, [income, categories, mounted]);

  if (activeTool !== "budget-planner" || !mounted) return null;

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingToBudget = income - totalPlanned;
  
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  const addCategory = () => {
    if (!newName || !newPlanned) return;
    setCategories([...categories, { id: crypto.randomUUID(), name: newName, planned: Number(newPlanned), spent: 0, cleared: false }]);
    setNewName(""); setNewPlanned("");
  };

  const updateSpent = (id: string, spent: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, spent } : c));
  };

  const toggleCleared = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, cleared: !c.cleared } : c));
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Zero-Based Budget Planner</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Give every pound a job. Data saves automatically.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Monthly Income</label>
          <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full bg-transparent text-2xl font-black text-slate-800 dark:text-white focus:outline-none" />
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Total Planned</label>
          <span className="text-2xl font-black text-slate-800 dark:text-white">{formatMoney(totalPlanned)}</span>
        </div>
        <div className={`p-4 rounded-xl border ${remainingToBudget === 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/30'}`}>
          <label className={`block text-xs font-bold mb-1 uppercase ${remainingToBudget === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>Remaining to Budget</label>
          <span className={`text-2xl font-black ${remainingToBudget === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-sky-400'}`}>{formatMoney(remainingToBudget)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category (e.g. Groceries)" className="flex-1 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <input type="number" value={newPlanned} onChange={e => setNewPlanned(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Planned (£)" className="w-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <button onClick={addCategory} className="px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg transition-colors">Add</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <th className="pb-3 w-10">Done</th>
              <th className="pb-3">Category</th>
              <th className="pb-3 text-right">Planned</th>
              <th className="pb-3 text-right">Actual Spent</th>
              <th className="pb-3 text-right w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map(cat => (
              <tr key={cat.id} className={cat.cleared ? "opacity-50" : ""}>
                <td className="py-3"><input type="checkbox" checked={cat.cleared} onChange={() => toggleCleared(cat.id)} className="w-5 h-5 cursor-pointer accent-emerald-500" /></td>
                <td className="py-3 font-semibold dark:text-white">{cat.name}</td>
                <td className="py-3 text-right font-mono dark:text-slate-300">{formatMoney(cat.planned)}</td>
                <td className="py-3 text-right">
                  <input type="number" value={cat.spent} onChange={e => updateSpent(cat.id, Number(e.target.value))} className="w-24 p-2 text-right border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded font-mono dark:text-white" />
                </td>
                <td className="py-3 text-right"><button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="text-red-400 hover:text-red-600 font-bold ml-4">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}