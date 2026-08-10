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
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300 text-center">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Username Generator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Generate unique, catchy usernames for gaming or social media.</p>
      
      {/* FIXED: Changed max-w-md to max-w-2xl and adjusted text sizing/wrapping */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-2xl mx-auto w-full">
        <span className="text-4xl md:text-5xl font-black text-orange-600 dark:text-sky-400 block mb-8 break-words leading-tight px-4">{username}</span>
        <button onClick={generate} className="w-full md:w-2/3 mx-auto py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md block">
          Generate New Username
        </button>
      </div>
    </div>
  );
}