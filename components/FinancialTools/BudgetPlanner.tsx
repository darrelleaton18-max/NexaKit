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
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Zero-Based Budget Planner</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">Give every pound a job.</p>
      <div className="flex items-center gap-2 mb-6 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-md w-fit border border-emerald-200 dark:border-emerald-800/50">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Data is securely saved in browser memory and persists on page refresh
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <label className="block text-xs font-bold mb-1 text-neutral-500 uppercase">Monthly Income</label>
          <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full bg-transparent text-2xl font-black text-neutral-800 dark:text-white focus:outline-none" />
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <label className="block text-xs font-bold mb-1 text-neutral-500 uppercase">Total Planned</label>
          <span className="text-2xl font-black text-neutral-800 dark:text-white">{formatMoney(totalPlanned)}</span>
        </div>
        <div className={`p-4 rounded-xl border ${remainingToBudget === 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30' : 'bg-orange-50 border-orange-200 dark:bg-orange-900/30'}`}>
          <label className={`block text-xs font-bold mb-1 uppercase ${remainingToBudget === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>Remaining to Budget</label>
          <span className={`text-2xl font-black ${remainingToBudget === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-700 dark:text-sky-400'}`}>{formatMoney(remainingToBudget)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category (e.g. Groceries)" className="flex-1 p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
        <input type="number" value={newPlanned} onChange={e => setNewPlanned(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Planned (£)" className="w-32 p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
        <button onClick={addCategory} className="px-4 bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-bold rounded-lg transition-colors">Add</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700 text-sm text-neutral-500 dark:text-neutral-400">
              <th className="pb-3 w-10">Done</th>
              <th className="pb-3">Category</th>
              <th className="pb-3 text-right">Planned</th>
              <th className="pb-3 text-right">Actual Spent</th>
              <th className="pb-3 text-right w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {categories.map(cat => (
              <tr key={cat.id} className={cat.cleared ? "opacity-50" : ""}>
                <td className="py-3"><input type="checkbox" checked={cat.cleared} onChange={() => toggleCleared(cat.id)} className="w-5 h-5 cursor-pointer accent-emerald-500" /></td>
                <td className="py-3 font-semibold dark:text-white">{cat.name}</td>
                <td className="py-3 text-right font-mono dark:text-neutral-300">{formatMoney(cat.planned)}</td>
                <td className="py-3 text-right">
                  <input type="number" value={cat.spent} onChange={e => updateSpent(cat.id, Number(e.target.value))} className="w-24 p-2 text-right border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded font-mono dark:text-white" />
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