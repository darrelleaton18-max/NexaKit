"use client";

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const FORMATS = ["mp4", "webm", "mp3", "wav"];

export default function FormatConverter() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("mp4");
  
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.max(0, Math.min(100, Math.round(progress * 100))));
      });

      await ffmpeg.load({
        coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
        wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
      });
      setIsLoaded(true);
    };

    loadFFmpeg();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setOutputUrl(null); 
      setProgress(0);
    }
  };

  const getMimeType = (ext: string) => {
    if (ext === 'mp4') return 'video/mp4';
    if (ext === 'webm') return 'video/webm';
    if (ext === 'mp3') return 'audio/mp3';
    if (ext === 'wav') return 'audio/wav';
    return 'application/octet-stream';
  };

  const convertMedia = async () => {
    if (!mediaFile || !isLoaded) return;
    
    setIsProcessing(true);
    const ffmpeg = ffmpegRef.current;

    try {
      const originalExt = mediaFile.name.split('.').pop() || 'tmp';
      const inputName = `input.${originalExt}`;
      const outputName = `output.${targetFormat}`;

      // Write input file to virtual memory
      await ffmpeg.writeFile(inputName, await fetchFile(mediaFile));

      // FFmpeg automatically determines the best codec based on the output extension
      await ffmpeg.exec(["-i", inputName, outputName]);

      // Read output and create download URL (casting to any to bypass strict TS)
      const fileData = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([fileData as any], { type: getMimeType(targetFormat) }));
      
      setOutputUrl(url);
    } catch (error) {
      console.error("Error converting format:", error);
      alert("An error occurred during conversion. The file format might not be supported.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Format Converter</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Convert media files between MP4, WebM, MP3, and WAV entirely in your browser.</p>
      </div>

      {!isLoaded ? (
        <div className="w-full py-16 flex flex-col items-center justify-center bg-neutral-50 dark:bg-black/20 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
           <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></span>
           <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Booting Media Engine...</p>
        </div>
      ) : (
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center transition-all ${isProcessing ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 opacity-75 cursor-wait' : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500/50 bg-neutral-50 dark:bg-black/20 cursor-pointer group'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/*,audio/*" 
            className="hidden" 
            disabled={isProcessing}
          />
          
          <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-orange-500/20 transition-all">
            <svg className={`w-8 h-8 transition-colors ${mediaFile ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">
            {mediaFile ? mediaFile.name : "Select Media File"}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {mediaFile ? `${(mediaFile.size / (1024 * 1024)).toFixed(2)} MB` : "Click to browse video or audio files"}
          </p>
        </div>
      )}

      {mediaFile && !outputUrl && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8">
             <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Target Format</h3>
             <div className="flex flex-wrap gap-3">
               {FORMATS.map(ext => (
                 <button 
                   key={ext} 
                   onClick={() => setTargetFormat(ext)}
                   className={`px-6 py-2.5 rounded-xl border font-bold uppercase transition-all ${
                     targetFormat === ext 
                       ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20' 
                       : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500'
                   }`}
                 >
                   {ext}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={convertMedia} 
              disabled={isProcessing}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex justify-center items-center gap-2"
            >
              {isProcessing ? `Converting to ${targetFormat.toUpperCase()}...` : `Convert to ${targetFormat.toUpperCase()}`}
            </button>
            
            {isProcessing && (
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </div>
        </div>
      )}

      {outputUrl && (
        <div className="bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Conversion Complete!</h3>
          
          {['mp4', 'webm'].includes(targetFormat) ? (
             <video src={outputUrl} controls className="w-full max-w-md rounded-xl shadow-lg mb-6 border border-neutral-200 dark:border-neutral-800" />
          ) : (
             <audio src={outputUrl} controls className="w-full max-w-md mb-6" />
          )}
          
          <a 
            href={outputUrl} 
            download={`converted_${mediaFile?.name.replace(/\.[^/.]+$/, "")}.${targetFormat}`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download {targetFormat.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}