"use client";

import { useState, useEffect } from "react";

export default function WorldClock({ activeTool }: { activeTool: string }) {
  if (activeTool !== "timezone") return null;

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timezones = [
    { city: "Local Time", tz: Intl.DateTimeFormat().resolvedOptions().timeZone, flag: "📍" },
    { city: "New York", tz: "America/New_York", flag: "🇺🇸" },
    { city: "London", tz: "Europe/London", flag: "🇬🇧" },
    { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { city: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
    { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">World Clock & Timezones</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Track live times across major global financial hubs.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {timezones.map((t, idx) => {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: t.tz,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: t.tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div key={idx} className={`p-5 rounded-xl border ${idx === 0 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.city}</span>
                <span className="text-lg">{t.flag}</span>
              </div>
              <div className="text-3xl font-black font-mono text-slate-800 dark:text-white tabular-nums tracking-tight">
                {formatter.format(time)}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {dateFormatter.format(time)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}