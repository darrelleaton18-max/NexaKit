"use client";

import ImageStudio from "./MediaTools/ImageStudio";
import JpegOptimizer from "./MediaTools/JpegOptimizer";
import GifConverter from "./MediaTools/GifConverter";

export default function MediaTools({ activeTool, isDark }: { activeTool: string, isDark: boolean }) {
  return (
    <>
      <ImageStudio activeTool={activeTool} isDark={isDark} />
      <JpegOptimizer activeTool={activeTool} isDark={isDark} />
      <GifConverter activeTool={activeTool} isDark={isDark} />
    </>
  );
}