"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);
  
  // Cropping coordinates and dimensions
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number | "">("");
  const [cropHeight, setCropHeight] = useState<number | "">("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // OPTIMIZATION 1: Destroy memory on unmount
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    };
  }, [originalUrl, croppedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      
      // OPTIMIZATION 2: Clear old URLs to free up RAM
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (croppedUrl) {
        URL.revokeObjectURL(croppedUrl);
        setCroppedUrl(null);
      }
      
      const objectUrl = URL.createObjectURL(selected);
      setOriginalUrl(objectUrl);
      
      const img = new Image();
      img.onload = () => {
        setImgWidth(img.naturalWidth);
        setImgHeight(img.naturalHeight);
        
        // Default crop to 80% of the image in the center
        const defaultWidth = Math.floor(img.naturalWidth * 0.8);
        const defaultHeight = Math.floor(img.naturalHeight * 0.8);
        setCropWidth(defaultWidth);
        setCropHeight(defaultHeight);
        setCropX(Math.floor((img.naturalWidth - defaultWidth) / 2));
        setCropY(Math.floor((img.naturalHeight - defaultHeight) / 2));
      };
      img.src = objectUrl;
    }
  };

  const cropImage = async () => {
    if (!file || !originalUrl || typeof cropWidth !== 'number' || typeof cropHeight !== 'number') return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = originalUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // OPTIMIZATION 3: Mobile crash prevention limit
      const MAX_DIMENSION = 4000;
      if (cropWidth > MAX_DIMENSION || cropHeight > MAX_DIMENSION) {
        alert(`To ensure your browser doesn't crash, the maximum allowed crop dimension is ${MAX_DIMENSION}px.`);
        setIsProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // canvas drawImage parameters: (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
      ctx.drawImage(
        img, 
        cropX, cropY, cropWidth, cropHeight, // Source crop coordinates
        0, 0, cropWidth, cropHeight          // Destination coordinates (draw at 0,0 on the new canvas)
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (croppedUrl) URL.revokeObjectURL(croppedUrl);
            setCroppedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        file.type,
        1.0 
      );
    } catch (error) {
      console.error("Cropping error:", error);
      alert("Failed to crop image.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Cropper</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Precisely crop images using exact pixel coordinates. 100% processed locally.</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">
          {file ? file.name : "Upload Image to Crop"}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {file ? `Original: ${imgWidth} x ${imgHeight} px` : "Drag & drop your file here, or click to browse"}
        </p>
      </div>

      {file && originalUrl && !croppedUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Crop Settings</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Width (px)</label>
                <input 
                  type="number" 
                  value={cropWidth}
                  onChange={(e) => setCropWidth(parseInt(e.target.value) || "")}
                  max={imgWidth - cropX}
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Height (px)</label>
                <input 
                  type="number" 
                  value={cropHeight}
                  onChange={(e) => setCropHeight(parseInt(e.target.value) || "")}
                  max={imgHeight - cropY}
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">X Offset (Left)</label>
                <input 
                  type="number" 
                  value={cropX}
                  onChange={(e) => setCropX(parseInt(e.target.value) || 0)}
                  min={0}
                  max={typeof cropWidth === 'number' ? imgWidth - cropWidth : imgWidth}
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Y Offset (Top)</label>
                <input 
                  type="number" 
                  value={cropY}
                  onChange={(e) => setCropY(parseInt(e.target.value) || 0)}
                  min={0}
                  max={typeof cropHeight === 'number' ? imgHeight - cropHeight : imgHeight}
                  className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" 
                />
              </div>
            </div>
            
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-6 font-bold uppercase tracking-widest">
              X/Y offsets determine where the crop starts from the top-left corner of the image.
            </p>
          </div>

          <button 
            onClick={cropImage} 
            disabled={isProcessing || cropWidth === "" || cropHeight === ""}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all"
          >
            {isProcessing ? "Cropping..." : "Crop Image"}
          </button>
        </div>
      )}

      {file && croppedUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Cropped Successfully!</h3>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-8 uppercase tracking-widest">
            Size: {cropWidth} x {cropHeight} px
          </p>
          
          <img src={croppedUrl} alt="Cropped preview" className="w-full max-w-md rounded-xl shadow-lg mb-8 border border-neutral-200 dark:border-neutral-800 object-contain max-h-64 bg-black/5" />
          
          <div className="flex gap-4">
             <button 
              onClick={() => setCroppedUrl(null)}
              className="px-8 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Adjust Crop
            </button>
            <a 
              href={croppedUrl} 
              download={`cropped_${file.name}`}
              className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}