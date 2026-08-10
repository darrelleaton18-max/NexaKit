"use client";

import { useState } from "react";

export default function NumberGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "num-gen") return null;

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [result, setResult] = useState<number[]>([]);

  const generateNumbers = () => {
    if (min >= max) {
      alert("Min value must be less than Max value.");
      return;
    }
    
    if (unique && count > (max - min + 1)) {
      alert("Cannot generate that many unique numbers within this range.");
      return;
    }

    const numbers: number[] = [];
    while (numbers.length < count) {
      // Secure random math between min and max
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const rand = min + (array[0] % (max - min + 1));
      
      if (unique) {
        if (!numbers.includes(rand)) numbers.push(rand);
      } else {
        numbers.push(rand);
      }
    }
    
    setResult(numbers);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Number Generator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Generate truly random digits, lists, or lottery picks.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div><label className="block text-xs font-bold mb-2 dark:text-neutral-300">Min Value</label><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white font-medium" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-neutral-300">Max Value</label><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white font-medium" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-neutral-300">Quantity to Generate</label><input type="number" min="1" max="1000" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white font-medium" /></div>
      </div>

      <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="w-5 h-5 rounded text-orange-600" />
          <span className="font-bold text-neutral-700 dark:text-neutral-300">Ensure Unique Numbers</span>
        </label>
        <button onClick={generateNumbers} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-transform active:scale-95 shadow-sm">Generate</button>
      </div>

      {result.length > 0 && (
        <div className="p-6 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {result.map((num, i) => (
              <span key={i} className="inline-block px-4 py-3 bg-white dark:bg-neutral-800 text-xl font-black text-orange-600 dark:text-sky-400 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 tabular-nums">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}