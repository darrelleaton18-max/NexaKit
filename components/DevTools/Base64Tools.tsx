"use client";

import { useState } from "react";

export default function Base64Tools({ activeTool }: { activeTool: string }) {
  if (activeTool !== "base64") return null;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError(false);
    } catch {
      setError(true);
      setOutput("Error encoding text.");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError(false);
    } catch {
      setError(true);
      setOutput("Error: Invalid Base64 string.");
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Base64 Encoder & Decoder</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Convert standard text to Base64 and vice versa safely.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your string here..."
            className="w-full h-48 p-4 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          <div className="flex gap-4">
            <button onClick={encode} className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors">Encode to Base64</button>
            <button onClick={decode} className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white font-bold rounded-lg transition-colors">Decode from Base64</button>
          </div>
        </div>

        <textarea
          readOnly
          value={output}
          placeholder="Result..."
          className={`w-full h-full min-h-[200px] p-4 border rounded-xl font-mono text-sm resize-none focus:outline-none ${error ? 'border-red-300 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'}`}
        />
      </div>
    </div>
  );
}