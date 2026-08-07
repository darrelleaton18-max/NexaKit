"use client";

import { useState } from "react";

export default function MathTools({ activeTool }: { activeTool: string }) {
  // If a math tool isn't active, don't render anything or run logic
  if (!["pct-calc", "unit-converter", "stats-calc", "prime-gen", "base-converter"].includes(activeTool)) {
    return null;
  }
  
  // ... rest of the code

  // ==========================================
  // 1. PERCENTAGE CALCULATOR STATE
  // ==========================================
  const [pctValA, setPctValA] = useState<number | "">(20);
  const [pctValB, setPctValB] = useState<number | "">(150);
  const [pctMode, setPctMode] = useState<"pctOf" | "isWhatPct" | "pctDiff">("pctOf");

  const calculatePercentage = () => {
    const a = Number(pctValA) || 0;
    const b = Number(pctValB) || 0;
    if (pctMode === "pctOf") return (a / 100) * b;
    if (pctMode === "isWhatPct") return b ? (a / b) * 100 : 0;
    if (pctMode === "pctDiff") return a ? ((b - a) / a) * 100 : 0;
    return 0;
  };

  // ==========================================
  // 2. UNIT CONVERTER STATE
  // ==========================================
  const [unitVal, setUnitVal] = useState<number | "">(1);
  const [unitFrom, setUnitFrom] = useState("kg");
  const [unitTo, setUnitTo] = useState("lbs");
  
  const convertUnits = () => {
    const val = Number(unitVal) || 0;
    const rates: Record<string, number> = { g: 1, kg: 1000, lbs: 453.592, oz: 28.3495 };
    return ((val * rates[unitFrom]) / rates[unitTo]).toFixed(4);
  };

  // ==========================================
  // 3. STATISTICS CALCULATOR STATE
  // ==========================================
  const [statsInput, setStatsInput] = useState("12, 15, 22, 29, 35, 42, 15");
  
  const calculateStats = () => {
    const nums = statsInput.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n !== 0 || n === 0);
    if (!nums.length) return { sum: 0, mean: 0, median: 0, min: 0, max: 0, count: 0 };
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return { sum, mean, median, min: sorted[0], max: sorted[sorted.length - 1], count: nums.length };
  };
  const statsData = calculateStats();

  // ==========================================
  // 4. PRIME NUMBER GENERATOR STATE
  // ==========================================
  const [primeLimit, setPrimeLimit] = useState<number | "">(100);
  const [primeResult, setPrimeResult] = useState("");
  
  const generatePrimes = () => {
    const limit = Number(primeLimit) || 100;
    if (limit > 100000) return setPrimeResult("Limit too high (max 100,000)");
    const isPrime = Array(limit + 1).fill(true);
    isPrime[0] = false; isPrime[1] = false;
    for (let p = 2; p * p <= limit; p++) {
      if (isPrime[p]) {
        for (let i = p * p; i <= limit; i += p) isPrime[i] = false;
      }
    }
    const primes = [];
    for (let p = 2; p <= limit; p++) if (isPrime[p]) primes.push(p);
    setPrimeResult(primes.join(", "));
  };

  // ==========================================
  // 5. BASE CONVERTER STATE
  // ==========================================
  const [baseInput, setBaseInput] = useState("255");
  const [baseFrom, setBaseFrom] = useState(10);
  const [baseTo, setBaseTo] = useState(16);
  
  const convertBase = () => {
    if (!baseInput) return "";
    try {
      const num = parseInt(baseInput, baseFrom);
      if (isNaN(num)) return "Invalid Input for chosen base";
      return num.toString(baseTo).toUpperCase();
    } catch {
      return "Error";
    }
  };

  return (
    <>
      {activeTool === "pct-calc" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Percentage Calculator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Easily calculate percentages, ratios, and percentage differences.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Calculation Type</label>
              <select value={pctMode} onChange={(e) => setPctMode(e.target.value as any)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                <option value="pctOf">What is X% of Y?</option>
                <option value="isWhatPct">X is what % of Y?</option>
                <option value="pctDiff">% Increase/Decrease from X to Y</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value X</label><input type="number" value={pctValA} onChange={(e) => setPctValA(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value Y</label><input type="number" value={pctValB} onChange={(e) => setPctValB(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Calculated Output:</span>
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all">{calculatePercentage().toFixed(2)}{pctMode !== "pctOf" ? "%" : ""}</span>
          </div>
        </div>
      )}

      {activeTool === "unit-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Metric / Unit Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert weights, measurements, and volumes between metric and imperial units.</p>
          <div className="mb-4"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value</label><input type="number" value={unitVal} onChange={(e) => setUnitVal(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">From</label><select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="kg">Kilograms (kg)</option><option value="g">Grams (g)</option><option value="lbs">Pounds (lbs)</option><option value="oz">Ounces (oz)</option></select></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">To</label><select value={unitTo} onChange={(e) => setUnitTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="lbs">Pounds (lbs)</option><option value="kg">Kilograms (kg)</option><option value="g">Grams (g)</option><option value="oz">Ounces (oz)</option></select></div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border border-slate-200 dark:border-slate-700"><span className="text-sm font-semibold dark:text-slate-300">Result:</span><span className="text-xl font-mono font-bold dark:text-sky-400 break-all">{convertUnits()} {unitTo}</span></div>
        </div>
      )}

      {activeTool === "stats-calc" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Statistics & Average Calculator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly find the sum, mean, median, minimum, and maximum of any dataset.</p>
          <textarea value={statsInput} onChange={(e) => setStatsInput(e.target.value)} className="w-full h-24 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" placeholder="Enter numbers separated by spaces or commas" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">MEAN (AVERAGE)</span><span className="block text-xl font-bold text-blue-600 dark:text-sky-400 mt-1 break-all">{statsData.mean.toFixed(2)}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">MEDIAN</span><span className="block text-xl font-bold text-blue-600 dark:text-sky-400 mt-1 break-all">{statsData.median}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">SUM</span><span className="block text-xl font-bold text-blue-600 dark:text-sky-400 mt-1 break-all">{statsData.sum}</span></div>
          </div>
        </div>
      )}

      {activeTool === "prime-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Prime Number Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate a list of prime numbers up to your specified limit.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Upper Limit (Max 100,000)</label>
              <input type="number" value={primeLimit} onChange={(e) => setPrimeLimit(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <button onClick={generatePrimes} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg">Generate Primes</button>
          </div>
          <textarea readOnly value={primeResult} placeholder="Primes will appear here..." className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-mono text-sm leading-relaxed dark:text-white" />
        </div>
      )}

      {activeTool === "base-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Number Base Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert numbers between Binary, Octal, Decimal, and Hexadecimal bases.</p>
          <div className="mb-4">
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input Value</label>
            <input type="text" value={baseInput} onChange={(e) => setBaseInput(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-mono uppercase dark:text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Convert From</label>
              <select value={baseFrom} onChange={(e) => setBaseFrom(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white">
                <option value={2}>Binary (Base 2)</option><option value={8}>Octal (Base 8)</option><option value={10}>Decimal (Base 10)</option><option value={16}>Hexadecimal (Base 16)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Convert To</label>
              <select value={baseTo} onChange={(e) => setBaseTo(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white">
                <option value={2}>Binary (Base 2)</option><option value={8}>Octal (Base 8)</option><option value={10}>Decimal (Base 10)</option><option value={16}>Hexadecimal (Base 16)</option>
              </select>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Converted Result:</span>
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all">{convertBase()}</span>
          </div>
        </div>
      )}
    </>
  );
}