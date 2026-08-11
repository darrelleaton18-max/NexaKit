"use client";

import React, { useState, useRef, useEffect } from "react";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  
  // Optional: State for a user to input their own API key if you don't want to pay for it!
  const [apiKey, setApiKey] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION 1: Destroy memory on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [originalUrl, processedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      
      // OPTIMIZATION 2: Clear old URLs to free up RAM
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
        setProcessedUrl(null);
      }
      
      setOriginalUrl(URL.createObjectURL(selected));
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      /* 
       * ==========================================
       * API INTEGRATION POINT
       * ==========================================
       * To make this fully functional, uncomment the code below 
       * and use a service like Remove.bg.
       */
       
      /*
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey || "YOUR_FALLBACK_API_KEY" },
        body: formData,
      });

      if (!response.ok) throw new Error("API request failed");
      
      const blob = await response.blob();
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      setProcessedUrl(URL.createObjectURL(blob));
      */

      // ==========================================
      // MOCK PROCESSING (Remove this when API is added)
      // ==========================================
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("This is a UI placeholder. To make this work, hook up the Remove.bg API block in the code!");
      
      // Simulating a successful return by just showing the original image for now
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      setProcessedUrl(URL.createObjectURL(file)); 
      
      setIsProcessing(false);

    } catch (error) {
      console.error("Background removal error:", error);
      alert("Failed to remove background. Check your API key.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Background Remover</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Automatically isolate subjects and remove image backgrounds with AI.</p>
      </div>

      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center transition-all ${isProcessing ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 opacity-75 cursor-wait' : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500/50 bg-neutral-50 dark:bg-black/20 cursor-pointer group'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          disabled={isProcessing}
        />
        
        <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-orange-500/20 transition-all">
          <svg className={`w-8 h-8 transition-colors ${file ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">
          {file ? file.name : "Upload Image to Edit"}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : "Drag & drop your file here, or click to browse"}
        </p>
      </div>

      {file && originalUrl && !processedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">API Configuration</h3>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Remove.bg API Key (Optional)</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here..." 
                className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
              />
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-4 font-bold uppercase tracking-widest">
              Processing runs securely via external API. Images are not permanently stored.
            </p>
          </div>

          <button 
            onClick={removeBackground} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Isolating Subject..." : "Remove Background"}
          </button>
        </div>
      )}

      {file && processedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Background Removed!</h3>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-8 uppercase tracking-widest">
            Transparent PNG ready for download
          </p>
          
          {/* Checkered background utility class to show transparency */}
          <div className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 overflow-hidden" 
               style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px' }}>
            <img src={processedUrl} alt="Processed preview" className="w-full object-contain max-h-64" />
          </div>
          
          <div className="flex gap-4">
             <button 
              onClick={() => setProcessedUrl(null)}
              className="px-8 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Start Over
            </button>
            <a 
              href={processedUrl} 
              download={`nobg_${file.name.split('.')[0]}.png`}
              className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Download PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}