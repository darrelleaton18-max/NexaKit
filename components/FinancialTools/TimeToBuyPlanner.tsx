"use client";

import { useState } from "react";

export default function TimeToBuyPlanner({ activeTool }: { activeTool: string }) {
  if (activeTool !== "time-to-buy") return null;

  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState<number | "">("");
  const [hourlyWage, setHourlyWage] = useState<number | "">("");
  const [hoursPerDay, setHoursPerDay] = useState<number | "">(8);

  const calculateTime = () => {
    const cost = Number(itemCost) || 0;
    const wage = Number(hourlyWage) || 0;
    const hours = Number(hoursPerDay) || 8;
    
    if (wage <= 0 || cost <= 0) return { hours: 0, days: 0, weeks: 0 };
    
    const totalHours = cost / wage;
    return {
      hours: totalHours.toFixed(1),
      days: (totalHours / hours).toFixed(1),
      weeks: (totalHours / (hours * 5)).toFixed(1)
    };
  };

  const time = calculateTime();

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">"Time-to-Buy" Milestone Planner</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Convert the cost of a luxury purchase into the actual hours of your life required to afford it.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-neutral-300">What do you want to buy?</label>
            <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. New MacBook Pro" className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Item Cost (£)</label>
            <input type="number" value={itemCost} onChange={e => setItemCost(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 2500" className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Your Hourly Wage (Post-Tax) (£)</label>
              <input type="number" value={hourlyWage} onChange={e => setHourlyWage(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 20" className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Working Hours per Day</label>
              <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col justify-center items-center text-center">
          <span className="block text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">True Cost in Time</span>
          
          <div className="text-5xl font-black text-amber-600 dark:text-amber-400 mb-2">
            {time.hours} <span className="text-xl font-bold text-neutral-400">Hours</span>
          </div>
          
          <div className="flex gap-4 mt-4 text-sm font-bold text-neutral-600 dark:text-neutral-300">
            <span>≈ {time.days} Work Days</span>
            <span>|</span>
            <span>≈ {time.weeks} Work Weeks</span>
          </div>

          {Number(time.hours) > 0 && (
            <p className="mt-6 text-xs text-neutral-500 italic px-4">
              "Is the <strong className="text-neutral-700 dark:text-white">{itemName || 'item'}</strong> worth <strong className="text-amber-600 dark:text-amber-400">{time.days} days</strong> of your working life?"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}