"use client";

import { useState } from "react";

export default function FindReplace({ activeTool }: { activeTool: string }) {
  if (activeTool !== "find-replace") return null;

  const [text, setText] = useState("");
  const [findStr, setFindStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [count, setCount] = useState(0);

  const handleReplaceAll = () => {
    if (!findStr) return;
    const flags = matchCase ? "g" : "gi";
    const regex = new RegExp(findStr, flags);
    const matches = text.match(regex);
    setCount(matches ? matches.length : 0);
    setText(text.replace(regex, replaceStr));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Find & Replace</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Quickly swap out words or strings inside large blocks of text.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your source text here..."
        className="w-full h-48 p-4 mb-6 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white resize-y focus:outline-none"
      />

      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Find</label>
          <input type="text" value={findStr} onChange={(e) => setFindStr(e.target.value)} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Replace With</label>
          <input type="text" value={replaceStr} onChange={(e) => setReplaceStr(e.target.value)} className="w-full p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-lg dark:text-white" />
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold dark:text-neutral-300 cursor-pointer">
            <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} className="w-4 h-4 rounded text-orange-600" /> Match Case
          </label>
        </div>

        <button onClick={handleReplaceAll} className="w-full md:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors">
          Replace All
        </button>
      </div>

      {count > 0 && (
        <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 text-center">
          ✓ Replaced {count} occurrence(s).
        </p>
      )}
    </div>
  );
}