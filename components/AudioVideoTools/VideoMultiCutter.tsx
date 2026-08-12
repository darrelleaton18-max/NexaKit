"use client";

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type CutRegion = {
  id: string;
  startTime: number | string;
  endTime: number | string;
};

export default function VideoMultiCutter({ activeTool }: { activeTool?: string }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [cuts, setCuts] = useState<CutRegion[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // FFmpeg State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement>(null);

  // Load FFmpeg core on mount
  useEffect(() => {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = ffmpegRef.current;
      
      ffmpeg.on("log", ({ message }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
      });

      ffmpeg.on("progress", ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      // Load via unpkg blobs to avoid CORS issues
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsLoaded(true);
    };

    if (!isLoaded && (!activeTool || activeTool === "video-crop")) {
      load();
    }
  }, [isLoaded, activeTool]);

  if (activeTool && activeTool !== "video-crop") return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setCuts([]);
      setOutputUrl(""); // Reset previous outputs
      setProgress(0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const addCut = () => {
    setCuts((prev) => [
      ...prev,
      { id: Date.now().toString(), startTime: 0, endTime: duration > 10 ? 10 : duration },
    ]);
  };

  const removeCut = (id: string) => {
    setCuts((prev) => prev.filter((cut) => cut.id !== id));
  };

  const updateCut = (id: string, field: "startTime" | "endTime", value: string) => {
    setCuts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const grabTimeFromVideo = (id: string, field: "startTime" | "endTime") => {
    if (videoRef.current) {
      const currentTime = Number(videoRef.current.currentTime.toFixed(2));
      setCuts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: currentTime } : c)));
    }
  };

  // The rendering engine
  const processVideo = async () => {
    if (!isLoaded || !videoFile || cuts.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setOutputUrl("");

    const validCuts = cuts
      .map(c => ({ start: Number(c.startTime), end: Number(c.endTime) }))
      .filter(c => !isNaN(c.start) && !isNaN(c.end) && c.start < c.end)
      .sort((a, b) => a.start - b.start);

    const keepRegions: { start: number; end: number }[] = [];
    let currentStart = 0;

    for (const cut of validCuts) {
      if (cut.start > currentStart) keepRegions.push({ start: currentStart, end: cut.start });
      currentStart = Math.max(currentStart, cut.end);
    }
    if (currentStart < duration) keepRegions.push({ start: currentStart, end: duration });

    if (keepRegions.length === 0) {
      alert("Error: The entire video has been cut out!");
      setIsProcessing(false);
      return;
    }

    const ffmpeg = ffmpegRef.current;
    
    // 1. Write file to WebAssembly Memory
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    // 2. Build the complex filter string
    let filterString = "";
    let concatString = "";

    keepRegions.forEach((region, index) => {
      filterString += `[0:v]trim=${region.start.toFixed(2)}:${region.end.toFixed(2)},setpts=PTS-STARTPTS[v${index}]; `;
      filterString += `[0:a]atrim=${region.start.toFixed(2)}:${region.end.toFixed(2)},asetpts=PTS-STARTPTS[a${index}]; `;
      concatString += `[v${index}][a${index}]`;
    });

    filterString += `${concatString}concat=n=${keepRegions.length}:v=1:a=1[outv][outa]`;

    // 3. Execute the strict FFmpeg cut & concatenate command
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-filter_complex", filterString,
      "-map", "[outv]",
      "-map", "[outa]",
      "output.mp4"
    ]);

    // 4. Read the processed file and create a download URL
    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
    
    setOutputUrl(url);
    setIsProcessing(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
          Advanced Video Multi-Cutter
          {!isLoaded ? (
            <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full font-bold animate-pulse">
              Loading Core...
            </span>
          ) : (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
              Engine Ready
            </span>
          )}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
          Remove multiple segments from the middle of a video. Processing happens entirely locally in your browser.
        </p>
      </div>

      {!videoUrl ? (
        <div className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-[#121212]">
          <svg className="w-10 h-10 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Upload a Video</p>
          <label className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl cursor-pointer transition shadow-md shadow-orange-500/20">
            Select File
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* LEFT: Video Preview */}
          <div className="flex flex-col gap-4">
            <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800">
              <video ref={videoRef} src={videoUrl} controls className="w-full h-auto max-h-[450px] object-contain" onLoadedMetadata={handleLoadedMetadata} />
            </div>
            <button
              onClick={() => {
                setVideoUrl("");
                setVideoFile(null);
                setCuts([]);
                setOutputUrl("");
              }}
              className="text-xs font-bold text-neutral-500 hover:text-red-500 transition self-start"
            >
              ← Choose different video
            </button>
          </div>

          {/* RIGHT: Controls & Rendering */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-neutral-900 dark:text-white">Segments to Remove</h3>
                  <p className="text-[10px] text-neutral-500 mt-1">Pause video and click 📍 to grab exact times.</p>
                </div>
                <button onClick={addCut} disabled={isProcessing} className="px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold hover:bg-orange-500/20 transition disabled:opacity-50">
                  + Add Cut
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {cuts.length === 0 ? (
                  <div className="text-xs text-neutral-400 italic text-center py-6 bg-neutral-50 dark:bg-black/30 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                    No cuts added. The full video will be kept.
                  </div>
                ) : (
                  cuts.map((cut) => {
                    const isError = Number(cut.startTime) >= Number(cut.endTime);
                    return (
                      <div key={cut.id} className={`flex flex-col gap-2 bg-neutral-50 dark:bg-black/30 p-4 rounded-2xl border ${isError ? 'border-red-500/50' : 'border-neutral-100 dark:border-neutral-800/60'}`}>
                        <div className="flex items-start gap-4">
                          <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-between">
                              Start (s)
                              <button onClick={() => grabTimeFromVideo(cut.id, "startTime")} className="text-orange-500 font-extrabold text-[10px]">📍 Grab</button>
                            </label>
                            <input type="number" min="0" max={duration} step="0.1" value={cut.startTime} onChange={(e) => updateCut(cut.id, "startTime", e.target.value)} disabled={isProcessing} className="w-full bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none" />
                          </div>
                          <span className="text-neutral-300 font-bold mt-7">→</span>
                          <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-between">
                              End (s)
                              <button onClick={() => grabTimeFromVideo(cut.id, "endTime")} className="text-orange-500 font-extrabold text-[10px]">📍 Grab</button>
                            </label>
                            <input type="number" min="0" max={duration} step="0.1" value={cut.endTime} onChange={(e) => updateCut(cut.id, "endTime", e.target.value)} disabled={isProcessing} className="w-full bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none" />
                          </div>
                          <button onClick={() => removeCut(cut.id)} disabled={isProcessing} className="text-neutral-400 hover:text-red-500 mt-7 ml-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-800 flex flex-col gap-4">
              
              {!outputUrl ? (
                <>
                  <button
                    onClick={processVideo}
                    disabled={!isLoaded || cuts.length === 0 || isProcessing}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "Processing Video..." : "Render Final Video"}
                  </button>

                  {isProcessing && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] font-bold text-neutral-400">
                        <span>Rendering...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                      <p ref={messageRef} className="text-[9px] font-mono text-neutral-600 truncate mt-1"></p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-white font-bold">Video Successfully Processed!</h4>
                  <a
                    href={outputUrl}
                    download={`NexaKit_Edited_${videoFile?.name || "video.mp4"}`}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition text-center shadow-lg shadow-emerald-900/50"
                  >
                    Download Edited Video
                  </a>
                  <button onClick={() => setOutputUrl("")} className="text-xs font-bold text-neutral-500 hover:text-white transition mt-2">
                    Start over with same video
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}