"use client";

import { useState } from "react";

export default function UrlEncoder({ activeTool }: { activeTool: string }) {
  if (activeTool !== "url-encode") return null;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("Error: Malformed URI sequence.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">URL Encoder & Decoder</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Safely encode URLs for data transfer or decode them back to readable strings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/?query=hello world"
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex gap-4">
            <button onClick={encode} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Encode URL</button>
            <button onClick={decode} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg transition-colors">Decode URL</button>
          </div>
        </div>

        <textarea
          readOnly
          value={output}
          placeholder="Result..."
          className="w-full h-full min-h-[200px] p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl dark:text-slate-300 font-mono text-sm resize-none focus:outline-none break-all"
        />
      </div>
    </div>
  );
}