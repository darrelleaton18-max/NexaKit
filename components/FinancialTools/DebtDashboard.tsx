"use client";

import { useState, useEffect } from "react";

type Debt = { id: string; name: string; balance: number; rate: number; minPay: number };

export default function DebtDashboard({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("snowball");
  const [extraPay, setExtraPay] = useState<number>(0);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [minPay, setMinPay] = useState<number | "">("");

  useEffect(() => {
    const saved = localStorage.getItem("nexakit-debts");
    if (saved) setDebts(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("nexakit-debts", JSON.stringify(debts));
  }, [debts, mounted]);

  if (activeTool !== "debt-dash" || !mounted) return null;

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMin = debts.reduce((sum, d) => sum + d.minPay, 0);
  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

  const addDebt = () => {
    if (!name || !balance || !minPay) return;
    setDebts([...debts, { id: crypto.randomUUID(), name, balance: Number(balance), rate: Number(rate)||0, minPay: Number(minPay) }]);
    setName(""); setBalance(""); setRate(""); setMinPay("");
  };

  // Sort based on strategy
  const sortedDebts = [...debts].sort((a, b) => strategy === "snowball" ? a.balance - b.balance : b.rate - a.rate);

  // Very simplified payoff simulator
  const calculateMonthsToFreedom = () => {
    let currentDebts = sortedDebts.map(d => ({ ...d }));
    let months = 0;
    let rollover = 0;
    
    if (currentDebts.length === 0) return 0;
    
    // Safety break at 600 months (50 years) to prevent infinite loops if min payments don't cover interest
    while (currentDebts.length > 0 && months < 600) {
      months++;
      let availableExtra = extraPay + rollover;
      rollover = 0;

      for (let i = 0; i < currentDebts.length; i++) {
        let d = currentDebts[i];
        let interest = d.balance * (d.rate / 100 / 12);
        d.balance += interest;
        
        let payment = d.minPay;
        if (i === 0) { // Apply extra to the target debt
          payment += availableExtra;
          availableExtra = 0;
        }

        if (payment >= d.balance) {
          rollover += (payment - d.balance) + d.minPay; // Add their min payment to rollover for next month
          d.balance = 0;
        } else {
          d.balance -= payment;
        }
      }
      currentDebts = currentDebts.filter(d => d.balance > 0);
    }
    return months;
  };

  const monthsToFreedom = calculateMonthsToFreedom();
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + monthsToFreedom);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Debt Eradication Dashboard</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Simulate Snowball or Avalanche methods to find your exact debt-free date.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800">
          <span className="block text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-1">Total Debt</span>
          <span className="text-2xl font-black text-red-900 dark:text-white">{formatMoney(totalDebt)}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Payment</span>
          <span className="text-2xl font-black dark:text-white">{formatMoney(totalMin + extraPay)}</span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Debt Free Date</span>
          <span className="text-2xl font-black text-emerald-900 dark:text-white">
            {monthsToFreedom >= 600 ? "Never (Increase Payments)" : monthsToFreedom === 0 ? "Debt Free!" : freedomDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex-1">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Strategy</label>
          <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
            <button onClick={() => setStrategy("snowball")} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${strategy === "snowball" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Snowball (Lowest Bal)</button>
            <button onClick={() => setStrategy("avalanche")} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${strategy === "avalanche" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>Avalanche (High Rate)</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Extra Monthly Payment (£)</label>
          <input type="number" value={extraPay} onChange={e => setExtraPay(Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Card/Loan Name" className="flex-1 min-w-[140px] p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <input type="number" value={balance} onChange={e => setBalance(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Balance (£)" className="w-28 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <input type="number" value={rate} onChange={e => setRate(e.target.value === "" ? "" : Number(e.target.value))} placeholder="APR (%)" className="w-24 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <input type="number" value={minPay} onChange={e => setMinPay(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Min Pay (£)" className="w-28 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        <button onClick={addDebt} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg transition-colors">Add</button>
      </div>

      <div className="space-y-2">
        {sortedDebts.map((d, i) => (
          <div key={d.id} className={`flex flex-wrap justify-between items-center p-4 rounded-xl border ${i === 0 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{i + 1}</span>
              <span className="font-bold dark:text-white">{d.name} <span className="text-xs font-normal text-slate-500 ml-2">{d.rate}% APR</span></span>
            </div>
            <div className="flex items-center gap-6 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
              <div className="text-right">
                <span className="block text-[10px] uppercase text-slate-500">Balance</span>
                <span className="font-mono font-bold dark:text-white">{formatMoney(d.balance)}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase text-slate-500">Min Pay</span>
                <span className="font-mono dark:text-slate-300">{formatMoney(d.minPay)}</span>
              </div>
              <button onClick={() => setDebts(debts.filter(x => x.id !== d.id))} className="text-red-400 hover:text-red-600 font-bold ml-2">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}