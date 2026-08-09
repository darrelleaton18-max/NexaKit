"use client";

import { useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English" }, { code: "es", name: "Spanish" },
  { code: "fr", name: "French" }, { code: "de", name: "German" },
  { code: "it", name: "Italian" }, { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" }, { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" }, { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" }, { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" }, { code: "tr", name: "Turkish" }
];

export default function LiveTranslator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "translator") return null;

  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setIsTranslating(true);
    
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
      const data = await res.json();
      
      if (data.responseData?.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setTranslatedText("Error: Could not translate text.");
      }
    } catch (err) {
      setTranslatedText("Error: Connection failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    const tempLang = fromLang;
    setFromLang(toLang);
    setToLang(tempLang);
    
    // Optionally swap the text too if you want to translate back
    if (translatedText && !translatedText.startsWith("Error")) {
      setText(translatedText);
      setTranslatedText("");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Live Language Translator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Translate text instantly using the MyMemory Translation API.</p>

      <div className="flex flex-col md:flex-row items-end gap-3 mb-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Translate From</label>
          <select value={fromLang} onChange={(e) => setFromLang(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
            {LANGUAGES.map((l) => (<option key={`from-${l.code}`} value={l.code}>{l.name}</option>))}
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition-colors shrink-0 self-stretch md:self-end flex items-center justify-center"
          title="Swap Languages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Translate To</label>
          <select value={toLang} onChange={(e) => setToLang(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
            {LANGUAGES.map((l) => (<option key={`to-${l.code}`} value={l.code}>{l.name}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button 
            onClick={handleTranslate} 
            disabled={isTranslating || !text.trim()} 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors"
          >
            {isTranslating ? "Translating..." : "Translate Text"}
          </button>
        </div>
        
        <textarea
          readOnly
          value={translatedText}
          placeholder="Translation will appear here..."
          className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl dark:text-slate-300 resize-none focus:outline-none"
        />
      </div>
    </div>
  );
}