"use client";

import { useState, useEffect } from "react";

// Master list of all core languages and their essential phrases
const masterCoreLanguages = {
  spanish: { name: "Spanish", flag: "🇪🇸", voiceCode: "es-ES", translateCode: "es", phrases: [
    { en: "Hello", target: "Hola" }, { en: "Thank you", target: "Gracias" }, { en: "Please", target: "Por favor" }, { en: "Where is the bathroom?", target: "¿Dónde está el baño?" }
  ]},
  french: { name: "French", flag: "🇫🇷", voiceCode: "fr-FR", translateCode: "fr", phrases: [
    { en: "Hello", target: "Bonjour" }, { en: "Thank you", target: "Merci" }, { en: "Please", target: "S'il vous plaît" }, { en: "Where is the bathroom?", target: "Où sont les toilettes?" }
  ]},
  german: { name: "German", flag: "🇩🇪", voiceCode: "de-DE", translateCode: "de", phrases: [
    { en: "Hello", target: "Hallo" }, { en: "Thank you", target: "Danke" }, { en: "Please", target: "Bitte" }, { en: "Where is the bathroom?", target: "Wo ist die Toilette?" }
  ]},
  italian: { name: "Italian", flag: "🇮🇹", voiceCode: "it-IT", translateCode: "it", phrases: [
    { en: "Hello", target: "Ciao" }, { en: "Thank you", target: "Grazie" }, { en: "Please", target: "Per favore" }, { en: "Where is the bathroom?", target: "Dov'è il bagno?" }
  ]},
  japanese: { name: "Japanese", flag: "🇯🇵", voiceCode: "ja-JP", translateCode: "ja", phrases: [
    { en: "Hello", target: "こんにちは (Konnichiwa)" }, { en: "Thank you", target: "ありがとう (Arigatou)" }, { en: "Please", target: "お願いします (Onegaishimasu)" }, { en: "Where is the bathroom?", target: "トイレはどこですか (Toire wa doko desu ka?)" }
  ]},
  mandarin: { name: "Mandarin", flag: "🇨🇳", voiceCode: "zh-CN", translateCode: "zh-CN", phrases: [
    { en: "Hello", target: "你好 (Nǐ hǎo)" }, { en: "Thank you", target: "谢谢 (Xièxiè)" }, { en: "Please", target: "请 (Qǐng)" }, { en: "Where is the bathroom?", target: "洗手间在哪里 (Xǐshǒujiān zài nǎlǐ?)" }
  ]},
  english: { name: "English", flag: "🇬🇧", voiceCode: "en-GB", translateCode: "en", phrases: [
    { en: "Hello", target: "Hello" }, { en: "Thank you", target: "Thank you" }, { en: "Please", target: "Please" }, { en: "Where is the bathroom?", target: "Where is the bathroom?" }
  ]},
  korean: { name: "Korean", flag: "🇰🇷", voiceCode: "ko-KR", translateCode: "ko", phrases: [
    { en: "Hello", target: "안녕하세요 (Annyeonghaseyo)" }, { en: "Thank you", target: "감사합니다 (Gamsahamnida)" }, { en: "Please", target: "부탁합니다 (Butakhamnida)" }, { en: "Where is the bathroom?", target: "화장실이 어디예요? (Hwajangsiri eodiyeyo?)" }
  ]}
};

type CoreLanguageKey = keyof typeof masterCoreLanguages;

const allLanguages = [
  { code: "ar", name: "Arabic", voice: "ar-SA" },
  { code: "bn", name: "Bengali", voice: "bn-IN" },
  { code: "zh-CN", name: "Chinese (Mandarin)", voice: "zh-CN" },
  { code: "nl", name: "Dutch", voice: "nl-NL" },
  { code: "en", name: "English", voice: "en-US" },
  { code: "fr", name: "French", voice: "fr-FR" },
  { code: "de", name: "German", voice: "de-DE" },
  { code: "el", name: "Greek", voice: "el-GR" },
  { code: "hi", name: "Hindi", voice: "hi-IN" },
  { code: "it", name: "Italian", voice: "it-IT" },
  { code: "ja", name: "Japanese", voice: "ja-JP" },
  { code: "ko", name: "Korean", voice: "ko-KR" },
  { code: "pl", name: "Polish", voice: "pl-PL" },
  { code: "pt", name: "Portuguese", voice: "pt-BR" },
  { code: "ro", name: "Romanian", voice: "ro-RO" },
  { code: "ru", name: "Russian", voice: "ru-RU" },
  { code: "es", name: "Spanish", voice: "es-ES" },
  { code: "sv", name: "Swedish", voice: "sv-SE" },
  { code: "th", name: "Thai", voice: "th-TH" },
  { code: "tr", name: "Turkish", voice: "tr-TR" },
  { code: "uk", name: "Ukrainian", voice: "uk-UA" },
  { code: "vi", name: "Vietnamese", voice: "vi-VN" },
];

interface SavedTranslation {
  id: string;
  original: string;
  translated: string;
  langName: string;
  voiceCode: string;
}

export default function LanguageLearning() {
  const [activeCoreLang, setActiveCoreLang] = useState<CoreLanguageKey>("spanish");
  const [topRegionLanguages, setTopRegionLanguages] = useState<CoreLanguageKey[]>(["spanish", "french", "german", "japanese", "italian"]);
  
  // Custom Translation States
  const [customText, setCustomText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedCustomLang, setSelectedCustomLang] = useState("es"); 
  
  // Audio, Mic & History States
  const [playingIndex, setPlayingIndex] = useState<string | null>(null);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { success: boolean, heard: string }>>({});
  const [savedHistory, setSavedHistory] = useState<SavedTranslation[]>([]);

  // Detect Region and Load History on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexakit_language_history");
      if (saved) {
        try { setSavedHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
      }

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let regionalDefaults: CoreLanguageKey[] = [];

      if (tz.startsWith("Europe/London") || tz.startsWith("Europe/")) {
        regionalDefaults = ["french", "spanish", "german", "italian", "mandarin"];
      } else if (tz.startsWith("America/")) {
        regionalDefaults = ["spanish", "french", "japanese", "german", "mandarin"];
      } else if (tz.startsWith("Asia/") || tz.startsWith("Australia/")) {
        regionalDefaults = ["english", "mandarin", "japanese", "korean", "spanish"];
      } else {
        regionalDefaults = ["spanish", "french", "mandarin", "german", "japanese"];
      }

      setTopRegionLanguages(regionalDefaults);
      setActiveCoreLang(regionalDefaults[0]);
      setSelectedCustomLang(masterCoreLanguages[regionalDefaults[0]].translateCode);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nexakit_language_history", JSON.stringify(savedHistory));
    }
  }, [savedHistory]);

  const playAudio = (text: string, voiceCode: string, id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech audio.");
      return;
    }
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/\s*\(.*?\)\s*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceCode;
    utterance.rate = 0.85; 

    utterance.onstart = () => setPlayingIndex(id);
    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  // Browser Native Speech Recognition for Pronunciation Practice
  const startPractice = (targetText: string, voiceCode: string, id: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, speech recognition is not supported in this browser. Try using Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Clean up the target text for accurate comparison (remove phonetics & punctuation)
    const expected = targetText.replace(/\s*\(.*?\)\s*/g, '').toLowerCase().replace(/[.,!?¿¡]/g, '').trim();

    recognition.onstart = () => {
      setListeningId(id);
      // Clear old feedback for this item
      setPracticeFeedback(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const spoken = transcript.toLowerCase().replace(/[.,!?¿¡]/g, '').trim();

      // Check if they got it right (allowing minor fuzzy match leeway)
      const success = spoken.includes(expected) || expected.includes(spoken) || expected === spoken;
      
      setPracticeFeedback(prev => ({
        ...prev,
        [id]: { success, heard: transcript }
      }));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setListeningId(null);
    };

    recognition.onend = () => {
      setListeningId(null);
      // Auto-hide feedback after 5 seconds
      setTimeout(() => {
        setPracticeFeedback(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 5000);
    };

    recognition.start();
  };

  const handleTranslate = async () => {
    if (!customText.trim()) return;
    setIsTranslating(true);
    setTranslatedText("");
    
    try {
      const targetLangDef = allLanguages.find(l => l.code === selectedCustomLang) || allLanguages[16];
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLangDef.code}&dt=t&q=${encodeURIComponent(customText)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const fullTranslation = data[0].map((item: any) => item[0]).join('');
        setTranslatedText(fullTranslation);
        
        const newItem: SavedTranslation = {
          id: Date.now().toString(),
          original: customText,
          translated: fullTranslation,
          langName: targetLangDef.name,
          voiceCode: targetLangDef.voice
        };
        setSavedHistory(prev => [newItem, ...prev].slice(0, 30)); 
        setCustomText(""); 
      } else {
        setTranslatedText("Translation failed. Please try again.");
      }
    } catch (error) {
      setTranslatedText("Error connecting to translation service.");
    } finally {
      setIsTranslating(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setSavedHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Language Phrasebook & Pronouncer</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Learn essential phrases, build a custom dictionary, and test your pronunciation with your microphone.</p>
      </div>

      {/* Dynamic Regional Language Selector */}
      <div className="flex flex-wrap gap-3 mb-8">
        {topRegionLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setActiveCoreLang(lang);
              setSelectedCustomLang(masterCoreLanguages[lang].translateCode);
              window.speechSynthesis.cancel();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
              activeCoreLang === lang
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:border-sky-400 dark:text-sky-400 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-500"
            }`}
          >
            <span className="text-lg">{masterCoreLanguages[lang].flag}</span>
            {masterCoreLanguages[lang].name}
          </button>
        ))}
      </div>

      {/* CUSTOM TRANSLATOR SECTION */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            Custom Translation
          </h3>
          
          <select 
            value={selectedCustomLang}
            onChange={(e) => setSelectedCustomLang(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white cursor-pointer"
          >
            {allLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>Translate to {lang.name}</option>
            ))}
          </select>
        </div>
        
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
            {isTranslating ? "Translating..." : "Save & Translate"}
          </button>
        </div>

        {translatedText && translatedText.includes("failed") && (
          <p className="mt-3 text-sm font-semibold text-red-500">{translatedText}</p>
        )}
      </div>

      {/* SAVED HISTORY SECTION */}
      {savedHistory.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Saved Dictionary</h3>
            <button onClick={() => setSavedHistory([])} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedHistory.map((item) => (
              <div key={item.id} className="flex flex-col p-4 bg-white dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-sky-500 transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-1 pr-24 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-500 dark:text-sky-400 uppercase tracking-wider">{item.langName}</span>
                      <span className="text-xs text-slate-400 truncate border-l border-slate-300 dark:border-slate-600 pl-2">{item.original}</span>
                    </div>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate mt-1">{item.translated}</span>
                  </div>

                  <div className="absolute right-3 top-4 flex items-center gap-2 bg-white dark:bg-slate-800/80 pl-2">
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    
                    {/* Practice Pronunciation Mic */}
                    <button
                      onClick={() => startPractice(item.translated, item.voiceCode, item.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        listeningId === item.id
                          ? "bg-red-500 text-white shadow-md animate-pulse"
                          : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                      }`}
                      title="Test Pronunciation"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    </button>

                    {/* Play Audio */}
                    <button
                      onClick={() => playAudio(item.translated, item.voiceCode, item.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        playingIndex === item.id
                          ? "bg-blue-600 text-white shadow-md animate-pulse"
                          : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      }`}
                      title="Listen"
                    >
                      {playingIndex === item.id ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                      ) : (
                        <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Pronunciation Feedback */}
                {practiceFeedback[item.id] && (
                  <div className={`mt-3 pt-3 border-t text-sm font-semibold flex items-center gap-2 ${practiceFeedback[item.id].success ? "border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400"}`}>
                    {practiceFeedback[item.id].success ? "✅ Perfect pronunciation!" : "❌ Keep trying. Heard: " + practiceFeedback[item.id].heard}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phrases Grid (Core Languages Only) */}
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Essential {masterCoreLanguages[activeCoreLang].name} Phrases</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {masterCoreLanguages[activeCoreLang].phrases.map((phrase, idx) => {
          const uniqueId = `essential-${activeCoreLang}-${idx}`;
          return (
            <div key={uniqueId} className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl hover:border-blue-400 dark:hover:border-sky-500 transition-colors group">
              <div className="flex justify-between items-center w-full">
                
                <div className="flex flex-col gap-1 pr-24 min-w-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{phrase.en}</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{phrase.target}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Practice Pronunciation Mic */}
                  <button
                    onClick={() => startPractice(phrase.target, masterCoreLanguages[activeCoreLang].voiceCode, uniqueId)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      listeningId === uniqueId
                        ? "bg-red-500 text-white shadow-md animate-pulse"
                        : "bg-white dark:bg-slate-700/50 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800"
                    }`}
                    title="Test Pronunciation"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  </button>

                  {/* Play Audio */}
                  <button
                    onClick={() => playAudio(phrase.target, masterCoreLanguages[activeCoreLang].voiceCode, uniqueId)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      playingIndex === uniqueId
                        ? "bg-blue-600 text-white shadow-md animate-pulse"
                        : "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"
                    }`}
                    title="Listen"
                  >
                    {playingIndex === uniqueId ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    ) : (
                      <svg className="w-5 h-5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Pronunciation Feedback */}
              {practiceFeedback[uniqueId] && (
                <div className={`mt-3 pt-3 border-t text-sm font-semibold flex items-center gap-2 ${practiceFeedback[uniqueId].success ? "border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400"}`}>
                  {practiceFeedback[uniqueId].success ? "✅ Perfect pronunciation!" : "❌ Keep trying. Heard: " + practiceFeedback[uniqueId].heard}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}