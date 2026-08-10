"use client";

import { useState, useEffect } from "react";

export default function HashGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "hash-gen") return null;

  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({ sha1: "", sha256: "", sha384: "", sha512: "" });

  useEffect(() => {
    if (!input) {
      setHashes({ sha1: "", sha256: "", sha384: "", sha512: "" });
      return;
    }

    const generateHashes = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const hashAlgos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const results: Record<string, string> = {};

      for (const algo of hashAlgos) {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algo.toLowerCase().replace('-', '')] = hashHex;
      }

      setHashes(results as any);
    };

    generateHashes();
  }, [input]);

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Secure Hash Generator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Generate cryptographic hashes instantly in the browser. No data is sent to a server.</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash..."
        className="w-full h-32 p-4 mb-6 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="space-y-4">
        <HashRow label="SHA-1" value={hashes.sha1} />
        <HashRow label="SHA-256" value={hashes.sha256} />
        <HashRow label="SHA-384" value={hashes.sha384} />
        <HashRow label="SHA-512" value={hashes.sha512} />
      </div>
    </div>
  );
}

function HashRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 w-20 shrink-0">{label}</span>
      <input 
        readOnly 
        value={value} 
        placeholder="Hash will appear here..."
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="flex-1 bg-transparent border-none p-0 m-0 font-mono text-sm text-neutral-800 dark:text-sky-300 focus:ring-0 cursor-copy break-all outline-none" 
      />
    </div>
  );
}