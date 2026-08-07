"use client";

import { useState } from "react";

export default function UuidGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "uuid-gen") return null;

  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateUUIDs = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      // Use native browser crypto if available, fallback if not
      newUuids.push(window.crypto?.randomUUID ? window.crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      }));
    }
    setUuids(newUuids);
    setCopied(false);
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">v4 UUID / GUID Generator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly generate globally unique identifiers for database records.</p>

      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Quantity</label>
          <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
        </div>
        <button onClick={generateUUIDs} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-transform active:scale-95 shadow-sm">
          Generate UUIDs
        </button>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={uuids.join('\n')}
          placeholder="Your UUIDs will appear here..."
          className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-950 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-sm resize-y focus:outline-none"
        />
        {uuids.length > 0 && (
          <button onClick={handleCopyAll} className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
            {copied ? "✓ Copied!" : "Copy All"}
          </button>
        )}
      </div>
    </div>
  );
}