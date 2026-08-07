"use client";

import { useState } from "react";

export default function AgeCalculator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "age-calc") return null;

  const [dob, setDob] = useState("");

  const calculateAge = () => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) return "future";

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Next Birthday
    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, daysToBday };
  };

  const age = calculateAge();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Precise Age Calculator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Calculate your exact age and see how many days you've lived.</p>

      <div className="mb-8">
        <label className="block text-xs font-bold mb-2 dark:text-slate-300">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full md:w-1/2 p-4 text-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white font-medium cursor-pointer shadow-sm" />
      </div>

      {age === "future" ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center font-bold">You can't be born in the future!</div>
      ) : age ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-widest">Exact Age</span>
            <span className="text-4xl font-black text-slate-800 dark:text-white">
              {age.years} <span className="text-xl font-bold text-slate-400 dark:text-slate-500">yrs</span> {age.months} <span className="text-xl font-bold text-slate-400 dark:text-slate-500">mos</span> {age.days} <span className="text-xl font-bold text-slate-400 dark:text-slate-500">days</span>
            </span>
          </div>

          <div className="grid grid-rows-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 flex justify-between items-center px-6">
              <span className="text-sm font-bold text-blue-700 dark:text-sky-400 uppercase">Total Days Lived</span>
              <span className="text-2xl font-mono font-black text-blue-900 dark:text-white">{age.totalDays.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 flex justify-between items-center px-6">
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase">Days until Birthday</span>
              <span className="text-2xl font-mono font-black text-amber-900 dark:text-white">{age.daysToBday}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}