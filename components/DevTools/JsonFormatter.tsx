"use client";

import { useState } from "react";

export default function JsonFormatter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "json-format") return null;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number) => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">JSON Formatter & Validator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Format, validate, or minify JSON data instantly.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => formatJson(2)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">Beautify (2 Spaces)</button>
        <button onClick={() => formatJson(4)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-bold rounded-lg border border-neutral-200 dark:border-neutral-700">Beautify (4 Spaces)</button>
        <button onClick={minifyJson} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-sky-400 text-sm font-bold rounded-lg border border-orange-200 dark:border-orange-800">Minify</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-80 p-4 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="relative flex flex-col">
          <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Output</label>
          {error ? (
            <div className="flex-1 w-full p-4 border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 font-mono text-sm">
              <span className="font-bold block mb-2">❌ Invalid JSON:</span>
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="flex-1 w-full p-4 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 rounded-xl dark:text-neutral-300 font-mono text-sm resize-none focus:outline-none"
            />
          )}
          
          {output && !error && (
            <button onClick={copyToClipboard} className={`absolute top-10 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600'}`}>
              {copied ? "✓ Copied!" : "Copy JSON"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}