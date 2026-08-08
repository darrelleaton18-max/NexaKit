"use client";

import { useState, useEffect } from "react";

export default function UsernameGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "username-gen") return null;
  const [username, setUsername] = useState("Loading...");

  const generate = () => {
    const adjs = ["Quantum", "Cosmic", "Neon", "Cyber", "Rapid", "Stealth", "Pixel", "Sonic", "Lunar", "Solar", "Turbo", "Ghost"];
    const nouns = ["Ninja", "Panda", "Rider", "Hacker", "Vortex", "Pulse", "Nova", "Wave", "Forge", "Glitch", "Byte", "Matrix"];
    const r1 = adjs[Math.floor(Math.random() * adjs.length)];
    const r2 = nouns[Math.floor(Math.random() * nouns.length)];
    const r3 = Math.floor(Math.random() * 999);
    setUsername(`${r1}${r2}${r3}`);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 text-center">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Username Generator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate unique, catchy usernames for gaming or social media.</p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
        <span className="text-4xl md:text-5xl font-black text-blue-600 dark:text-sky-400 block mb-8 break-all">{username}</span>
        <button onClick={generate} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md">
          Generate New Username
        </button>
      </div>
    </div>
  );
}