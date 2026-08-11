"use client";

import React, { useState, useRef } from "react";

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setCroppedUrl(null);
      setRotation(0);
    }
  };

  const rotateImage = (angleIncrement: number) => {
    setRotation((prev) => (prev + angleIncrement) % 360);
  };

  const processImage = async () => {
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
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Swap width/height if rotated 90 or 270 degrees
      if (rotation === 90 || rotation === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Move pivot to center and rotate
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedUrl(url);
        }
        setIsProcessing(false);
      }, file.type);
    } catch (error) {
      console.error("Rotation error:", error);
      alert("Failed to process image transformation.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Crop & Rotate</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Rotate images by 90-degree increments or frame them precisely.</p>
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

        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">{file ? file.name : "Upload Image to Edit"}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{file ? `Current Rotation: ${rotation}°` : "Drag & drop your file here, or click to browse"}</p>
      </div>

      {file && !croppedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center">
             <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Rotation Control</h3>
             <div className="flex flex-wrap gap-4 justify-center">
               <button onClick={() => rotateImage(90)} className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white font-bold rounded-xl transition-all">
                 Rotate 90° ↻
               </button>
               <button onClick={() => rotateImage(180)} className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white font-bold rounded-xl transition-all">
                 Rotate 180°
               </button>
               <button onClick={() => rotateImage(270)} className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white font-bold rounded-xl transition-all">
                 Rotate 270° ↺
               </button>
             </div>
          </div>

          <button 
            onClick={processImage} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Processing..." : "Apply Transformations & Export"}
          </button>
        </div>
      )}

      {croppedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Transformation Complete!</h3>
          <img src={croppedUrl} alt="Edited preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          <a href={croppedUrl} download={`edited_${file?.name}`} className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform">
            Download Edited Image
          </a>
        </div>
      )}
    </div>
  );
}