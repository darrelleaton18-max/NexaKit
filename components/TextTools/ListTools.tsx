"use client";

import { useState } from "react";

export default function ListTools({ activeTool }: { activeTool: string }) {
  if (activeTool !== "list-tools") return null;

  const [text, setText] = useState("");

  const processList = (action: string) => {
    let arr = text.split('\n');
    
    switch (action) {
      case "sortAZ": arr.sort((a, b) => a.localeCompare(b)); break;
      case "sortZA": arr.sort((a, b) => b.localeCompare(a)); break;
      case "dedupe": arr = [...new Set(arr)]; break;
      case "shuffle": arr.sort(() => Math.random() - 0.5); break;
      case "reverse": arr.reverse(); break;
      case "trim": arr = arr.map(item => item.trim()).filter(item => item !== ""); break;
    }
    
    setText(arr.join('\n'));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">List Sorter & Deduplicator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Clean, sort, and organize line-separated data instantly.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your list here (one item per line)..."
            className="w-full h-72 p-4 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white whitespace-pre text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2">Actions</h3>
          <button onClick={() => processList("sortAZ")} className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg text-left">⬇️ Sort A-Z</button>
          <button onClick={() => processList("sortZA")} className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg text-left">⬆️ Sort Z-A</button>
          <button onClick={() => processList("dedupe")} className="p-3 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-sky-400 text-sm font-bold rounded-lg text-left border border-orange-200 dark:border-orange-800">✂️ Remove Duplicates</button>
          <button onClick={() => processList("trim")} className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg text-left">🧹 Trim & Remove Empty</button>
          <button onClick={() => processList("shuffle")} className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg text-left">🔀 Shuffle</button>
          <button onClick={() => processList("reverse")} className="p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg text-left">↕️ Reverse Order</button>
        </div>
      </div>
    </div>
  );
}