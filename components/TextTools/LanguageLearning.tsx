"use client";

import { useState } from "react";

const languages = {
  spanish: {
    name: "Spanish",
    flag: "🇪🇸",
    voiceCode: "es-ES",
    phrases: [
      { en: "Hello", target: "Hola" },
      { en: "Thank you", target: "Gracias" },
      { en: "Please", target: "Por favor" },
      { en: "Yes / No", target: "Sí / No" },
      { en: "Excuse me", target: "Perdón / Disculpe" },
      { en: "Do you speak English?", target: "¿Hablas inglés?" },
      { en: "Where is the bathroom?", target: "¿Dónde está el baño?" },
      { en: "How much is this?", target: "¿Cuánto cuesta esto?" },
    ]
  },
  french: {
    name: "French",
    flag: "🇫🇷",
    voiceCode: "fr-FR",
    phrases: [
      { en: "Hello", target: "Bonjour" },
      { en: "Thank you", target: "Merci" },
      { en: "Please", target: "S'il vous plaît" },
      { en: "Yes / No", target: "Oui / Non" },
      { en: "Excuse me", target: "Excusez-moi" },
      { en: "Do you speak English?", target: "Parlez-vous anglais?" },
      { en: "Where is the bathroom?", target: "Où sont les toilettes?" },
      { en: "How much is this?", target: "C'est combien?" },
    ]
  },
  german: {
    name: "German",
    flag: "🇩🇪",
    voiceCode: "de-DE",
    phrases: [
      { en: "Hello", target: "Hallo" },
      { en: "Thank you", target: "Danke" },
      { en: "Please", target: "Bitte" },
      { en: "Yes / No", target: "Ja / Nein" },
      { en: "Excuse me", target: "Entschuldigung" },
      { en: "Do you speak English?", target: "Sprechen Sie Englisch?" },
      { en: "Where is the bathroom?", target: "Wo ist die Toilette?" },
      { en: "How much is this?", target: "Wie viel kostet das?" },
    ]
  },
  italian: {
    name: "Italian",
    flag: "🇮🇹",
    voiceCode: "it-IT",
    phrases: [
      { en: "Hello", target: "Ciao" },
      { en: "Thank you", target: "Grazie" },
      { en: "Please", target: "Per favore" },
      { en: "Yes / No", target: "Sì / No" },
      { en: "Excuse me", target: "Mi scusi" },
      { en: "Do you speak English?", target: "Parla inglese?" },
      { en: "Where is the bathroom?", target: "Dov'è il bagno?" },
      { en: "How much is this?", target: "Quanto costa?" },
    ]
  },
  japanese: {
    name: "Japanese",
    flag: "🇯🇵",
    voiceCode: "ja-JP",
    phrases: [
      { en: "Hello", target: "こんにちは (Konnichiwa)" },
      { en: "Thank you", target: "ありがとう (Arigatou)" },
      { en: "Please", target: "お願いします (Onegaishimasu)" },
      { en: "Yes / No", target: "はい / いいえ (Hai / Iie)" },
      { en: "Excuse me", target: "すみません (Sumimasen)" },
      { en: "Do you speak English?", target: "英語を話せますか (Eigo o hanasemasu ka?)" },
      { en: "Where is the bathroom?", target: "トイレはどこですか (Toire wa doko desu ka?)" },
      { en: "How much is this?", target: "これはいくらですか (Kore wa ikura desu ka?)" },
    ]
  },
  mandarin: {
    name: "Mandarin",
    flag: "🇨🇳",
    voiceCode: "zh-CN",
    phrases: [
      { en: "Hello", target: "你好 (Nǐ hǎo)" },
      { en: "Thank you", target: "谢谢 (Xièxiè)" },
      { en: "Please", target: "请 (Qǐng)" },
      { en: "Yes / No", target: "是 / 不是 (Shì / Bù shì)" },
      { en: "Excuse me", target: "打扰一下 (Dǎrǎo yīxià)" },
      { en: "Do you speak English?", target: "你会说英语吗 (Nǐ huì shuō yīngyǔ ma?)" },
      { en: "Where is the bathroom?", target: "洗手间在哪里 (Xǐshǒujiān zài nǎlǐ?)" },
      { en: "How much is this?", target: "这个多少钱 (Zhège duōshǎo qián?)" },
    ]
  }
};

type LanguageKey = keyof typeof languages;

export default function LanguageLearning() {
  const [activeLang, setActiveLang] = useState<LanguageKey>("spanish");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Trigger browser's native Text-to-Speech
  const playAudio = (text: string, voiceCode: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech audio.");
      return;
    }

    // Cancel any currently playing audio
    window.speechSynthesis.cancel();

    // Strip out phonetic spelling in brackets for Japanese/Mandarin so it sounds natural
    const cleanText = text.replace(/\s*\(.*?\)\s*/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceCode;
    utterance.rate = 0.85; // Slightly slower for easier learning

    utterance.onstart = () => setPlayingIndex(index);
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const currentLanguage = languages[activeLang];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Language Phrasebook & Pronouncer</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Learn essential travel phrases with native audio pronunciation. Processed instantly in your browser.</p>
      </div>

      {/* Language Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.keys(languages) as LanguageKey[]).map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setActiveLang(lang);
              window.speechSynthesis.cancel(); // Stop audio if they switch tabs
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

      {/* Phrases Grid */}
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
              title="Listen to pronunciation"
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