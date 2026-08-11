"use client";

import React, { useState, useRef } from "react";

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";

export default function WatermarkImage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("© Omni Utility");
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(0.6);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOutputUrl(null);
    }
  };

  const applyWatermark = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure watermark styling
      ctx.globalAlpha = opacity;
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = "middle";

      const padding = 30;
      const metrics = ctx.measureText(watermarkText);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      if (position === "tile") {
        // Tile watermark diagonally across the image
        ctx.rotate((-20 * Math.PI) / 180);
        const stepX = textWidth + 100;
        const stepY = textHeight + 80;

        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            ctx.fillText(watermarkText, x, y);
          }
        }
      } else {
        let x = padding;
        let y = padding;

        if (position === "center") {
          x = (canvas.width - textWidth) / 2;
          y = canvas.height / 2;
        } else if (position === "top-left") {
          x = padding;
          y = padding + textHeight / 2;
        } else if (position === "top-right") {
          x = canvas.width - textWidth - padding;
          y = padding + textHeight / 2;
        } else if (position === "bottom-left") {
          x = padding;
          y = canvas.height - padding - textHeight / 2;
        } else if (position === "bottom-right") {
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding - textHeight / 2;
        }

        ctx.fillText(watermarkText, x, y);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, file.type);
    } catch (error) {
      console.error("Watermark error:", error);
      alert("Failed to apply watermark.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Watermark Image</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Protect your images by overlaying custom text watermarks securely in your browser.</p>
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

        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">{file ? file.name : "Upload Base Image"}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{file ? "Click to change image" : "Drag & drop your file here, or click to browse"}</p>
      </div>

      {file && !outputUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
             <div>
               <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Watermark Text</label>
               <input 
                 type="text" 
                 value={watermarkText} 
                 onChange={(e) => setWatermarkText(e.target.value)} 
                 className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Font Size ({fontSize}px)</label>
                 <input type="range" min="16" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-orange-500" />
               </div>

               <div>
                 <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
                 <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-orange-500" />
               </div>

               <div>
                 <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Color</label>
                 <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-11 bg-transparent cursor-pointer rounded-xl" />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Position</label>
               <div className="flex flex-wrap gap-3">
                 {(["bottom-right", "bottom-left", "center", "top-left", "top-right", "tile"] as Position[]).map((pos) => (
                   <button
                     key={pos}
                     onClick={() => setPosition(pos)}
                     className={`px-4 py-2 rounded-xl font-bold capitalize transition-all ${position === pos ? "bg-orange-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
                   >
                     {pos.replace("-", " ")}
                   </button>
                 ))}
               </div>
             </div>
          </div>

          <button 
            onClick={applyWatermark} 
            disabled={isProcessing || !watermarkText} 
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Applying Watermark..." : "Apply Watermark Now"}
          </button>
        </div>
      )}

      {outputUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Watermark Added!</h3>
          <img src={outputUrl} alt="Watermarked preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          <a href={outputUrl} download={`watermarked_${file?.name}`} className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform">
            Download Watermarked Image
          </a>
        </div>
      )}
    </div>
  );
}