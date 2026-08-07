"use client";

import { useState } from "react";

export default function CaseConverter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "case-converter") return null;

  const [text, setText] = useState("");

  const handleConvert = (type: string) => {
    if (!text) return;
    let result = text;
    
    switch (type) {
      case "upper": result = text.toUpperCase(); break;
      case "lower": result = text.toLowerCase(); break;
      case "title": 
        result = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); 
        break;
      case "sentence": 
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); 
        break;
      case "camel":
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case "snake":
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || text;
        break;
      case "kebab":
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || text;
        break;
    }
    setText(result);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Text Case Converter</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly shift text between standard formats and programming cases.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here to convert..."
        className="w-full h-48 p-4 mb-6 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-y"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => handleConvert("upper")} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg">UPPERCASE</button>
        <button onClick={() => handleConvert("lower")} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg">lowercase</button>
        <button onClick={() => handleConvert("title")} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg">Title Case</button>
        <button onClick={() => handleConvert("sentence")} className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg">Sentence case.</button>
        <button onClick={() => handleConvert("camel")} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-sky-400 font-mono text-xs font-bold rounded-lg">camelCase</button>
        <button onClick={() => handleConvert("snake")} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-sky-400 font-mono text-xs font-bold rounded-lg">snake_case</button>
        <button onClick={() => handleConvert("kebab")} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-sky-400 font-mono text-xs font-bold rounded-lg">kebab-case</button>
        <button onClick={() => {navigator.clipboard.writeText(text)}} className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm transition-transform active:scale-95">Copy Text</button>
      </div>
    </div>
  );
}