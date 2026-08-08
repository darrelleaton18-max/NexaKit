"use client";

import { useState } from "react";

export default function BankFeeAuditor({ activeTool }: { activeTool: string }) {
  if (activeTool !== "fee-auditor") return null;

  const [pastedText, setPastedText] = useState("");
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [results, setResults] = useState<{ found: boolean; items: string[]; total: number }>({ found: false, items: [], total: 0 });

  const analyzeFees = () => {
    if (!pastedText.trim()) return;

    const lines = pastedText.split('\n');
    const keywords = ['fee', 'charge', 'maintenance', 'overdraft', 'penalty', 'subscription'];
    
    let totalFees = 0;
    const foundItems: string[] = [];

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      // Check if line contains a keyword
      if (keywords.some(kw => lowerLine.includes(kw))) {
        // Look for a currency amount (e.g. -12.00, £12.00, 12.00)
        const match = line.match(/(?:£|\$|-)?\s?(\d+\.\d{2})/);
        if (match && match[1]) {
          const val = parseFloat(match[1]);
          totalFees += val;
          foundItems.push(line.trim());
        }
      }
    });

    setResults({ found: true, items: foundItems, total: totalFees });
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);
  const potentialEarnings = results.total * (interestRate / 100);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Bank Fee & Leak Auditor</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Paste your bank statement text privately to uncover hidden maintenance fees and charges.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <textarea
            value={pastedText}
            onChange={e => setPastedText(e.target.value)}
            placeholder="Paste your CSV or raw statement text here... (Data never leaves your browser)"
            className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white text-sm font-mono mb-4 resize-none"
          />
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Lost Interest Rate (High-Yield %)</label>
              <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <button onClick={analyzeFees} className="px-8 py-3 h-[46px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">Analyze</button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase text-xs tracking-wider">Audit Results</h3>
          
          {!results.found ? (
            <p className="text-slate-500 text-sm italic">Paste text and click Analyze to find financial leaks.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <span className="font-bold text-red-600 dark:text-red-400">Total Wasted Fees:</span>
                <span className="text-2xl font-black text-red-700 dark:text-red-300">{formatMoney(results.total)}</span>
              </div>
              
              <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-700 dark:text-amber-400">Lost Potential Interest:</span>
                <span className="text-xl font-black text-amber-800 dark:text-amber-300">{formatMoney(potentialEarnings)} / yr</span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Identified Charges ({results.items.length})</h4>
                <div className="h-32 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-900">
                  {results.items.length > 0 ? results.items.map((item, i) => (
                    <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0 truncate">
                      {item}
                    </div>
                  )) : (
                    <span className="text-xs text-emerald-600 font-bold p-2 block">No fees found! Great job.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}