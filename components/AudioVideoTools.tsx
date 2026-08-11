"use client";

import React from "react";
import AudioExtractor from "./AudioVideoTools/AudioExtractor";
import VideoToGif from "./AudioVideoTools/VideoToGif";
import MediaTrimmer from "./AudioVideoTools/MediaTrimmer";
import FormatConverter from "./AudioVideoTools/FormatConverter";
import VolumeBooster from "./AudioVideoTools/VolumeBooster"; // <-- Import the new tool
import { navGroups } from "./navData";

export default function AudioVideoTools({ activeTool, isDark }: { activeTool: string, isDark?: boolean }) {
  
  const isAudioVideoTool = navGroups.find(g => g.group === "Audio & Video")?.tools.some(t => t.id === activeTool);

  if (!isAudioVideoTool) return null;

  switch (activeTool) {
    case "audio-extractor":
      return <AudioExtractor />;

    case "video-to-gif":
      return <VideoToGif />;

    case "media-trimmer":
      return <MediaTrimmer />;

    case "format-converter":
      return <FormatConverter />;

    case "volume-booster": // <-- Add the new case
      return <VolumeBooster />;

    default:
      return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-[#131313] border border-neutral-200 dark:border-white/5 rounded-[32px] animate-in fade-in">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-neutral-100 dark:bg-black/40 text-orange-500 flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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