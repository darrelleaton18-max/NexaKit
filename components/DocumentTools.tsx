"use client";

import React from "react";
import { navGroups } from "./navData";

// 1. We uncomment the import and point it to the correct new folder
import PdfStudio from "./DocumentTools/PdfStudio"; 

export default function DocumentTools({ activeTool }: { activeTool: string }) {
  
  // SAFETY CHECK: Does this tool actually belong to the Documents category?
  const isDocumentTool = navGroups.find(g => g.group === "Documents")?.tools.some(t => t.id === activeTool);

  // If it's not a Document tool, return null so it stays hidden
  if (!isDocumentTool) return null;

  switch (activeTool) {
    case "pdf-studio":
      // 2. We remove the placeholder text and return the actual component!
      return <PdfStudio />;

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