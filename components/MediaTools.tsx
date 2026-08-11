"use client";

import React from "react";
import { navGroups } from "./navData";
import ImageCompressor from "./MediaTools/ImageCompressor";
import ImageResizer from "./MediaTools/ImageResizer";
import ImageConverter from "./MediaTools/ImageConverter";
import BackgroundRemover from "./MediaTools/BackgroundRemover";
import ImageCropper from "./MediaTools/ImageCropper";
import WatermarkImage from "./MediaTools/WatermarkImage";     // <-- Import

// A reusable, functional upload zone for all the new image tools
const ImageDropzone = ({ title = "Upload Image" }: { title?: string }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Temporary alert just to prove it works!
      alert(`You selected: ${file.name}. \n\nNext step: We need to build the processing logic for this tool!`);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500/50 rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center bg-neutral-50 dark:bg-black/20 transition-all cursor-pointer group"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-orange-500/20 transition-all">
        <svg className="w-8 h-8 text-neutral-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
      <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Drag & drop your file here, or click to browse</p>
      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-6 font-bold uppercase tracking-widest">Supports JPG, PNG, WEBP, GIF</p>
    </div>
  );
};

export default function MediaTools({ activeTool, isDark }: { activeTool: string, isDark?: boolean }) {
  
  // SAFETY CHECK: Does this tool actually belong to the Media category in navData?
  const isMediaTool = navGroups.find(g => g.group === "Media")?.tools.some(t => t.id === activeTool);

  // If it's not a Media tool, return null so it stays hidden
  if (!isMediaTool) return null;

  switch (activeTool) {
    
    case "image-compressor":
      return <ImageCompressor />;
    
    case "image-resizer":
      return <ImageResizer />;

    case "image-converter":
      return <ImageConverter />;

    case "background-remover":
      return <BackgroundRemover />;

    case "image-cropper":
      return <ImageCropper />;
    
    case "watermark-image":
      return <WatermarkImage />;

    case "image-resizer":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Resizer</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Resize dimensions of PNG, JPG, or WEBP images instantly.</p>
          </div>
          <ImageDropzone title="Upload Image to Resize" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Width (px)</label>
              <input type="number" placeholder="e.g. 1920" className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" />
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Height (px)</label>
              <input type="number" placeholder="e.g. 1080" className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" />
            </div>
          </div>
        </div>
      );

    case "image-converter":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Converter</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Convert images between JPG, PNG, WEBP, and GIF securely.</p>
          </div>
          <ImageDropzone title="Upload Image to Convert" />
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
             <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Convert To</h3>
             <div className="flex flex-wrap gap-3">
               {['JPG', 'PNG', 'WEBP', 'GIF'].map(ext => (
                 <button key={ext} className="px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 font-bold text-neutral-600 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500 transition-all focus:bg-orange-500 focus:text-white focus:border-orange-500">
                   {ext}
                 </button>
               ))}
             </div>
          </div>
        </div>
      );

    case "background-remover":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Background Remover</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Automatically isolate subjects and remove image backgrounds.</p>
          </div>
          <ImageDropzone title="Upload Image" />
          <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all opacity-50 cursor-not-allowed">
            Remove Background (Upload Required)
          </button>
        </div>
      );

    case "image-cropper":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Crop & Rotate</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Perfectly frame your photos or adjust rotation.</p>
          </div>
          <ImageDropzone title="Upload Image to Edit" />
        </div>
      );

    case "watermark-image":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Watermark Image</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Protect your images by overlaying text or logo watermarks.</p>
          </div>
          <ImageDropzone title="Upload Base Image" />
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
             <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Watermark Text</label>
             <input type="text" placeholder="e.g. © Omni Utility" className="w-full bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-xl px-4 py-3 text-neutral-900 dark:text-white outline-none focus:border-orange-500 transition-colors" />
          </div>
        </div>
      );

    case "color-picker":
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Image Color Picker</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Extract exact HEX and RGB color codes from any uploaded picture.</p>
          </div>
          <ImageDropzone title="Upload Image to Pick Colors" />
        </div>
      );

    default:
      return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-[#131313] border border-neutral-200 dark:border-white/5 rounded-[32px] animate-in fade-in">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-neutral-100 dark:bg-black/40 text-orange-500 flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
            Tool Under Construction
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            The <span className="font-bold text-orange-500">"{activeTool}"</span> utility is currently being built and will be available soon.
          </p>
        </div>
      );
  }
}