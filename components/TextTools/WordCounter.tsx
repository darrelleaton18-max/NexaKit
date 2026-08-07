"use client";

import { useState } from "react";

export default function WordCounter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "word-counter") return null;

  const [text, setText] = useState("");

  const stats = {
    chars: text.length,
    charsNoSpaces: text.replace(/\s+/g, "").length,
    words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: text.split(/\n+/).filter(p => p.trim().length > 0).length,
    readingTime: Math.ceil((text.trim().split(/\s+/).filter(w => w.length > 0).length) / 200) || 0
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Word & Character Counter</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Real-time text analytics, character limits, and reading time estimation.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatBox label="Words" val={stats.words} highlight />
        <StatBox label="Characters" val={stats.chars} />
        <StatBox label="No Spaces" val={stats.charsNoSpaces} />
        <StatBox label="Sentences" val={stats.sentences} />
        <StatBox label="Paragraphs" val={stats.paragraphs} />
        <StatBox label="Read Time (Min)" val={stats.readingTime} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="w-full h-64 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="flex justify-end mt-4">
        <button onClick={() => setText("")} className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors">Clear Text</button>
      </div>
    </div>
  );
}

function StatBox({ label, val, highlight = false }: { label: string, val: number, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border text-center ${highlight ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
      <span className="block text-2xl font-black text-slate-800 dark:text-white">{val}</span>
      <span className={`block text-[10px] font-bold uppercase tracking-wider mt-1 ${highlight ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
    </div>
  );
}