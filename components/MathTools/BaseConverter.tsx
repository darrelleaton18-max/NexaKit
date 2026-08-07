"use client";

import { useState } from "react";

export default function BaseConverter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "base-converter") return null;

  const [dec, setDec] = useState("255");
  const [bin, setBin] = useState("11111111");
  const [oct, setOct] = useState("377");
  const [hex, setHex] = useState("FF");

  const handleUpdate = (val: string, base: number) => {
    if (!val) { setDec(""); setBin(""); setOct(""); setHex(""); return; }
    
    // Parse to base 10 first
    const parsed = parseInt(val, base);
    if (isNaN(parsed)) return;

    // Distribute to all
    if (base !== 10) setDec(parsed.toString(10)); else setDec(val);
    if (base !== 2) setBin(parsed.toString(2)); else setBin(val);
    if (base !== 8) setOct(parsed.toString(8)); else setOct(val);
    if (base !== 16) setHex(parsed.toString(16).toUpperCase()); else setHex(val.toUpperCase());
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Number Base Converter</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Type into any format below to instantly translate values across bases.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <BaseInput label="Decimal (Base 10)" val={dec} onChange={(v) => handleUpdate(v, 10)} placeholder="e.g. 255" />
        <BaseInput label="Hexadecimal (Base 16)" val={hex} onChange={(v) => handleUpdate(v, 16)} placeholder="e.g. FF" />
        <BaseInput label="Binary (Base 2)" val={bin} onChange={(v) => handleUpdate(v, 2)} placeholder="e.g. 11111111" />
        <BaseInput label="Octal (Base 8)" val={oct} onChange={(v) => handleUpdate(v, 8)} placeholder="e.g. 377" />
      </div>
    </div>
  );
}

function BaseInput({ label, val, onChange, placeholder }: { label: string, val: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <label className="block text-xs font-bold mb-2 text-blue-600 dark:text-sky-400 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={val} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full p-3 text-lg font-mono border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-white" 
      />
    </div>
  );
}