"use client";

import { useState, useRef } from "react";

export default function ImageTools({ activeTool, isDark }: { activeTool: string, isDark: boolean }) {
  // If the image tool isn't active, don't render anything
  if (activeTool !== "image-tools") {
    return null;
  }

  // ==========================================
  // 1. IMAGE & PNG STUDIO STATE
  // ==========================================
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgName, setImgName] = useState("image");
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);
  const [targetColor, setTargetColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(15);
  const [outputFormat, setOutputFormat] = useState("image/png");
  const [processedImg, setProcessedImg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgName(file.name.split('.')[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImgSrc(src);
      const img = new Image();
      img.onload = () => {
        setImgWidth(img.width);
        setImgHeight(img.height);
        setProcessedImg(src); // set initial preview
      }
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const applyImageProcess = (action: string) => {
    if (!imgSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Apply new resized dimensions or fallback to original
      canvas.width = imgWidth || img.width;
      canvas.height = imgHeight || img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (action === "transparent") {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert chosen hex color to RGB
        const hex = targetColor.replace("#", "");
        const rT = parseInt(hex.substring(0, 2), 16);
        const gT = parseInt(hex.substring(2, 4), 16);
        const bT = parseInt(hex.substring(4, 6), 16);

        // Loop through every pixel to find matches
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const distance = Math.sqrt(Math.pow(r - rT, 2) + Math.pow(g - gT, 2) + Math.pow(b - bT, 2));
          const maxDistance = 441.67; // Maximum possible color distance
          const perc = (distance / maxDistance) * 100;

          if (perc <= tolerance) {
            data[i + 3] = 0; // Set Alpha to 0 (Transparent)
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      setProcessedImg(canvas.toDataURL(outputFormat));
    };
    img.src = imgSrc;
  };

  const downloadProcessedImage = () => {
    if (!processedImg) return;
    const link = document.createElement("a");
    link.href = processedImg;
    const ext = outputFormat === "image/jpeg" ? "jpg" : outputFormat === "image/webp" ? "webp" : "png";
    link.download = `${imgName}-nexakit.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic light/dark checkerboard to visualize transparency
  const checkerboardStyle = isDark ? {
    backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  } : {
    backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">PNG & Image Studio</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert image formats, resize dimensions, and magically remove background colors.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">Upload Image (PNG, JPG, WebP)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-sky-400 hover:file:bg-blue-100 transition-colors" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Make Color Transparent</h3>
            <div className="flex items-center gap-4 mb-3">
              <input type="color" value={targetColor} onChange={(e) => setTargetColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0" title="Pick color to remove" />
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Color Tolerance: {tolerance}%</label>
                <input type="range" min="0" max="100" value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <button onClick={() => applyImageProcess("transparent")} disabled={!imgSrc} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-800 dark:text-white font-bold py-2 rounded-lg text-sm transition-colors">
              Remove Background Color
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Width (px)</label>
              <input type="number" value={imgWidth || ""} onChange={(e) => setImgWidth(Number(e.target.value))} placeholder="Auto" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Height (px)</label>
              <input type="number" value={imgHeight || ""} onChange={(e) => setImgHeight(Number(e.target.value))} placeholder="Auto" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
          </div>
          
          <button onClick={() => applyImageProcess("resize")} disabled={!imgSrc} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-800 dark:text-white font-bold py-2 rounded-lg text-sm transition-colors">
            Apply Resize & Reset
          </button>

        </div>

        {/* Right Column: Preview & Output */}
        <div className="flex flex-col gap-4">
          <label className="block text-xs font-bold dark:text-slate-300">Output Preview</label>
          <div className="flex-1 min-h-[250px] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden relative" style={checkerboardStyle}>
            {processedImg ? (
              <img src={processedImg} alt="Processed Preview" className="max-w-full max-h-[350px] object-contain relative z-10 shadow-xl" />
            ) : (
              <span className="text-sm font-semibold text-slate-400 bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg relative z-10">Image preview will appear here</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white flex-1">
              <option value="image/png">Save as PNG</option>
              <option value="image/jpeg">Save as JPG</option>
              <option value="image/webp">Save as WebP</option>
            </select>
            <button onClick={downloadProcessedImage} disabled={!processedImg} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for mathematical pixel processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}