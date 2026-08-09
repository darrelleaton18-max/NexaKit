"use client";

import ImageTools from "./MediaTools/ImageStudio";
import JpgTools from "./MediaTools/JpegOptimizer";
import GifTools from "./MediaTools/GifConverter";
import PdfStudio from "./MediaTools/PdfStudio";

interface MediaToolsProps {
  activeTool: string;
  isDark: boolean;
}

export default function MediaTools({ activeTool, isDark }: MediaToolsProps) {
  return (
    <>
      {/* @ts-ignore */}
      {activeTool === "image-tools" && <ImageTools />}
      {/* @ts-ignore */}
      {activeTool === "jpg-tools" && <JpgTools />}
      {/* @ts-ignore */}
      {activeTool === "gif-tools" && <GifTools />}
      
      {activeTool === "pdf-studio" && <PdfStudio />}
    </>
  );
}