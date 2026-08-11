"use client";

import React from "react";
import { navGroups } from "./navData";
// If you have your PdfStudio file in a subfolder, import it here:
// import PdfStudio from "./MediaTools/PdfStudio"; 

export default function DocumentTools({ activeTool }: { activeTool: string }) {
  
  // SAFETY CHECK: Does this tool actually belong to the Documents category?
  const isDocumentTool = navGroups.find(g => g.group === "Documents")?.tools.some(t => t.id === activeTool);

  // If it's not a Document tool, return null so it stays hidden
  if (!isDocumentTool) return null;

  switch (activeTool) {
    case "pdf-studio":
      // return <PdfStudio />; // Uncomment this when your component is ready!
      
      // Temporary fallback until you link your custom component
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white">PDF Studio</h2>
            <p className="text-neutral-500">PDF processing tools are being connected...</p>
        </div>
      );

    default:
      return (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-[#131313] border border-neutral-200 dark:border-white/5 rounded-[32px] animate-in fade-in">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-neutral-100 dark:bg-black/40 text-orange-500 flex items-center justify-center shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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