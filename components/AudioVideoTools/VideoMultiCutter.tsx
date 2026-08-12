"use client";

import React, { useState, useRef } from "react";

type CutRegion = {
  id: string;
  startTime: number;
  endTime: number;
};

export default function VideoMultiCutter({ activeTool }: { activeTool: string }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [cuts, setCuts] = useState<CutRegion[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (activeTool !== "video-crop") return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setCuts([]);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
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

  const updateCut = (id: string, field: "startTime" | "endTime", value: number) => {
    setCuts((prev) =>
      prev.map((cut) => {
        if (cut.id === id) {
          const newCut = { ...cut, [field]: value };
          // Ensure start isn't greater than end
          if (field === "startTime" && newCut.startTime >= newCut.endTime) newCut.startTime = newCut.endTime - 0.1;
          if (field === "endTime" && newCut.endTime <= newCut.startTime) newCut.endTime = newCut.startTime + 0.1;
          return newCut;
        }
        return cut;
      })
    );
  };

  // Generate the complex FFmpeg command to cut and concatenate
  const generateFfmpegCommand = () => {
    if (!videoFile || cuts.length === 0) return "ffmpeg -i input.mp4 -c copy output.mp4";

    // 1. Sort cuts by start time
    const sortedCuts = [...cuts].sort((a, b) => a.startTime - b.startTime);

    // 2. Calculate the "Keep" regions
    const keepRegions: { start: number; end: number }[] = [];
    let currentStart = 0;

    for (const cut of sortedCuts) {
      if (cut.startTime > currentStart) {
        keepRegions.push({ start: currentStart, end: cut.startTime });
      }
      currentStart = Math.max(currentStart, cut.endTime);
    }
    if (currentStart < duration) {
      keepRegions.push({ start: currentStart, end: duration });
    }

    if (keepRegions.length === 0) return "Error: Entire video is cut out!";

    // 3. Build the complex filter string
    let filterString = "";
    let concatString = "";

    keepRegions.forEach((region, index) => {
      filterString += `[0:v]trim=${region.start.toFixed(2)}:${region.end.toFixed(2)},setpts=PTS-STARTPTS[v${index}]; `;
      filterString += `[0:a]atrim=${region.start.toFixed(2)}:${region.end.toFixed(2)},asetpts=PTS-STARTPTS[a${index}]; `;
      concatString += `[v${index}][a${index}]`;
    });

    filterString += `${concatString}concat=n=${keepRegions.length}:v=1:a=1[outv][outa]`;

    return `ffmpeg -i "${videoFile.name}" -filter_complex "${filterString}" -map "[outv]" -map "[outa]" output.mp4`;
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
          Advanced Video Multi-Cutter
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Remove multiple segments from the middle of a video and stitch the remaining parts back together.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Video Preview */}
          <div className="flex flex-col gap-4">
            <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-auto max-h-[400px] object-contain"
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>
            <button
              onClick={() => {
                setVideoUrl("");
                setVideoFile(null);
                setCuts([]);
              }}
              className="text-xs font-bold text-neutral-500 hover:text-red-500 transition self-start"
            >
              ← Choose different video
            </button>
          </div>

          {/* RIGHT: Controls */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-neutral-900 dark:text-white">Segments to Remove</h3>
                <button
                  onClick={addCut}
                  className="px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-xl text-xs font-bold hover:bg-orange-500/20 transition"
                >
                  + Add Cut
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {cuts.length === 0 ? (
                  <div className="text-xs text-neutral-400 italic text-center py-4 bg-neutral-50 dark:bg-black/30 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                    No cuts added. The full video will be kept.
                  </div>
                ) : (
                  cuts.map((cut, index) => (
                    <div key={cut.id} className="flex items-center gap-3 bg-neutral-50 dark:bg-black/30 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Start (s)</label>
                          <input
                            type="number"
                            min="0"
                            max={duration}
                            step="0.1"
                            value={cut.startTime}
                            onChange={(e) => updateCut(cut.id, "startTime", Number(e.target.value))}
                            className="w-20 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-orange-500"
                          />
                        </div>
                        <span className="text-neutral-400 mt-4">-</span>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">End (s)</label>
                          <input
                            type="number"
                            min="0"
                            max={duration}
                            step="0.1"
                            value={cut.endTime}
                            onChange={(e) => updateCut(cut.id, "endTime", Number(e.target.value))}
                            className="w-20 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                      <button onClick={() => removeCut(cut.id)} className="text-neutral-400 hover:text-red-500 transition mt-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FFMPEG Output Script */}
            <div className="bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-800 relative">
              <span className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                Generated Filter
              </span>
              <p className="text-xs text-neutral-400 mb-3 font-medium">
                To process this client-side via FFmpeg.wasm, or on your local terminal, run this exact command:
              </p>
              <div className="bg-black/50 p-4 rounded-2xl overflow-x-auto">
                <code className="text-xs text-emerald-400 font-mono whitespace-nowrap">
                  {generateFfmpegCommand()}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}