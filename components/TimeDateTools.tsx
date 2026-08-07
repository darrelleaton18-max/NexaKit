"use client";

import { useState, useEffect, useRef } from "react";

export default function TimeDateTools({ activeTool }: { activeTool: string }) {
  // If a time/date tool isn't active, don't render anything or run interval timers
  if (!["stopwatch", "countdown", "date-diff", "age-calc", "timezone"].includes(activeTool)) {
    return null;
  }

  // ==========================================
  // 1. STOPWATCH STATE
  // ==========================================
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (swRunning) {
      const start = Date.now() - swTime;
      swRef.current = setInterval(() => setSwTime(Date.now() - start), 10);
    } else if (swRef.current) clearInterval(swRef.current);
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning, swTime]);

  const formatStopwatch = () => {
    const ms = Math.floor((swTime % 1000) / 10).toString().padStart(2, "0");
    const sec = Math.floor((swTime / 1000) % 60).toString().padStart(2, "0");
    const min = Math.floor((swTime / (1000 * 60)) % 60).toString().padStart(2, "0");
    return `${min}:${sec}.${ms}`;
  };

  // ==========================================
  // 2. COUNTDOWN TIMER STATE
  // ==========================================
  const [cdInputMin, setCdInputMin] = useState<number | "">(5);
  const [cdTime, setCdTime] = useState(300);
  const [cdRunning, setCdRunning] = useState(false);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cdRunning && cdTime > 0) {
      cdRef.current = setInterval(() => setCdTime((t) => t - 1), 1000);
    } else if (cdTime === 0 && cdRunning) {
      setCdRunning(false);
      alert("⏰ Countdown finished!");
    } else if (cdRef.current) clearInterval(cdRef.current);
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [cdRunning, cdTime]);

  const startCountdown = () => {
    setCdTime((Number(cdInputMin) || 1) * 60);
    setCdRunning(true);
  };

  // ==========================================
  // 3. DATE DIFFERENCE STATE
  // ==========================================
  const [dateA, setDateA] = useState("2026-01-01");
  const [dateB, setDateB] = useState("2026-12-31");
  
  const calculateDateDiff = () => {
    const d1 = new Date(dateA);
    const d2 = new Date(dateB);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days, weeks: (days / 7).toFixed(1), months: (days / 30.4375).toFixed(1) };
  };
  const dateDiffData = calculateDateDiff();

  // ==========================================
  // 4. AGE CALCULATOR STATE
  // ==========================================
  const [dob, setDob] = useState("1995-06-15");
  
  const calculateAge = () => {
    if (!dob) return { years: 0, months: 0, days: 0 };
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }
    return { years, months, days };
  };
  const ageData = calculateAge();

  // ==========================================
  // 5. TIMEZONE CONVERTER STATE
  // ==========================================
  const [baseTime, setBaseTime] = useState("12:00");

  const convertTimezones = () => {
    const [hrs, mins] = baseTime.split(":").map(Number);
    const now = new Date();
    now.setHours(hrs || 0, mins || 0, 0, 0);

    const formatZone = (timeZone: string) => {
      try { return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: true }).format(now); } 
      catch { return "--:--"; }
    };

    return {
      London: formatZone("Europe/London"),
      NewYork: formatZone("America/New_York"),
      Tokyo: formatZone("Asia/Tokyo"),
      Sydney: formatZone("Australia/Sydney"),
    };
  };
  const tzData = convertTimezones();

  return (
    <>
      {activeTool === "stopwatch" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Precision Stopwatch</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">A highly accurate digital stopwatch with millisecond precision.</p>
          <div className="text-4xl md:text-5xl font-mono font-bold my-8 dark:text-white">{formatStopwatch()}</div>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setSwRunning(true)} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">Start</button>
            <button onClick={() => setSwRunning(false)} className="bg-slate-600 text-white font-semibold px-6 py-2 rounded-lg">Pause</button>
            <button onClick={() => { setSwRunning(false); setSwTime(0); }} className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg">Reset</button>
          </div>
        </div>
      )}

      {activeTool === "countdown" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Countdown Timer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Set a custom timer that counts down to zero in minutes and seconds.</p>
          <div className="flex justify-center items-center gap-3 my-4">
            <input type="number" value={cdInputMin} onChange={(e) => setCdInputMin(e.target.value === "" ? "" : Number(e.target.value))} className="p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded w-24 text-center font-bold dark:text-white" />
            <span className="text-sm font-semibold dark:text-slate-300">Minutes</span>
          </div>
          <div className="text-4xl md:text-5xl font-mono font-bold my-6 dark:text-white">{Math.floor(cdTime / 60).toString().padStart(2, "0")}:{(cdTime % 60).toString().padStart(2, "0")}</div>
          <div className="flex justify-center gap-3">
            <button onClick={startCountdown} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">Start</button>
            <button onClick={() => setCdRunning(false)} className="bg-slate-600 text-white font-semibold px-6 py-2 rounded-lg">Pause</button>
          </div>
        </div>
      )}

      {activeTool === "date-diff" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Date Difference Calculator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Find the exact number of days, weeks, and months between two dates.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Start Date</label><input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">End Date</label><input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-blue-600 dark:text-sky-400">DAYS</span><span className="block text-2xl font-bold text-blue-900 dark:text-sky-200 mt-1">{dateDiffData.days}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs font-bold text-slate-600 dark:text-slate-400">WEEKS</span><span className="block text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{dateDiffData.weeks}</span></div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">MONTHS</span><span className="block text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">{dateDiffData.months}</span></div>
          </div>
        </div>
      )}

      {activeTool === "age-calc" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Age Calculator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Calculate precise age in years, months, and days from a birthdate.</p>
          <div className="mb-6"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-blue-600 dark:text-sky-400">YEARS</span><span className="block text-3xl font-black text-blue-900 dark:text-sky-200 mt-1">{ageData.years}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs font-bold text-slate-600 dark:text-slate-400">MONTHS</span><span className="block text-3xl font-black text-slate-800 dark:text-slate-200 mt-1">{ageData.months}</span></div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DAYS</span><span className="block text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">{ageData.days}</span></div>
          </div>
        </div>
      )}

      {activeTool === "timezone" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">World Clock & Timezone Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Compare local time against major global timezones like London, New York, Tokyo, and Sydney.</p>
          <div className="mb-6"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Local Time</label><input type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">LONDON (BST/GMT)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.London}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">NEW YORK (EST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.NewYork}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">TOKYO (JST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.Tokyo}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">SYDNEY (AEST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.Sydney}</span></div>
          </div>
        </div>
      )}
    </>
  );
}