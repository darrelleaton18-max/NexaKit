"use client";

import { useState } from "react";

const NATO_ALPHABET: Record<string, string> = { A:"Alpha", B:"Bravo", C:"Charlie", D:"Delta", E:"Echo", F:"Foxtrot", G:"Golf", H:"Hotel", I:"India", J:"Juliett", K:"Kilo", L:"Lima", M:"Mike", N:"November", O:"Oscar", P:"Papa", Q:"Quebec", R:"Romeo", S:"Sierra", T:"Tango", U:"Uniform", V:"Victor", W:"Whiskey", X:"X-ray", Y:"Yankee", Z:"Zulu" };
const MORSE_CODE: Record<string, string> = { A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....", I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.", Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-", Y:"-.--", Z:"--..", "1":".----", "2":"..---", "3":"...--", "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.", "0":"-----", " ":"/" };
const LEET_SPEAK: Record<string, string> = { A:"4", E:"3", G:"6", I:"1", O:"0", S:"5", T:"7", Z:"2" };

export default function LanguageConverter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "lang-converter") return null;

  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"nato" | "morse" | "leet">("nato");

  const convertText = () => {
    if (!input) return "";
    const upper = input.toUpperCase();
    
    if (mode === "nato") {
      return upper.split('').map(char => NATO_ALPHABET[char] || char).join(' ');
    } 
    else if (mode === "morse") {
      return upper.split('').map(char => MORSE_CODE[char] || char).join(' ');
    }
    else if (mode === "leet") {
      return upper.split('').map(char => LEET_SPEAK[char] || char).join('');
    }
    return input;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Text Encoding & Translator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Translate standard text into Morse code, NATO phonetic spelling, or Leetspeak.</p>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mb-6">
        <button onClick={() => setMode("nato")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${mode === "nato" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>✈️ NATO Phonetic</button>
        <button onClick={() => setMode("morse")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${mode === "morse" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>📡 Morse Code</button>
        <button onClick={() => setMode("leet")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${mode === "leet" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>💻 Leetspeak</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Translated Output</label>
          <textarea
            readOnly
            value={convertText()}
            placeholder="Translation appears here..."
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl dark:text-slate-400 font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}