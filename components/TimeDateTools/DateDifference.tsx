"use client";

import { useState } from "react";

export default function DateDifference({ activeTool }: { activeTool: string }) {
  if (activeTool !== "date-diff") return null;

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const calculateDiff = () => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let workingDays = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) workingDays++;
      cur.setDate(cur.getDate() + 1);
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const tempDate = new Date(end.getFullYear(), end.getMonth(), 0);
      days += tempDate.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days, totalDays, totalWeeks: (totalDays / 7).toFixed(1), workingDays };
  };

  const res = calculateDiff();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Date Difference Calculator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Find the exact span between two dates, including business days.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium cursor-pointer" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium cursor-pointer" />
        </div>
      </div>

      {res ? (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-xl text-center">
            <span className="block text-sm font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider mb-2">Exact Breakdown</span>
            <span className="text-xl md:text-3xl font-black text-blue-900 dark:text-white">
              {res.years > 0 && `${res.years} Years, `}
              {res.months > 0 && `${res.months} Months, `}
              {res.days} Days
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Total Days</span>
              <span className="text-2xl font-mono font-bold text-slate-800 dark:text-white">{res.totalDays}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Total Weeks</span>
              <span className="text-2xl font-mono font-bold text-slate-800 dark:text-white">{res.totalWeeks}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
              <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase mb-1">Working Days (Mon-Fri)</span>
              <span className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-400">{res.workingDays}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 font-medium">
          Select two dates above to see the breakdown.
        </div>
      )}
    </div>
  );
}