"use client";

import { useState, useEffect } from "react";

export default function TextTools({ activeTool }: { activeTool: string }) {
  // If a text tool isn't active, don't render anything or run logic
  if (!["word-counter", "case-converter", "list-tools", "find-replace", "lorem-gen", "lang-converter"].includes(activeTool)) {
    return null;
  }

  // ==========================================
  // 1. WORD COUNTER STATE
  // ==========================================
  const [text, setText] = useState("");

  // ==========================================
  // 2. CASE CONVERTER STATE
  // ==========================================
  const [caseText, setCaseText] = useState("");
  
  const convertCase = (type: string) => {
    let str = caseText;
    if (type === "upper") str = str.toUpperCase();
    if (type === "lower") str = str.toLowerCase();
    if (type === "title") str = str.toLowerCase().replace(/(?:^|\s)\w/g, (m) => m.toUpperCase());
    if (type === "sentence") str = str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (m) => m.toUpperCase());
    setCaseText(str);
  };

  // ==========================================
  // 3. DUMMY LOREM GENERATOR STATE
  // ==========================================
  const [loremCount, setLoremCount] = useState<number | "">(3);
  const [loremLang, setLoremLang] = useState("latin");
  const [loremOutput, setLoremOutput] = useState("");

  const loremDictionary: Record<string, string> = {
    latin: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    english: "Synergy is the key to leveraging cross-platform deliverables and maximizing enterprise bandwidth. Moving forward, we need to drill down into core competencies.",
    spanish: "El texto alternativo es esencial para visualizar el diseño gráfico y la maquetación. Permite evaluar la distribution de los bloques de texto antes de redactar.",
    french: "Le texte factice est un outil indispensable pour la conception graphique et la mise en page. Il permet de tester la typographie et la structure visuelle.",
    german: "Blindtext ist ein Platzhaltertext, der in der Design- und Verlagsbranche verwendet wird. Er dient dazu, das visuelle Erscheinungsbild eines Dokuments zu demonstrieren."
  };

  const generateLorem = (countVal = loremCount, langVal = loremLang) => {
    const count = Math.max(1, Math.min(50, Number(countVal) || 1));
    const sample = loremDictionary[langVal] || loremDictionary.latin;
    const paragraphs = Array(count).fill(sample).join("\n\n");
    setLoremOutput(paragraphs);
  };

  const resetLorem = () => { setLoremCount(3); setLoremLang("latin"); generateLorem(3, "latin"); };
  
  useEffect(() => { generateLorem(); }, [loremCount, loremLang]);

  // ==========================================
  // 4. LANGUAGE TRANSLATOR STATE
  // ==========================================
  const [transInputText, setTransInputText] = useState("Hello world! Welcome to NexaKit.");
  const [transOutputText, setTransOutputText] = useState("");
  const [transFrom, setTransFrom] = useState("en");
  const [transTo, setTransTo] = useState("es");
  const [transLoading, setTransLoading] = useState(false);

  const translateText = async () => {
    if (!transInputText.trim()) { setTransOutputText(""); return; }
    setTransLoading(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(transInputText)}&langpair=${transFrom}|${transTo}`);
      const data = await res.json();
      setTransOutputText(data.responseData?.translatedText || "Translation failed.");
    } catch {
      setTransOutputText("Network error during translation request.");
    } finally { setTransLoading(false); }
  };

  // ==========================================
  // 5. LIST SORTER & DEDUPLICATOR STATE
  // ==========================================
  const [listInput, setListInput] = useState("Apple\nZebra\nBanana\nApple\nOrange");
  const [listOutput, setListOutput] = useState("");
  
  const processList = (action: string) => {
    let arr = listInput.split("\n").filter((i) => i.trim() !== "");
    if (action === "sort-asc") arr.sort((a, b) => a.localeCompare(b));
    if (action === "sort-desc") arr.sort((a, b) => b.localeCompare(a));
    if (action === "dedupe") arr = Array.from(new Set(arr));
    if (action === "reverse") arr.reverse();
    setListOutput(arr.join("\n"));
  };

  // ==========================================
  // 6. FIND & REPLACE STATE
  // ==========================================
  const [frInput, setFrInput] = useState("The quick brown fox jumps over the lazy fox.");
  const [frFind, setFrFind] = useState("fox");
  const [frReplace, setFrReplace] = useState("dog");
  const frOutput = frFind ? frInput.split(frFind).join(frReplace) : frInput;

  return (
    <>
      {activeTool === "word-counter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Word & Character Counter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Count the total number of characters and words in your text.</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text..." className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold dark:text-slate-200">
              Characters <span className="block text-2xl text-blue-600 dark:text-sky-400">{text.length}</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold dark:text-slate-200">
              Words <span className="block text-2xl text-blue-600 dark:text-sky-400">{text.trim() ? text.trim().split(/\s+/).length : 0}</span>
            </div>
          </div>
        </div>
      )}

      {activeTool === "case-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Text Case Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Quickly reformat text to uppercase, lowercase, or title case.</p>
          <textarea value={caseText} onChange={(e) => setCaseText(e.target.value)} placeholder="Enter text..." className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" />
          <div className="flex flex-wrap gap-3">
            <button onClick={() => convertCase("upper")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">UPPERCASE</button>
            <button onClick={() => convertCase("lower")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">lowercase</button>
            <button onClick={() => convertCase("title")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">Title Case</button>
          </div>
        </div>
      )}

      {activeTool === "list-tools" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">List Sorter & Deduplicator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Alphabetize, reverse, and remove duplicates from your lists instantly.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input List (One item per line)</label>
              <textarea value={listInput} onChange={(e) => setListInput(e.target.value)} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white whitespace-pre-wrap" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Processed Output</label>
              <textarea readOnly value={listOutput} placeholder="Action result..." className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white whitespace-pre-wrap" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => processList("sort-asc")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Sort A-Z</button>
            <button onClick={() => processList("sort-desc")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Sort Z-A</button>
            <button onClick={() => processList("reverse")} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg">Reverse Order</button>
            <button onClick={() => processList("dedupe")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg">Remove Duplicates</button>
          </div>
        </div>
      )}

      {activeTool === "find-replace" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Find & Replace Text</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Search for specific words or phrases and replace them across your text.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Find string</label>
              <input type="text" value={frFind} onChange={(e) => setFrFind(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="e.g. apple" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Replace with</label>
              <input type="text" value={frReplace} onChange={(e) => setFrReplace(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="e.g. orange" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Original Text</label>
              <textarea value={frInput} onChange={(e) => setFrInput(e.target.value)} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Output Text</label>
              <textarea readOnly value={frOutput} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white" />
            </div>
          </div>
        </div>
      )}

      {activeTool === "lorem-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1 dark:text-white">Dummy Lorem Generator</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate dummy placeholder text for mockups and UI designs in multiple languages.</p>
            </div>
            <button onClick={resetLorem} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg">Reset</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
            <input type="number" min="1" max="50" value={loremCount} onChange={(e) => setLoremCount(Number(e.target.value))} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg w-full sm:w-24 dark:text-white" />
            <select value={loremLang} onChange={(e) => setLoremLang(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg w-full sm:flex-1 dark:text-white">
              <option value="latin">Latin</option><option value="english">English</option><option value="spanish">Spanish</option><option value="french">French</option><option value="german">German</option>
            </select>
            <button onClick={() => generateLorem()} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg">Generate</button>
          </div>
          <textarea readOnly value={loremOutput} className="w-full h-44 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white" />
        </div>
      )}

      {activeTool === "lang-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Language Converter & Translator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Translate blocks of text between English, Spanish, French, and German.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Source</label>
              <select value={transFrom} onChange={(e) => setTransFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Target</label>
              <select value={transTo} onChange={(e) => setTransTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                <option value="es">Spanish</option><option value="en">English</option><option value="fr">French</option><option value="de">German</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <textarea value={transInputText} onChange={(e) => setTransInputText(e.target.value)} className="w-full h-28 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
          </div>
          <button onClick={translateText} disabled={transLoading} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-6 disabled:bg-slate-400">
            {transLoading ? "Translating..." : "Translate Text"}
          </button>
          <div className="w-full min-h-[100px] p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white">
            {transOutputText}
          </div>
        </div>
      )}
    </>
  );
}