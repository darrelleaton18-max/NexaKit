"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION 1: Clean up memory when the component unmounts
  useEffect(() => {
    return () => {
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [resizedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      
      // OPTIMIZATION 2: Clean up old URL if user uploads a new image
      if (resizedUrl) {
        URL.revokeObjectURL(resizedUrl);
        setResizedUrl(null);
      }
      
      const objectUrl = URL.createObjectURL(selected);
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        
        // OPTIMIZATION 3: Immediately free up the memory used to read the dimensions
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  const handleWidthChange = (val: string) => {
    const newWidth = parseInt(val);
    setWidth(isNaN(newWidth) ? "" : newWidth);
    
    if (maintainRatio && !isNaN(newWidth) && originalWidth > 0) {
      setHeight(Math.round(newWidth * (originalHeight / originalWidth)));
    }
  };

  const handleHeightChange = (val: string) => {
    const newHeight = parseInt(val);
    setHeight(isNaN(newHeight) ? "" : newHeight);
    
    if (maintainRatio && !isNaN(newHeight) && originalHeight > 0) {
      setWidth(Math.round(newHeight * (originalWidth / originalHeight)));
    }
  };

  const resizeImage = async () => {
    if (!file || typeof width !== 'number' || typeof height !== 'number') return;
    
    // OPTIMIZATION 4: Mobile crash prevention limit
    const MAX_DIMENSION = 4000;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      alert(`To ensure your browser doesn't crash, the maximum allowed dimension is ${MAX_DIMENSION}px.`);
      return;
    }

    setIsProcessing(true);

    try {
      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Free the temporary image URL memory
      URL.revokeObjectURL(imageURL);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Clean up previous export if it exists before creating a new one
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            setResizedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        file.type,
        1.0 
      );
    } catch (error) {
      console.error("Resizing error:", error);
      alert("Failed to resize image.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Resizer</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Scale the dimensions of PNG, JPG, or WEBP images instantly. 100% processed locally.</p>
      </div>

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
          {file ? file.name : "Upload Image to Resize"}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {file ? `Original: ${originalWidth} x ${originalHeight} px` : "Drag & drop your file here, or click to browse"}
        </p>
      </div>

      {file && !resizedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">New Dimensions</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={maintainRatio} 
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Maintain Aspect Ratio</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Width (px)</label>
                <input 
                  type="number" 
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  placeholder={`e.g. ${originalWidth}`} 
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>

              {maintainRatio && (
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 items-center justify-center w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-400 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Height (px)</label>
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  placeholder={`e.g. ${originalHeight}`} 
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={resizeImage} 
            disabled={isProcessing || width === "" || height === ""}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Resizing..." : "Resize Image Now"}
          </button>
        </div>
      )}

      {file && resizedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Resized Successfully!</h3>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-8 uppercase tracking-widest">
            New Size: {width} x {height} px
          </p>
          
          <img src={resizedUrl} alt="Resized preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64" />
          
          <a 
            href={resizedUrl} 
            download={`resized_${width}x${height}_${file.name}`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}