"use client";

import { useState } from "react";

export default function PrimeGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "prime-gen") return null;

  const [checkNum, setCheckNum] = useState<number | "">(17);
  
  const isPrime = (num: number) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };

  const getNextPrime = (start: number) => {
    let current = start + 1;
    while (!isPrime(current)) current++;
    return current;
  };

  const numToCheck = Number(checkNum) || 0;
  const isNumPrime = isPrime(numToCheck);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Prime Number Checker</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Verify if a number is prime and easily locate the next closest prime.</p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Enter Number</label>
          <input type="number" value={checkNum} onChange={(e) => setCheckNum(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-4 text-2xl font-mono border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white text-center" />
        </div>
        
        <div className="w-full sm:w-1/2">
          {checkNum !== "" && (
            <div className={`p-5 rounded-xl border-2 text-center h-full flex flex-col justify-center ${isNumPrime ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/30 dark:border-emerald-700' : 'bg-red-50 border-red-400 dark:bg-red-900/30 dark:border-red-800'}`}>
              <span className={`text-2xl font-black ${isNumPrime ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {isNumPrime ? "Yes, it is Prime!" : "No, not Prime."}
              </span>
            </div>
          )}
        </div>
      </div>

      {checkNum !== "" && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex justify-between items-center">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Next closest prime number:</span>
          <span className="text-xl font-mono font-bold text-blue-600 dark:text-sky-400">{getNextPrime(numToCheck)}</span>
        </div>
      )}
    </div>
  );
}