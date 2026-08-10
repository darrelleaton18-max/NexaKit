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
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">World Clock & Timezones</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Track live times across major global financial hubs.</p>

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
            <div key={idx} className={`p-5 rounded-xl border ${idx === 0 ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50' : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-700'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{t.city}</span>
                <span className="text-lg">{t.flag}</span>
              </div>
              <div className="text-3xl font-black font-mono text-neutral-800 dark:text-white tabular-nums tracking-tight">
                {formatter.format(time)}
              </div>
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                {dateFormatter.format(time)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}