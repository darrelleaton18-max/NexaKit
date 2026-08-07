"use client";

import { useState, useRef } from "react";

export default function GifTools({ activeTool, isDark }: { activeTool: string, isDark: boolean }) {
  if (activeTool !== "gif-tools") return null;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgName, setImgName] = useState("image");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgName(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImgSrc(src);
      convertToGif(src);
    };
    reader.readAsDataURL(file);
  };

  const convertToGif = (source: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Export as a static GIF data URL supported by browsers
      const dataUrl = canvas.toDataURL("image/gif");
      setPreviewUrl(dataUrl);
    };
    img.src = source;
  };

  const downloadGif = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${imgName}-converted.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">GIF Converter & Creator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert any static graphic (PNG, JPG, WebP) into standard GIF format instantly.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">Upload Source Image</label>
            <input type="file" accept="image/*" onChange={handleUpload} className="w-full p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white text-sm cursor-pointer" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This tool encodes your image directly into the GIF file format using browser-native canvas rendering. Perfect for legacy web design assets and simple format conversions.
            </p>
          </div>

          <button onClick={downloadGif} disabled={!previewUrl} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            Download GIF File
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="block text-xs font-bold dark:text-slate-300">GIF Preview</label>
          <div className="flex-1 min-h-[250px] bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden p-4">
            {previewUrl ? (
              <img src={previewUrl} alt="GIF Preview" className="max-w-full max-h-[350px] object-contain shadow-xl" />
            ) : (
              <span className="text-sm font-semibold text-slate-400">Upload an image to convert to GIF</span>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}