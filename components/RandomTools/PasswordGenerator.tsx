"use client";

import { useState, useEffect } from "react";

export default function PasswordGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "password-gen") return null;

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let chars = "";
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNums) chars += nums;
    if (useSymbols) chars += symbols;

    if (chars === "") {
      setPassword("Select at least one option.");
      return;
    }

    // Cryptographically secure random generation
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    
    setPassword(result);
    setCopied(false);
  };

  // Generate on mount
  useEffect(() => { generatePassword(); }, []);

  const handleCopy = () => {
    if (!password || password.includes("Select")) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Secure Password Generator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Create cryptographically strong passwords locally. Nothing is sent to a server.</p>

      <div className="relative mb-8 group">
        <input 
          readOnly 
          value={password} 
          className="w-full p-6 text-2xl md:text-3xl font-mono text-center border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 rounded-xl dark:text-sky-300 focus:outline-none" 
        />
        <button 
          onClick={handleCopy} 
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold dark:text-neutral-300">Password Length</label>
            <span className="text-lg font-mono font-bold text-orange-600 dark:text-sky-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-md">{length}</span>
          </div>
          <input type="range" min="8" max="128" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full cursor-pointer accent-orange-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="w-5 h-5 rounded text-orange-600" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="w-5 h-5 rounded text-orange-600" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={useNums} onChange={(e) => setUseNums(e.target.checked)} className="w-5 h-5 rounded text-orange-600" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="w-5 h-5 rounded text-orange-600" />
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Symbols (!@#$)</span>
          </label>
        </div>

        <button onClick={generatePassword} className="w-full py-4 mt-2 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md shadow-orange-500/20">
          Generate New Password
        </button>
      </div>
    </div>
  );
}