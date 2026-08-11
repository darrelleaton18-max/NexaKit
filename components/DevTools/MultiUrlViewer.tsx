"use client";

import React, { useState } from "react";

type UrlItem = {
  id: string;
  url: string;
  title: string;
};

// Define our device viewport presets
const VIEWPORT_PRESETS = [
  { label: "Fluid", width: "100%" },
  { label: "iPhone SE", width: "320px" },
  { label: "iPhone 15", width: "393px" },
  { label: "iPad", width: "768px" },
  { label: "iPad Pro", width: "1024px" },
];

export default function MultiUrlViewer({ activeTool }: { activeTool: string }) {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [gridCols, setGridCols] = useState<number>(2);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [presetWidth, setPresetWidth] = useState<string>("100%");
  const [frameHeight, setFrameHeight] = useState<number>(550); // New: Global height control

  if (activeTool !== "multi-url-viewer") return null;

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let formattedUrl = newUrl.trim();

    // SMART CONVERSION FOR YOUTUBE
    if (formattedUrl.includes("youtube.com/watch?v=")) {
      const videoId = formattedUrl.split("v=")[1]?.split("&")[0];
      if (videoId) formattedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (formattedUrl.includes("youtu.be/")) {
      const videoId = formattedUrl.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) formattedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    } 
    // CLEAN GOOGLE SITES URLs
    else if (formattedUrl.includes("sites.google.com")) {
      formattedUrl = formattedUrl.split("?")[0];
    } 
    else if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    setUrls((prev) => [
      ...prev,
      { id: Date.now().toString(), url: formattedUrl, title: `Frame ${prev.length + 1}` },
    ]);
    setNewUrl("");
  };

  const handleRemoveUrl = (id: string) => {
    setUrls((prev) => prev.filter((item) => item.id !== id));
  };

  const gridClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`w-full flex flex-col gap-6 animate-in fade-in duration-300 ${isFullScreen ? "fixed inset-0 z-[300] bg-neutral-950 p-4 md:p-6 overflow-y-auto" : ""}`}>
      
      {/* TOOL HEADER & CONTROLS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            Multi-URL Responsive Canvas
            {isFullScreen && (
              <span className="text-xs bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-bold">
                Focus Mode Active
              </span>
            )}
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Compare and interact with multiple pages side-by-side. You can drag the bottom-right corner of any frame to resize it.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* GLOBAL HEIGHT SLIDER */}
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/5 rounded-2xl px-3 py-1.5 text-xs font-bold">
            <span className="text-neutral-400">Height:</span>
            <input 
              type="range" 
              min="300" 
              max="1000" 
              step="50"
              value={frameHeight}
              onChange={(e) => setFrameHeight(Number(e.target.value))}
              className="w-20 accent-orange-500"
            />
          </div>

          {/* GRID COLUMNS SELECTOR */}
          <div className="flex items-center bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/5 rounded-2xl p-1 text-xs font-bold">
            <span className="px-2 text-neutral-400">Layout:</span>
            <button onClick={() => setGridCols(1)} className={`px-2 py-1.5 rounded-xl transition ${gridCols === 1 ? "bg-orange-500 text-white shadow-sm" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`} title="1 Column (e.g. 1x4)">1 Col</button>
            <button onClick={() => setGridCols(2)} className={`px-2 py-1.5 rounded-xl transition ${gridCols === 2 ? "bg-orange-500 text-white shadow-sm" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`} title="2 Columns (e.g. 2x2)">2 Cols</button>
            <button onClick={() => setGridCols(3)} className={`px-2 py-1.5 rounded-xl transition ${gridCols === 3 ? "bg-orange-500 text-white shadow-sm" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`} title="3 Columns">3 Cols</button>
            <button onClick={() => setGridCols(4)} className={`px-2 py-1.5 rounded-xl transition ${gridCols === 4 ? "bg-orange-500 text-white shadow-sm" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`} title="4 Columns (e.g. 4x1)">4 Cols</button>
          </div>

          {/* DYNAMIC VIEWPORT PRESETS */}
          <div className="flex flex-wrap items-center bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/5 rounded-2xl p-1 text-xs font-bold">
            {VIEWPORT_PRESETS.map((vp) => (
              <button
                key={vp.label}
                onClick={() => setPresetWidth(vp.width)}
                title={vp.width !== "100%" ? `${vp.width} width` : "Responsive Full Width"}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  presetWidth === vp.width
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {vp.label}
              </button>
            ))}
          </div>

          {/* FULL SCREEN TOGGLE */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shadow-sm ${
              isFullScreen
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={isFullScreen ? "M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"} />
            </svg>
            {isFullScreen ? "Exit Focus Mode" : "Focus Mode"}
          </button>
        </div>
      </div>

      {/* URL INPUT BAR */}
      <form onSubmit={handleAddUrl} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter website URL (e.g., localhost:3000, youtube.com/watch?v=...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-orange-500 transition shadow-inner"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-orange-500/20 shrink-0"
        >
          + Add Frame
        </button>
      </form>

      {/* SECURITY NOTICE */}
      <div className="text-[11px] text-neutral-400 dark:text-neutral-500 px-2 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Note: External sites with strict iframe protection headers (like Google or X) will block embedding.</span>
      </div>

      {/* THE IFRAME GRID */}
      <div className={`grid ${gridClassMap[gridCols]} gap-6 w-full items-start`}>
        {urls.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl transition-all mx-auto w-full resize-y overflow-hidden"
            style={{ 
              maxWidth: presetWidth === "100%" ? "100%" : presetWidth,
              height: `${frameHeight}px`,
              minHeight: "250px"
            }}
          >
            {/* FRAME HEADER BAR */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 gap-2 shrink-0">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]" title={item.url}>
                {item.url}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-neutral-500 hover:text-orange-500 transition px-2 py-1 rounded-lg bg-neutral-200/50 dark:bg-black/40"
                >
                  Open ↗
                </a>
                <button
                  onClick={() => handleRemoveUrl(item.id)}
                  className="text-neutral-400 hover:text-red-500 transition p-1"
                  title="Remove Frame"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* IFRAME VIEWPORT WITH FALLBACK WARNING */}
            <div className="relative w-full flex-1 bg-neutral-50 dark:bg-black/40 flex flex-col items-center justify-center">
              <iframe
                src={item.url}
                title={item.title}
                className="w-full h-full border-0 absolute inset-0 z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
              
              {/* Fallback layer shown underneath if the site blocks framing */}
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center">
                <svg className="w-10 h-10 text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Embedding Blocked</p>
                <p className="text-[11px] text-neutral-400 max-w-[240px] mb-4">The site has security headers that prevent it from loading inside a frame.</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/20"
                >
                  Open in New Tab ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {urls.length === 0 && (
        <div className="w-full py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl text-neutral-400 font-medium text-sm">
          No frames active. Enter a URL above to start building your grid!
        </div>
      )}
    </div>
  );
}