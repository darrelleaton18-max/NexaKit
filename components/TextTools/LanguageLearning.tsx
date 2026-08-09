"use client";

import { useState } from "react";

const languages = {
  spanish: {
    name: "Spanish",
    flag: "🇪🇸",
    voiceCode: "es-ES",
    translateCode: "es",
    phrases: [
      { en: "Hello", target: "Hola" },
      { en: "Thank you", target: "Gracias" },
      { en: "Please", target: "Por favor" },
      { en: "Where is the bathroom?", target: "¿Dónde está el baño?" },
    ]
  },
  french: {
    name: "French",
    flag: "🇫🇷",
    voiceCode: "fr-FR",
    translateCode: "fr",
    phrases: [
      { en: "Hello", target: "Bonjour" },
      { en: "Thank you", target: "Merci" },
      { en: "Please", target: "S'il vous plaît" },
      { en: "Where is the bathroom?", target: "Où sont les toilettes?" },
    ]
  },
  german: {
    name: "German",
    flag: "🇩🇪",
    voiceCode: "de-DE",
    translateCode: "de",
    phrases: [
      { en: "Hello", target: "Hallo" },
      { en: "Thank you", target: "Danke" },
      { en: "Please", target: "Bitte" },
      { en: "Where is the bathroom?", target: "Wo ist die Toilette?" },
    ]
  },
  italian: {
    name: "Italian",
    flag: "🇮🇹",
    voiceCode: "it-IT",
    translateCode: "it",
    phrases: [
      { en: "Hello", target: "Ciao" },
      { en: "Thank you", target: "Grazie" },
      { en: "Please", target: "Per favore" },
      { en: "Where is the bathroom?", target: "Dov'è il bagno?" },
    ]
  },
  japanese: {
    name: "Japanese",
    flag: "🇯🇵",
    voiceCode: "ja-JP",
    translateCode: "ja",
    phrases: [
      { en: "Hello", target: "こんにちは (Konnichiwa)" },
      { en: "Thank you", target: "ありがとう (Arigatou)" },
      { en: "Please", target: "お願いします (Onegaishimasu)" },
      { en: "Where is the bathroom?", target: "トイレはどこですか (Toire wa doko desu ka?)" },
    ]
  },
  mandarin: {
    name: "Mandarin",
    flag: "🇨🇳",
    voiceCode: "zh-CN",
    translateCode: "zh-CN",
    phrases: [
      { en: "Hello", target: "你好 (Nǐ hǎo)" },
      { en: "Thank you", target: "谢谢 (Xièxiè)" },
      { en: "Please", target: "请 (Qǐng)" },
      { en: "Where is the bathroom?", target: "洗手间在哪里 (Xǐshǒujiān zài nǎlǐ?)" },
    ]
  }
};

type LanguageKey = keyof typeof languages;

export default function LanguageLearning() {
  const [activeLang, setActiveLang] = useState<LanguageKey>("spanish");
  const [playingIndex, setPlayingIndex] = useState<number | string | null>(null);
  
  // Custom Translation States
  const [customText, setCustomText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Trigger browser's native Text-to-Speech
  const playAudio = (text: string, voiceCode: string, id: number | string) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech audio.");
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean phonetic brackets for accurate pronunciation
    const cleanText = text.replace(/\s*\(.*?\)\s*/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceCode;
    utterance.rate = 0.85; 

    utterance.onstart = () => setPlayingIndex(id);
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  // Fetch translation from free public API
  const handleTranslate = async () => {
    if (!customText.trim()) return;
    setIsTranslating(true);
    setTranslatedText("");
    
    try {
      const langPair = `en|${languages[activeLang].translateCode}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(customText)}&langpair=${langPair}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setTranslatedText("Translation failed. Please try again.");
      }
    } catch (error) {
      setTranslatedText("Error connecting to translation service.");
    } finally {
      setIsTranslating(false);
    }
  };

  const currentLanguage = languages[activeLang];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Language Phrasebook & Pronouncer</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Learn essential travel phrases or translate your own text with native audio pronunciation. Processed instantly in your browser.</p>
      </div>

      {/* Language Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.keys(languages) as LanguageKey[]).map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setActiveLang(lang);
              window.speechSynthesis.cancel();
              setTranslatedText(""); // Clear custom translation on switch
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              activeLang === lang
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:border-sky-400 dark:text-sky-400 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-500"
            }`}
          >
            <span className="text-lg">{languages[lang].flag}</span>
            {languages[lang].name}
          </button>
        ))}
      </div>

      {/* CUSTOM TRANSLATOR SECTION */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-10">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
          Custom Translation to {currentLanguage.name}
        </h3>
        
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
            placeholder="Type an English phrase here..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
          />
          <button 
            onClick={handleTranslate}
            disabled={isTranslating || !customText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {isTranslating ? "Translating..." : "Translate"}
          </button>
        </div>

        {/* Translation Result Box */}
        {translatedText && (
          <div className="mt-4 p-4 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl flex items-center justify-between group shadow-sm">
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">{translatedText}</span>
            <button
              onClick={() => playAudio(translatedText, currentLanguage.voiceCode, 'custom')}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                playingIndex === 'custom'
                  ? "bg-blue-600 text-white shadow-md animate-pulse"
                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              }`}
            >
              {playingIndex === 'custom' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Phrases Grid */}
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Essential Phrases</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentLanguage.phrases.map((phrase, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl hover:border-blue-400 dark:hover:border-sky-500 transition-colors group">
            
            <div className="flex flex-col gap-1 pr-4 min-w-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{phrase.en}</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{phrase.target}</span>
            </div>

            <button
              onClick={() => playAudio(phrase.target, currentLanguage.voiceCode, idx)}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                playingIndex === idx
                  ? "bg-blue-600 text-white shadow-md animate-pulse"
                  : "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"
              }`}
            >
              {playingIndex === idx ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="w-5 h-5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}