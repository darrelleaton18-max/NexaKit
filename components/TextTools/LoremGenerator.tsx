"use client";

import { useState } from "react";

const LOREM_WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];

export default function LoremGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "lorem-gen") return null;

  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    let result = [];
    for (let p = 0; p < paragraphs; p++) {
      let para = [];
      const wordCount = Math.floor(Math.random() * (45 - 20 + 1)) + 20; // 20 to 45 words per paragraph
      
      for (let w = 0; w < wordCount; w++) {
        let word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        if (w === 0) word = word.charAt(0).toUpperCase() + word.slice(1); // Capitalize first word
        para.push(word);
      }
      result.push(para.join(" ") + ".");
    }
    
    // Ensure the classic "Lorem ipsum" starter for the first paragraph
    if (result.length > 0) {
      result[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result[0].substring(20);
    }
    
    setOutput(result.join("\n\n"));
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Dummy Lorem Generator</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Generate placeholder text instantly for your web design mockups.</p>

      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Paragraphs</label>
          <input type="number" min="1" max="50" value={paragraphs} onChange={(e) => setParagraphs(Number(e.target.value))} className="w-32 p-3 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white" />
        </div>
        <button onClick={generateLorem} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm">
          Generate Text
        </button>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={output}
          placeholder="Generated text will appear here..."
          className="w-full h-64 p-4 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl dark:text-white resize-y focus:outline-none"
        />
        {output && (
          <button onClick={handleCopy} className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600'}`}>
            {copied ? "✓ Copied!" : "Copy to Clipboard"}
          </button>
        )}
      </div>
    </div>
  );
}