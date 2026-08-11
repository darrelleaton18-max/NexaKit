"use client";

import React, { useState, useRef } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setCompressedUrl(null);
      setCompressedSize(null);
    }
  };

  const compressImage = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;

      // Wait for the image to load into memory
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a hidden canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Draw the original image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Note: The canvas API ignores quality settings for PNGs. 
      // If the user uploads a PNG, we convert it to WebP under the hood to force compression.
      const outputType = file.type === "image/png" ? "image/webp" : file.type;
      const extension = outputType === "image/webp" ? "webp" : file.name.split('.').pop();

      // Export the canvas as a compressed blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        },
        outputType,
        quality / 100 // Convert 80% to 0.8
      );
    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress image.");
      setIsProcessing(false);
    }
  };

  // Utility to display clean file sizes (e.g., "1.2 MB")
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSavings = () => {
    if (!file || !compressedSize) return 0;
    const savings = ((file.size - compressedSize) / file.size) * 100;
    return savings > 0 ? savings.toFixed(1) : 0;
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Compressor</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Reduce image file size quickly without losing quality. 100% processed in your browser.</p>
      </div>

      {/* Upload Zone */}
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center transition-all ${isProcessing ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 opacity-75 cursor-wait' : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500/50 bg-neutral-50 dark:bg-black/20 cursor-pointer group'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
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

      {/* Controls & Action */}
      {file && !compressedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Compression Settings</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-orange-500" 
                />
                <span className="font-bold text-orange-500 w-12 text-right">{quality}%</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2">
                <span>Smaller File</span>
                <span>Better Quality</span>
              </div>
            </div>
          </div>

          <button 
            onClick={compressImage} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Compressing..." : "Compress Image Now"}
          </button>
        </div>
      )}

      {/* Results Zone */}
      {file && compressedUrl && compressedSize && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white dark:bg-black/20 p-6 rounded-2xl border border-neutral-200 dark:border-white/5">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Original Size</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{formatBytes(file.size)}</p>
            </div>
            
            <svg className="w-8 h-8 text-neutral-300 dark:text-neutral-600 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            
            <div className="text-center md:text-right">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">New Size</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-500">{formatBytes(compressedSize)}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-extrabold rounded-full text-sm">
              Saved {getSavings()}%!
            </span>
          </div>
          
          <img src={compressedUrl} alt="Compressed preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          
          <a 
            href={compressedUrl} 
            download={`compressed_${file.name.replace(/\.[^/.]+$/, "")}.${file.type === "image/png" ? "webp" : file.name.split('.').pop()}`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}