"use client";

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function VideoToGif() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the single-threaded FFmpeg core on mount
  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
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
      setVideoFile(file);
      setGifUrl(null); 
      setProgress(0);
    }
  };

  const convertToGif = async () => {
    if (!videoFile || !isLoaded) return;
    
    setIsProcessing(true);
    const ffmpeg = ffmpegRef.current;

    try {
      // Write the video file to FFmpeg's virtual memory
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

      // Run the conversion command
      // -t 5 limits the GIF to the first 5 seconds to prevent browser memory crashes on large files
      // -vf applies a high-quality lanczos scaling and sets fps to 10
      await ffmpeg.exec([
        "-i", "input.mp4", 
        "-t", "5", 
        "-vf", "fps=10,scale=480:-1:flags=lanczos", 
        "-c:v", "gif", 
        "output.gif"
      ]);

      // Read the result back
      const fileData = await ffmpeg.readFile("output.gif");
      
      // Create a downloadable URL (cast to any to bypass strict TS rules)
      const url = URL.createObjectURL(new Blob([fileData as any], { type: "image/gif" }));
      setGifUrl(url);
      setGifUrl(url);
    } catch (error) {
      console.error("Error creating GIF:", error);
      alert("An error occurred during GIF conversion. Try a shorter or smaller video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Video to GIF</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Convert the first 5 seconds of any video into an optimized, looping GIF. Processed 100% locally.</p>
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
            accept="video/*" 
            className="hidden" 
            disabled={isProcessing}
          />
          
          <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:shadow-orange-500/20 transition-all">
            <svg className={`w-8 h-8 transition-colors ${videoFile ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-2">
            {videoFile ? videoFile.name : "Select Video File"}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB` : "Click to browse your files"}
          </p>
        </div>
      )}

      {videoFile && !gifUrl && (
        <div className="flex flex-col gap-4">
          <button 
            onClick={convertToGif} 
            disabled={isProcessing}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex justify-center items-center gap-2"
          >
            {isProcessing ? "Converting to GIF..." : "Generate GIF Now"}
          </button>
          
          {isProcessing && (
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
              <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}

      {gifUrl && (
        <div className="bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">GIF Created Successfully!</h3>
          
          <img src={gifUrl} alt="Converted GIF" className="w-full max-w-md rounded-xl shadow-lg mb-6 border border-neutral-200 dark:border-neutral-800" />
          
          <a 
            href={gifUrl} 
            download={`converted_${videoFile?.name.replace(/\.[^/.]+$/, "")}.gif`}
            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Download GIF
          </a>
        </div>
      )}
    </div>
  );
}