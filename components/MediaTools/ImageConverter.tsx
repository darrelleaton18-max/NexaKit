"use client";

import React, { useState, useRef, useEffect } from "react";

type SupportedFormat = "JPG" | "PNG" | "WEBP" | "GIF";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>("WEBP");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION 1: Destroy the temporary URL when component closes or URL changes
  useEffect(() => {
    return () => {
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [convertedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      
      // OPTIMIZATION 2: Clear old conversion data to free up RAM
      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
        setConvertedUrl(null);
      }
    }
  };

  const convertImage = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // OPTIMIZATION 3: Mobile crash prevention
      const MAX_DIMENSION = 4000;
      if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
        alert(`Image is too large (${img.naturalWidth}x${img.naturalHeight}). Maximum dimension is ${MAX_DIMENSION}px to prevent browser crashes.`);
        URL.revokeObjectURL(objectUrl);
        setIsProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // If converting to JPG, fill a white background first (since JPG doesn't support transparency)
      if (targetFormat === "JPG") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      // OPTIMIZATION 4: Destroy original object URL instantly after drawing
      URL.revokeObjectURL(objectUrl);

      // Map our UI format string to actual MIME types
      let mimeType = "image/png";
      if (targetFormat === "JPG") mimeType = "image/jpeg";
      if (targetFormat === "WEBP") mimeType = "image/webp";
      if (targetFormat === "GIF") mimeType = "image/gif"; 

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        mimeType,
        0.9 // High quality compression
      );
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Failed to convert image.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Converter</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Convert images between JPG, PNG, WEBP, and GIF instantly inside your browser.</p>
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
          {file ? file.name : "Upload Image to Convert"}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : "Drag & drop your file here, or click to browse"}
        </p>
      </div>

      {file && !convertedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Convert To</h3>
            <div className="flex flex-wrap gap-3">
              {(['JPG', 'PNG', 'WEBP', 'GIF'] as SupportedFormat[]).map(ext => (
                <button 
                  key={ext} 
                  onClick={() => setTargetFormat(ext)}
                  className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${targetFormat === ext ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500'}`}
                >
                  {ext}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={convertImage} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Converting..." : `Convert to ${targetFormat}`}
          </button>
        </div>
      )}

      {file && convertedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Converted Successfully!</h3>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-8 uppercase tracking-widest">
            Format: {targetFormat}
          </p>
          
          <img src={convertedUrl} alt="Converted preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          
          <a 
            href={convertedUrl} 
            download={`converted_${file.name.split('.')[0]}.${targetFormat.toLowerCase()}`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download {targetFormat}
          </a>
        </div>
      )}
    </div>
  );
}