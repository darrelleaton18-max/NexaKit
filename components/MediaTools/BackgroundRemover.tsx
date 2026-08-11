"use client";

import React, { useState, useRef } from "react";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState<number>(30);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setProcessedUrl(null);
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample the top-left pixel as the background color to remove
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      // Loop through pixels and make matching colors transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check color distance from the sampled background
        const distance = Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );

        if (distance < tolerance * 4.4) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setProcessedUrl(url);
        }
        setIsProcessing(false);
      }, "image/png");
    } catch (error) {
      console.error("Background removal error:", error);
      alert("Failed to process background.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Background Remover</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Isolate subjects by making solid background colors transparent instantly.</p>
      </div>

      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center transition-all ${isProcessing ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 opacity-75 cursor-wait' : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500/50 bg-neutral-50 dark:bg-black/20 cursor-pointer group'}`}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isProcessing} />
        
        <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-orange-500/20 transition-all">
          <svg className={`w-8 h-8 transition-colors ${file ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">{file ? file.name : "Upload Image"}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{file ? "Ready to process" : "Drag & drop your file here, or click to browse"}</p>
      </div>

      {file && !processedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
             <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Sensitivity Tolerance</h3>
             <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Adjust how aggressively similar background tones are removed.</p>
             <div className="flex items-center gap-4">
               <input 
                 type="range" 
                 min="5" 
                 max="80" 
                 value={tolerance} 
                 onChange={(e) => setTolerance(Number(e.target.value))} 
                 className="w-full accent-orange-500" 
               />
               <span className="font-bold text-orange-500 w-12 text-right">{tolerance}</span>
             </div>
          </div>

          <button 
            onClick={removeBackground} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Removing Background..." : "Remove Background Now"}
          </button>
        </div>
      )}

      {processedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Background Removed!</h3>
          {/* Checkerboard background pattern to easily visualize transparency */}
          <div className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] flex justify-center p-4">
            <img src={processedUrl} alt="Processed preview" className="object-contain max-h-64" />
          </div>
          <a href={processedUrl} download={`no_bg_${file?.name.replace(/\.[^/.]+$/, "")}.png`} className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform">
            Download Transparent PNG
          </a>
        </div>
      )}
    </div>
  );
}