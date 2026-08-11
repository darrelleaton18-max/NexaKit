"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<number>(0.7); // 70% quality default
  
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION 1: Destroy temporary URLs to prevent RAM leaks
  useEffect(() => {
    return () => {
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [compressedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      
      // OPTIMIZATION 2: Clear old compressed image if a new one is uploaded
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
        setCompressedUrl(null);
        setCompressedSize(0);
      }
    }
  };

  const compressImage = async () => {
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

      // OPTIMIZATION 3: Safety check to prevent Safari/Mobile crashes
      const MAX_DIMENSION = 4000;
      if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
        alert(`Image is too large (${img.naturalWidth}x${img.naturalHeight}). Maximum dimension is ${MAX_DIMENSION}px.`);
        URL.revokeObjectURL(objectUrl);
        setIsProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Draw a white background first in case it's a transparent PNG being compressed to JPG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Free the original image memory instantly
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Clean up old preview before creating a new one
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        },
        "image/jpeg", // Force JPEG for best compression results
        quality
      );
    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress image.");
      setIsProcessing(false);
    }
  };

  // Helper to format bytes to MB/KB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate percentage saved
  const savings = file && compressedSize > 0 
    ? Math.round(((file.size - compressedSize) / file.size) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Compressor</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Reduce image file sizes instantly without uploading to a server.</p>
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
          {file ? file.name : "Upload Image to Compress"}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {file ? `Original Size: ${formatBytes(file.size)}` : "Drag & drop your file here, or click to browse"}
        </p>
      </div>

      {file && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Compression Quality</h3>
              <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold rounded-lg text-sm">
                {Math.round(quality * 100)}%
              </span>
            </div>
            
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05" 
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none" 
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
              <span>Smaller File</span>
              <span>Better Quality</span>
            </div>
          </div>

          <button 
            onClick={compressImage} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Compressing..." : "Compress Image"}
          </button>
        </div>
      )}

      {file && compressedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <div className="flex items-center justify-center gap-4 mb-6 w-full">
            <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Original</p>
              <p className="text-lg font-extrabold text-neutral-900 dark:text-white">{formatBytes(file.size)}</p>
            </div>
            
            <svg className="w-6 h-6 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            
            <div className="flex-1 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-widest mb-1">Compressed</p>
              <p className="text-lg font-extrabold text-green-700 dark:text-green-400">{formatBytes(compressedSize)}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-bold rounded-full text-sm mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Saved {savings}% space
          </div>
          
          <img src={compressedUrl} alt="Compressed preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          
          <a 
            href={compressedUrl} 
            download={`compressed_${file.name.split('.')[0]}.jpg`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}