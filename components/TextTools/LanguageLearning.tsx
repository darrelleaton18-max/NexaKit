"use client";

import { useState, useEffect } from "react";

// Master list of all core languages and their expanded essential phrases
const masterCoreLanguages = {
  spanish: { name: "Spanish", flag: "🇪🇸", voiceCode: "es-ES", translateCode: "es", phrases: [
    { en: "Hello", target: "Hola", phonetic: "oh-lah" }, 
    { en: "How are you?", target: "¿Cómo estás?", phonetic: "koh-moh ehs-tahs" },
    { en: "Thank you", target: "Gracias", phonetic: "grah-see-ahs" }, 
    { en: "Please", target: "Por favor", phonetic: "pohr fah-vohr" }, 
    { en: "I don't understand", target: "No entiendo", phonetic: "noh ehn-tee-ehn-doh" },
    { en: "How much does this cost?", target: "¿Cuánto cuesta esto?", phonetic: "kwahn-toh kwes-tah ehs-toh" },
    { en: "Where is the bathroom?", target: "¿Dónde está el baño?", phonetic: "dohn-deh ehs-tah ehl bah-nyoh" },
    { en: "Where is the train station?", target: "¿Dónde está la estación de tren?", phonetic: "dohn-deh ehs-tah lah ehs-tah-see-ohn deh trehn" },
    { en: "Can you help me?", target: "¿Puedes ayudarme?", phonetic: "pweh-dehs ah-yoo-dahr-meh" }
  ]},
  french: { name: "French", flag: "🇫🇷", voiceCode: "fr-FR", translateCode: "fr", phrases: [
    { en: "Hello", target: "Bonjour", phonetic: "bohn-zhoor" }, 
    { en: "How are you?", target: "Comment allez-vous ?", phonetic: "koh-mahn-tah-lay-voo" },
    { en: "Thank you", target: "Merci", phonetic: "mair-see" }, 
    { en: "Please", target: "S'il vous plaît", phonetic: "seel voo play" }, 
    { en: "I don't understand", target: "Je ne comprends pas", phonetic: "zhuh nuh kohn-prahn pah" },
    { en: "How much does this cost?", target: "Combien ça coûte ?", phonetic: "kohn-byan sah koot" },
    { en: "Where is the bathroom?", target: "Où sont les toilettes?", phonetic: "oo sohn lay twah-let" },
    { en: "Where is the train station?", target: "Où est la gare ?", phonetic: "oo ay lah gahr" },
    { en: "Can you help me?", target: "Pouvez-vous m'aider ?", phonetic: "poo-vay-voo may-day" }
  ]},
  german: { name: "German", flag: "🇩🇪", voiceCode: "de-DE", translateCode: "de", phrases: [
    { en: "Hello", target: "Hallo", phonetic: "hah-loh" }, 
    { en: "How are you?", target: "Wie geht es dir?", phonetic: "vee gayt es deer" },
    { en: "Thank you", target: "Danke", phonetic: "dahn-kuh" }, 
    { en: "Please", target: "Bitte", phonetic: "bih-tuh" }, 
    { en: "I don't understand", target: "Ich verstehe nicht", phonetic: "ikh fehr-shtay-uh nikht" },
    { en: "How much does this cost?", target: "Wie viel kostet das?", phonetic: "vee feel kohs-tet dahs" },
    { en: "Where is the bathroom?", target: "Wo ist die Toilette?", phonetic: "voh ist dee twah-leh-tuh" },
    { en: "Where is the train station?", target: "Wo ist der Bahnhof?", phonetic: "voh ist dehr bahn-hohf" },
    { en: "Can you help me?", target: "Können Sie mir helfen?", phonetic: "kuh-nen zee meer hel-fen" }
  ]},
  italian: { name: "Italian", flag: "🇮🇹", voiceCode: "it-IT", translateCode: "it", phrases: [
    { en: "Hello", target: "Ciao", phonetic: "chow" }, 
    { en: "How are you?", target: "Come stai?", phonetic: "koh-meh sty" },
    { en: "Thank you", target: "Grazie", phonetic: "grah-tsee-eh" }, 
    { en: "Please", target: "Per favore", phonetic: "pehr fah-voh-reh" }, 
    { en: "I don't understand", target: "Non capisco", phonetic: "nohn kah-pee-skoh" },
    { en: "How much does this cost?", target: "Quanto costa?", phonetic: "kwahn-toh koh-stah" },
    { en: "Where is the bathroom?", target: "Dov'è il bagno?", phonetic: "doh-veh eel bah-nyoh" },
    { en: "Where is the train station?", target: "Dov'è la stazione ferroviaria?", phonetic: "doh-veh lah stah-tsee-oh-neh fehr-roh-vyah-ryah" },
    { en: "Can you help me?", target: "Può aiutarmi?", phonetic: "pwo ah-yoo-tahr-mee" }
  ]},
  japanese: { name: "Japanese", flag: "🇯🇵", voiceCode: "ja-JP", translateCode: "ja", phrases: [
    { en: "Hello", target: "こんにちは", phonetic: "konnichiwa" }, 
    { en: "How are you?", target: "お元気ですか", phonetic: "ogenki desu ka" },
    { en: "Thank you", target: "ありがとう", phonetic: "arigatou" }, 
    { en: "Please", target: "お願いします", phonetic: "onegaishimasu" }, 
    { en: "I don't understand", target: "わかりません", phonetic: "wakarimasen" },
    { en: "How much does this cost?", target: "これはいくらですか", phonetic: "kore wa ikura desu ka" },
    { en: "Where is the bathroom?", target: "トイレはどこですか", phonetic: "toire wa doko desu ka" },
    { en: "Where is the train station?", target: "駅はどこですか", phonetic: "eki wa doko desu ka" },
    { en: "Can you help me?", target: "手伝ってくれますか", phonetic: "tetsudatte kuremasu ka" }
  ]},
  mandarin: { name: "Mandarin", flag: "🇨🇳", voiceCode: "zh-CN", translateCode: "zh-CN", phrases: [
    { en: "Hello", target: "你好", phonetic: "nǐ hǎo" }, 
    { en: "How are you?", target: "你好吗", phonetic: "nǐ hǎo ma" },
    { en: "Thank you", target: "谢谢", phonetic: "xièxiè" }, 
    { en: "Please", target: "请", phonetic: "qǐng" }, 
    { en: "I don't understand", target: "我不明白", phonetic: "wǒ bù míngbái" },
    { en: "How much does this cost?", target: "这个多少钱", phonetic: "zhège duōshǎo qián" },
    { en: "Where is the bathroom?", target: "洗手间在哪里", phonetic: "xǐshǒujiān zài nǎlǐ" },
    { en: "Where is the train station?", target: "火车站里在哪里", phonetic: "huǒchē zhàn zài nǎlǐ" },
    { en: "Can you help me?", target: "你能帮我吗", phonetic: "nǐ néng bāng wǒ ma" }
  ]},
  english: { name: "English", flag: "🇬🇧", voiceCode: "en-GB", translateCode: "en", phrases: [
    { en: "Hello", target: "Hello", phonetic: "heh-loh" }, 
    { en: "How are you?", target: "How are you?", phonetic: "how ahr yoo" },
    { en: "Thank you", target: "Thank you", phonetic: "thangk yoo" }, 
    { en: "Please", target: "Please", phonetic: "pleez" }, 
    { en: "I don't understand", target: "I don't understand", phonetic: "eye dohnt uhn-der-stand" },
    { en: "How much does this cost?", target: "How much does this cost?", phonetic: "how muhch duhz this kawst" },
    { en: "Where is the bathroom?", target: "Where is the bathroom?", phonetic: "hwair iz thuh bath-room" },
    { en: "Where is the train station?", target: "Where is the train station?", phonetic: "hwair iz thuh treyn stey-shuhn" },
    { en: "Can you help me?", target: "Can you help me?", phonetic: "kan yoo help mee" }
  ]},
  korean: { name: "Korean", flag: "🇰🇷", voiceCode: "ko-KR", translateCode: "ko", phrases: [
    { en: "Hello", target: "안녕하세요", phonetic: "annyeonghaseyo" }, 
    { en: "How are you?", target: "어떻게 지내세요?", phonetic: "eotteoke jinaeseyo?" },
    { en: "Thank you", target: "감사합니다", phonetic: "gamsahamnida" }, 
    { en: "Please", target: "부탁합니다", phonetic: "butakhamnida" }, 
    { en: "I don't understand", target: "이해가 안 돼요", phonetic: "ihaega an dwaeyo" },
    { en: "How much does this cost?", target: "이거 얼마예요?", phonetic: "igeo eolmayeyo?" },
    { en: "Where is the bathroom?", target: "화장실이 어디예요?", phonetic: "hwajangsiri eodiyeyo?" },
    { en: "Where is the train station?", target: "기차역이 어디에 있나요?", phonetic: "gichayeogi eodie innayo?" },
    { en: "Can you help me?", target: "도와주실 수 있나요?", phonetic: "dowajusil su innayo?" }
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
  phonetic?: string; // NEW: Storing Romanized phonetics for custom translations
}

export default function LanguageLearning() {
  const [activeCoreLang, setActiveCoreLang] = useState<CoreLanguageKey>("spanish");
  const [topRegionLanguages, setTopRegionLanguages] = useState<CoreLanguageKey[]>(["spanish", "french", "german", "japanese", "italian"]);
  
  const [customText, setCustomText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedCustomLang, setSelectedCustomLang] = useState("es"); 
  
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85);
  const [playingIndex, setPlayingIndex] = useState<string | null>(null);
  const [listeningId, setListeningId] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { success: boolean, heard: string }>>({});
  const [savedHistory, setSavedHistory] = useState<SavedTranslation[]>([]);
  const [showAllSaved, setShowAllSaved] = useState(true);

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
    setPlayingIndex(null);
    
    setTimeout(() => {
      const cleanText = text.replace(/\s*\(.*?\)\s*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voiceCode;
      utterance.rate = playbackSpeed; 

      utterance.onstart = () => setPlayingIndex(id);
      utterance.onend = () => setPlayingIndex(null);
      utterance.onerror = () => setPlayingIndex(null);

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const playPhoneticChunk = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB"; 
    utterance.rate = playbackSpeed * 0.85; 
    
    window.speechSynthesis.speak(utterance);
  };

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

    const expected = targetText.replace(/\s*\(.*?\)\s*/g, '').toLowerCase().replace(/[.,!?¿¡]/g, '').trim();

    recognition.onstart = () => {
      setListeningId(id);
      setPracticeFeedback(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const spoken = transcript.toLowerCase().replace(/[.,!?¿¡]/g, '').trim();
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

  const handleTranslate = async (textOverride?: string) => {
    const textToProcess = textOverride || customText;
    if (!textToProcess.trim()) return;
    
    setIsTranslating(true);
    setTranslatedText("");
    
    try {
      const targetLangDef = allLanguages.find(l => l.code === selectedCustomLang) || allLanguages[16];
      
      // NEW: Added &dt=rm to the API call to request Romanized phonetic text
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLangDef.code}&dt=t&dt=rm&q=${encodeURIComponent(textToProcess)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data[0]) {
        // Extract standard translation
        const fullTranslation = data[0].filter((item: any) => item[0] !== null).map((item: any) => item[0]).join('');
        setTranslatedText(fullTranslation);
        
        // Extract Phonetic Romanization (if available from Google for this language)
        let extractedPhonetic = "";
        const rmData = data[0].find((item: any) => item[0] === null && typeof item[2] === 'string');
        if (rmData) {
          extractedPhonetic = rmData[2];
        }
        
        const newItem: SavedTranslation = {
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          original: textToProcess,
          translated: fullTranslation,
          langName: targetLangDef.name,
          voiceCode: targetLangDef.voice,
          phonetic: extractedPhonetic // Save the extracted phonetic
        };

        setSavedHistory(prev => {
          const exists = prev.find(p => p.original === newItem.original && p.langName === newItem.langName);
          if (exists) return prev;
          return [newItem, ...prev].slice(0, 30);
        }); 

        if (!textOverride) setCustomText(""); 
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

  const activeCustomLangName = allLanguages.find(l => l.code === selectedCustomLang)?.name || "Language";

  const groupedHistory = savedHistory.reduce((groups, item) => {
    if (!groups[item.langName]) groups[item.langName] = [];
    groups[item.langName].push(item);
    return groups;
  }, {} as Record<string, SavedTranslation[]>);

  const displayGroups = Object.keys(groupedHistory)
    .filter(langGroup => showAllSaved || langGroup === activeCustomLangName)
    .sort((a, b) => {
      if (a === activeCustomLangName) return -1;
      if (b === activeCustomLangName) return 1;
      return a.localeCompare(b);
    });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Language Phrasebook & Pronouncer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Learn essential phrases, build a custom dictionary, and test your pronunciation with your microphone.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Speed</span>
          <button 
            onClick={() => setPlaybackSpeed(0.85)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${playbackSpeed === 0.85 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            Normal
          </button>
          <button 
            onClick={() => setPlaybackSpeed(0.6)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${playbackSpeed === 0.6 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            Slow
          </button>
          <button 
            onClick={() => setPlaybackSpeed(0.4)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${playbackSpeed === 0.4 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            Very Slow
          </button>
        </div>
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
            onClick={() => handleTranslate()}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Saved Dictionary</h3>
              
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setShowAllSaved(false)} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${!showAllSaved ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Current Only
                </button>
                <button 
                  onClick={() => setShowAllSaved(true)} 
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${showAllSaved ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Show All
                </button>
              </div>
            </div>

            <button onClick={() => setSavedHistory([])} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap">Clear All</button>
          </div>
          
          <div className="flex flex-col gap-6">
            {displayGroups.length === 0 ? (
               <p className="text-sm text-slate-500 italic">No custom phrases saved for {activeCustomLangName} yet.</p>
            ) : (
              displayGroups.map((langGroup) => (
                <div key={langGroup} className="flex flex-col gap-3">
                  
                  <h4 className="text-xs font-extrabold text-blue-500 dark:text-sky-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex justify-between items-center">
                    {langGroup} 
                    {langGroup === activeCustomLangName && <span className="text-[10px] text-slate-400 lowercase tracking-normal font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Active Selection</span>}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedHistory[langGroup].map((item) => {
                      const isPlaying = playingIndex === item.id;

                      return (
                        <div key={item.id} className="flex flex-col p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-sky-500 transition-colors group relative overflow-hidden">
                          
                          {/* CSS LAYOUT FIX: Replaced absolute positioning with a robust flex container */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-4">
                            
                            {/* Text Container: Flex-1 forces it to take available space and wrap smoothly */}
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <span className="text-xs text-slate-400 truncate">{item.original}</span>
                              
                              <span 
                                className={`text-base font-bold transition-colors duration-300 ${isPlaying ? 'text-blue-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`} 
                                style={{ wordBreak: 'break-word' }}
                              >
                                {item.translated}
                              </span>

                              {/* NEW: Clickable Romanized Phonetic for Custom Translations */}
                              {item.phonetic && (
                                <div className={`flex flex-wrap gap-x-1 mt-0.5 text-xs font-medium italic transition-colors duration-300 ${isPlaying ? 'text-blue-500/80 dark:text-sky-400/80' : 'text-slate-500/80 dark:text-slate-400/80'}`}>
                                  {item.phonetic.split(/([ -])/).map((chunk, i) => {
                                    if (chunk === ' ' || chunk === '-') {
                                      return <span key={i}>{chunk}</span>;
                                    }
                                    return (
                                      <button
                                        key={i}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          playPhoneticChunk(chunk);
                                        }}
                                        className="hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                                        title={`Sound out "${chunk}"`}
                                      >
                                        {chunk}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Button Container: Safely aligned to the right or bottom depending on screen size */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                              <button
                                onClick={() => handleTranslate(item.original)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                title={`Translate this to ${activeCustomLangName}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                              </button>

                              <button
                                onClick={() => deleteHistoryItem(item.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                              
                              <button
                                onClick={() => startPractice(item.translated, item.voiceCode, item.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                  listeningId === item.id
                                    ? "bg-red-500 text-white shadow-md animate-pulse"
                                    : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                                }`}
                                title="Test Pronunciation"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                              </button>

                              <button
                                onClick={() => playAudio(item.translated, item.voiceCode, item.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                  isPlaying
                                    ? "bg-blue-600 text-white shadow-md animate-pulse"
                                    : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                }`}
                                title="Listen"
                              >
                                {isPlaying ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                                ) : (
                                  <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                )}
                              </button>
                            </div>
                          </div>

                          {practiceFeedback[item.id] && (
                            <div className={`mt-3 pt-3 border-t text-sm font-semibold flex items-center gap-2 ${practiceFeedback[item.id].success ? "border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400"}`}>
                              {practiceFeedback[item.id].success ? "✅ Perfect pronunciation!" : "❌ Keep trying. Heard: " + practiceFeedback[item.id].heard}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Phrases Grid (Core Languages Only) */}
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Essential {masterCoreLanguages[activeCoreLang].name} Phrases</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {masterCoreLanguages[activeCoreLang].phrases.map((phrase, idx) => {
          const uniqueId = `essential-${activeCoreLang}-${idx}`;
          const isPlaying = playingIndex === uniqueId;

          return (
            <div key={uniqueId} className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl hover:border-blue-400 dark:hover:border-sky-500 transition-colors group">
              
              {/* CSS LAYOUT FIX APPLIED HERE AS WELL */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-4">
                
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{phrase.en}</span>
                  
                  <span 
                    className={`text-base font-bold transition-colors duration-300 ${isPlaying ? 'text-blue-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {phrase.target}
                  </span>
                  
                  {/* CLICKABLE PHONETIC CHUNKS */}
                  {phrase.phonetic && (
                    <div className={`flex flex-wrap gap-x-1 mt-0.5 text-xs font-medium italic transition-colors duration-300 ${isPlaying ? 'text-blue-500/80 dark:text-sky-400/80' : 'text-slate-500/80 dark:text-slate-400/80'}`}>
                      {phrase.phonetic.split(/([ -])/).map((chunk, i) => {
                        if (chunk === ' ' || chunk === '-') {
                          return <span key={i}>{chunk}</span>;
                        }
                        return (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              playPhoneticChunk(chunk);
                            }}
                            className="hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                            title={`Sound out "${chunk}"`}
                          >
                            {chunk}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                  <button
                    onClick={() => startPractice(phrase.target, masterCoreLanguages[activeCoreLang].voiceCode, uniqueId)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      listeningId === uniqueId
                        ? "bg-red-500 text-white shadow-md animate-pulse"
                        : "bg-white dark:bg-slate-700/50 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800"
                    }`}
                    title="Test Pronunciation"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  </button>

                  <button
                    onClick={() => playAudio(phrase.target, masterCoreLanguages[activeCoreLang].voiceCode, uniqueId)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isPlaying
                        ? "bg-blue-600 text-white shadow-md animate-pulse"
                        : "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40"
                    }`}
                    title="Listen"
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    ) : (
                      <svg className="w-5 h-5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>
              </div>

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