"use client";

import { useState, useEffect } from "react";

type Expense = { id: string; date: string; category: string; amount: number; purpose: string };

export default function FreelanceExpenseLog({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Software");
  const [amount, setAmount] = useState<number | "">("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("nexakit-expenses");
    if (saved) setExpenses(JSON.parse(saved));
    setDate(new Date().toISOString().split('T')[0]);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("nexakit-expenses", JSON.stringify(expenses));
  }, [expenses, mounted]);

  if (activeTool !== "freelance-log" || !mounted) return null;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  const addExpense = () => {
    if (!date || !amount || !purpose) return;
    setExpenses([{ id: crypto.randomUUID(), date, category, amount: Number(amount), purpose }, ...expenses]);
    setAmount(""); setPurpose("");
  };

  const exportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ["Date", "Category", "Amount", "Purpose/Description"];
    const rows = expenses.map(e => `"${e.date}","${e.category}","${e.amount}","${e.purpose}"`);
    const csvContent = [headers.join(","), ...rows].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `freelance-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Freelance Expense Log</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Log business deductions quickly and export to CSV for tax season.</p>
        </div>
        <button onClick={exportCSV} disabled={expenses.length === 0} className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          📥 Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white">
          <option value="Software">Software & Hosting</option>
          <option value="Mileage">Mileage/Travel</option>
          <option value="Meals">Business Meals</option>
          <option value="Hardware">Hardware/Supplies</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount (£)" className="w-28 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Purpose/Description" className="flex-1 min-w-[200px] p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        <button onClick={addExpense} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Log</button>
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold dark:text-white">Logged Expenses</h3>
        <span className="font-black text-lg dark:text-white">Total: <span className="text-blue-600 dark:text-sky-400">{formatMoney(totalExpenses)}</span></span>
      </div>

      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Description</th>
              <th className="p-3 font-semibold text-right">Amount</th>
              <th className="p-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {expenses.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500 font-sans italic">No expenses logged yet.</td></tr>
            ) : (
              expenses.map(e => (
                <tr key={e.id} className="dark:text-slate-300">
                  <td className="p-3">{e.date}</td>
                  <td className="p-3"><span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md text-[10px] font-sans font-bold uppercase tracking-wider">{e.category}</span></td>
                  <td className="p-3 font-sans truncate max-w-[200px]">{e.purpose}</td>
                  <td className="p-3 text-right font-bold">{formatMoney(e.amount)}</td>
                  <td className="p-3 text-right"><button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} className="text-red-400 hover:text-red-600 text-lg">×</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}