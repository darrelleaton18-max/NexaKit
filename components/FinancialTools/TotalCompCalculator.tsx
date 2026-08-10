"use client";

import { useState, useEffect } from "react";

type Offer = { id: string; company: string; base: number; bonus: number; equity: number; match401k: number; healthInsCost: number; perkValue: number };

export default function TotalCompCalculator({ activeTool }: { activeTool: string }) {
  const [mounted, setMounted] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  const [company, setCompany] = useState("");
  const [base, setBase] = useState<number | "">("");
  const [bonus, setBonus] = useState<number | "">("");
  const [equity, setEquity] = useState<number | "">("");
  const [match401k, setMatch401k] = useState<number | "">("");
  const [healthInsCost, setHealthInsCost] = useState<number | "">("");
  const [perkValue, setPerkValue] = useState<number | "">("");

  useEffect(() => {
    const saved = localStorage.getItem("nexakit-offers");
    if (saved) setOffers(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("nexakit-offers", JSON.stringify(offers));
  }, [offers, mounted]);

  if (activeTool !== "comp-calc" || !mounted) return null;

  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);

  const addOffer = () => {
    if (!company || !base) return;
    setOffers([...offers, { id: crypto.randomUUID(), company, base: Number(base), bonus: Number(bonus)||0, equity: Number(equity)||0, match401k: Number(match401k)||0, healthInsCost: Number(healthInsCost)||0, perkValue: Number(perkValue)||0 }]);
    setCompany(""); setBase(""); setBonus(""); setEquity(""); setMatch401k(""); setHealthInsCost(""); setPerkValue("");
  };

  const calculateTotal = (o: Offer) => (o.base + o.bonus + o.equity + o.match401k + o.perkValue) - o.healthInsCost;

  const sortedOffers = [...offers].sort((a, b) => calculateTotal(b) - calculateTotal(a));

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Total Compensation Calculator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">Compare job offers by evaluating their true monetary value.</p>
      <div className="flex items-center gap-2 mb-6 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-md w-fit border border-emerald-200 dark:border-emerald-800/50">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        Data is securely saved in browser memory and persists on page refresh
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-8">
        <h3 className="font-bold text-neutral-700 dark:text-neutral-200 mb-4 uppercase text-xs tracking-wider">Add a Job Offer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company Name" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={base} onChange={e => setBase(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Base Salary (£)" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={bonus} onChange={e => setBonus(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Annual Bonus (£)" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={equity} onChange={e => setEquity(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Annual Equity/Stock (£)" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={match401k} onChange={e => setMatch401k(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Pension Match (£)" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={healthInsCost} onChange={e => setHealthInsCost(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Health Premiums (£) [Deduction]" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <input type="number" value={perkValue} onChange={e => setPerkValue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Other Perks Value (£)" className="p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
          <button onClick={addOffer} className="p-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors">Add Offer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sortedOffers.map((o, i) => {
          const total = calculateTotal(o);
          return (
            <div key={o.id} className={`p-5 rounded-xl border ${i === 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 shadow-md' : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'}`}>
              <div className="flex justify-between items-start mb-4 border-b border-neutral-200 dark:border-neutral-700 pb-4">
                <div>
                  {i === 0 && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">Top Offer</span>}
                  <span className="font-bold text-xl dark:text-white">{o.company}</span>
                </div>
                <button onClick={() => setOffers(offers.filter(x => x.id !== o.id))} className="text-neutral-400 hover:text-red-500 font-bold">×</button>
              </div>
              
              <div className="space-y-2 mb-4 text-sm dark:text-neutral-300 font-mono">
                <div className="flex justify-between"><span>Base:</span> <span>{formatMoney(o.base)}</span></div>
                {o.bonus > 0 && <div className="flex justify-between text-orange-600 dark:text-sky-400"><span>Bonus:</span> <span>+{formatMoney(o.bonus)}</span></div>}
                {o.equity > 0 && <div className="flex justify-between text-orange-600 dark:text-sky-400"><span>Equity:</span> <span>+{formatMoney(o.equity)}</span></div>}
                {o.match401k > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Pension:</span> <span>+{formatMoney(o.match401k)}</span></div>}
                {o.perkValue > 0 && <div className="flex justify-between text-purple-600 dark:text-purple-400"><span>Perks:</span> <span>+{formatMoney(o.perkValue)}</span></div>}
                {o.healthInsCost > 0 && <div className="flex justify-between text-red-500"><span>Healthcare:</span> <span>-{formatMoney(o.healthInsCost)}</span></div>}
              </div>

              <div className={`pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center ${i === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-800 dark:text-white'}`}>
                <span className="font-bold uppercase text-xs">Total Value</span>
                <span className="text-2xl font-black">{formatMoney(total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}