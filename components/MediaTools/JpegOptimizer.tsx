"use client";

import { useState, useRef } from "react";

export default function JpegOptimizer({ activeTool, isDark }: { activeTool: string, isDark: boolean }) {
  if (activeTool !== "jpg-tools") return null;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgName, setImgName] = useState("image");
  const [quality, setQuality] = useState(85);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("0 KB");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgName(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImgSrc(src);
      processJpg(src, 85, "#ffffff");
    };
    reader.readAsDataURL(file);
  };

  const processJpg = (source: string, qual: number, background: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", qual / 100);
      setPreviewUrl(dataUrl);

      const base64Len = dataUrl.split(',')[1]?.length || 0;
      const bytes = (base64Len * 3) / 4;
      setFileSize(bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`);
    };
    img.src = source;
  };

  const handleQualityChange = (newQual: number) => {
    setQuality(newQual);
    if (imgSrc) processJpg(imgSrc, newQual, bgColor);
  };

  const handleColorChange = (newColor: string) => {
    setBgColor(newColor);
    if (imgSrc) processJpg(imgSrc, quality, newColor);
  };

  const downloadJpg = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${imgName}-optimized.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkerboardStyle = {
    backgroundImage: isDark 
      ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
      : 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">JPEG Optimizer & Converter</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Compress JPEGs with fine-tuned quality control and manage background mattes for transparent images.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-neutral-300">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleUpload} className="w-full p-2 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-lg dark:text-white text-sm cursor-pointer" />
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 dark:text-neutral-300">JPEG Quality: {quality}%</label>
              <input type="range" min="1" max="100" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))} disabled={!imgSrc} className="w-full" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold dark:text-neutral-300">Background Matte Color</label>
                <span className="text-[11px] text-neutral-400 block">Replaces transparent pixels</span>
              </div>
              <input type="color" value={bgColor} onChange={(e) => handleColorChange(e.target.value)} disabled={!imgSrc} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
            </div>
          </div>

          <button onClick={downloadJpg} disabled={!previewUrl} className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            Download Optimized JPG ({fileSize})
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="block text-xs font-bold dark:text-neutral-300">Live Preview</label>
          <div className="flex-1 min-h-[250px] bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-center overflow-hidden relative" style={checkerboardStyle}>
            {previewUrl ? (
              <img src={previewUrl} alt="JPG Preview" className="max-w-full max-h-[350px] object-contain relative z-10 shadow-xl" />
            ) : (
              <span className="text-sm font-semibold text-neutral-400 bg-white/80 dark:bg-neutral-900/80 px-4 py-2 rounded-lg relative z-10">Upload an image to optimize</span>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}