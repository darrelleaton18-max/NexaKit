"use client";

import { useState } from "react";

export default function QrGenerator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "qr-maker") return null;
  const [text, setText] = useState("https://nexakit.com");

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">QR Code Generator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Create instant scannable QR codes for links, text, and data.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Data or URL</label>
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            placeholder="Enter text or URL here..." 
          />
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text || "empty")}`} 
            alt="QR Code" 
            className="w-48 h-48 rounded-xl shadow-sm bg-white p-2" 
          />
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text || "empty")}`;
              link.target = '_blank';
              link.click();
            }} 
            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-sm"
          >
            Download HD Image
          </button>
        </div>
      </div>
    </div>
  );
}