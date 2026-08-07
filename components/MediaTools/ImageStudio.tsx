"use client";

import { useState, useRef } from "react";

export default function ImageStudio({ activeTool, isDark }: { activeTool: string, isDark: boolean }) {
  if (activeTool !== "image-tools") return null;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgName, setImgName] = useState("image");
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);
  
  const [targetColor, setTargetColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(15);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  const [outputFormat, setOutputFormat] = useState("image/png");
  const [quality, setQuality] = useState(90);
  const [processedImg, setProcessedImg] = useState<string | null>(null);
  
  const [showBase64, setShowBase64] = useState(false);
  const [finalBase64, setFinalBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgName(file.name.split('.')[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImgSrc(src);
      setProcessedImg(src);
      setBrightness(100);
      setContrast(100);
      const img = new Image();
      img.onload = () => {
        setImgWidth(img.width);
        setImgHeight(img.height);
      }
      img.src = src;
    };
    reader.readAsDataURL(file);
    setShowBase64(false);
  };

  const resetImage = () => {
    setProcessedImg(imgSrc);
    setBrightness(100);
    setContrast(100);
    const img = new Image();
    img.onload = () => {
      setImgWidth(img.width);
      setImgHeight(img.height);
    };
    if (imgSrc) img.src = imgSrc;
    setShowBase64(false);
  };

  const applyEdit = (action: string) => {
    if (!processedImg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = action === "resize" ? (imgWidth || img.width) : img.width;
      canvas.height = action === "resize" ? (imgHeight || img.height) : img.height;

      if (action === "rotate") {
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (action === "flipH") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
      } else if (action === "flipV") {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0);
      } else {
        let filterStr = `brightness(${brightness}%) contrast(${contrast}%)`;
        if (action === "grayscale") filterStr += " grayscale(100%)";
        if (action === "invert") filterStr += " invert(100%)";
        if (action === "sepia") filterStr += " sepia(100%)";
        if (action === "blur") filterStr += " blur(4px)";
        
        ctx.filter = filterStr;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none"; 

        if (action === "transparent") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          const hex = targetColor.replace("#", "");
          const rT = parseInt(hex.substring(0, 2), 16);
          const gT = parseInt(hex.substring(2, 4), 16);
          const bT = parseInt(hex.substring(4, 6), 16);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const distance = Math.sqrt(Math.pow(r - rT, 2) + Math.pow(g - gT, 2) + Math.pow(b - bT, 2));
            if ((distance / 441.67) * 100 <= tolerance) {
              data[i + 3] = 0; 
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
      }

      setImgWidth(canvas.width);
      setImgHeight(canvas.height);
      setProcessedImg(canvas.toDataURL("image/png"));
      setShowBase64(false);
    };
    img.src = processedImg;
  };

  const generateFinalImage = (callback: (dataUrl: string) => void) => {
    if (!processedImg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (outputFormat === "image/jpeg") {
        ctx!.fillStyle = "#ffffff";
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx?.drawImage(img, 0, 0);
      callback(canvas.toDataURL(outputFormat, quality / 100));
    };
    img.src = processedImg;
  };

  const downloadProcessedImage = () => {
    generateFinalImage((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      const ext = outputFormat === "image/jpeg" ? "jpg" : outputFormat === "image/webp" ? "webp" : "png";
      link.download = `${imgName}-nexakit.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleShowBase64 = () => {
    if (showBase64) {
      setShowBase64(false);
    } else {
      setIsGenerating(true);
      generateFinalImage((dataUrl) => {
        setFinalBase64(dataUrl);
        setShowBase64(true);
        setIsGenerating(false);
      });
    }
  };

  const copyBase64 = () => {
    if (!finalBase64) return;
    navigator.clipboard.writeText(finalBase64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 dark:text-white">PNG & Image Studio</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Convert formats, compress, resize, filter, blur, and extract Base64 data instantly.</p>
        </div>
        {imgSrc && (
          <button onClick={resetImage} className="bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-red-200 dark:border-red-800/50 shrink-0">
            ↩️ Reset to Original
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">1. Upload Image (PNG, JPG, WebP)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-sky-400 hover:file:bg-blue-100 transition-colors" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Quick Adjustments & Effects</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => applyEdit("rotate")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">🔄 Rotate</button>
              <button onClick={() => applyEdit("flipH")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">↔️ Flip Horiz</button>
              <button onClick={() => applyEdit("flipV")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">↕️ Flip Vert</button>
              <button onClick={() => applyEdit("blur")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">💧 Blur</button>
              <button onClick={() => applyEdit("grayscale")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">🔲 Grayscale</button>
              <button onClick={() => applyEdit("sepia")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">🌗 Sepia</button>
              <button onClick={() => applyEdit("invert")} disabled={!processedImg} className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-2 rounded border border-slate-200 dark:border-slate-600 transition-colors">🔮 Invert</button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Exposure Tuning</h3>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Brightness: {brightness}%</label>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} onMouseUp={() => applyEdit("exposure")} className="w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Contrast: {contrast}%</label>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} onMouseUp={() => applyEdit("exposure")} className="w-full" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Remove Background Color</h3>
            <div className="flex items-center gap-4 mb-3">
              <input type="color" value={targetColor} onChange={(e) => setTargetColor(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0" title="Pick color to remove" />
              <div className="flex-1">
                <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Tolerance: {tolerance}%</label>
                <input type="range" min="0" max="100" value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <button onClick={() => applyEdit("transparent")} disabled={!processedImg} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-800 dark:text-white font-bold py-2 rounded-lg text-sm transition-colors">
              Make Color Transparent
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Resize Width (px)</label>
              <input type="number" value={imgWidth || ""} onChange={(e) => setImgWidth(Number(e.target.value))} placeholder="Auto" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Resize Height (px)</label>
              <input type="number" value={imgHeight || ""} onChange={(e) => setImgHeight(Number(e.target.value))} placeholder="Auto" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
          </div>
          <button onClick={() => applyEdit("resize")} disabled={!processedImg} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-slate-800 dark:text-white font-bold py-2 rounded-lg text-sm transition-colors">
            Apply New Dimensions
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold dark:text-slate-300">Output Preview</label>
            {imgWidth > 0 && imgHeight > 0 && (
              <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                {imgWidth} × {imgHeight} px
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[250px] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden relative" style={checkerboardStyle}>
            {processedImg ? (
              <img src={processedImg} alt="Processed Preview" className="max-w-full max-h-[350px] object-contain relative z-10 shadow-xl" />
            ) : (
              <span className="text-sm font-semibold text-slate-400 bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg relative z-10">Image preview will appear here</span>
            )}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1 dark:text-slate-300">Format</label>
                <select value={outputFormat} onChange={(e) => { setOutputFormat(e.target.value); setShowBase64(false); }} className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white">
                  <option value="image/png">Save as PNG</option>
                  <option value="image/jpeg">Save as JPG</option>
                  <option value="image/webp">Save as WebP</option>
                </select>
              </div>
              
              {(outputFormat === "image/jpeg" || outputFormat === "image/webp") && (
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1 dark:text-slate-300">Compression: {quality}%</label>
                  <input type="range" min="1" max="100" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setShowBase64(false); }} className="w-full mt-1" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleShowBase64} disabled={!processedImg || isGenerating} className="flex-1 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                {isGenerating ? "Processing..." : showBase64 ? "Hide Base64" : "Generate Base64"}
              </button>
              <button onClick={downloadProcessedImage} disabled={!processedImg} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
              </button>
            </div>
          </div>

          {showBase64 && finalBase64 && (
            <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold dark:text-slate-300">Final Data URL String</label>
                <button onClick={copyBase64} className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors">
                  {copied ? "✓ Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <textarea 
                readOnly 
                value={finalBase64} 
                onClick={(e) => (e.target as HTMLTextAreaElement).select()} 
                className="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-950 rounded-lg font-mono text-[10px] leading-tight dark:text-slate-400 break-all resize-y outline-none cursor-pointer shadow-inner" 
              />
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}