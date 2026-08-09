"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfStudio() {
  const [activeTab, setActiveTab] = useState("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.type === "application/pdf");
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  // Remove a file from the list
  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // CORE LOGIC: Merge PDFs instantly in the browser
  const handleMerge = async () => {
    if (files.length < 2) return alert("Please upload at least 2 PDFs to merge.");
    setIsProcessing(true);

    try {
      // 1. Create a new empty PDF
      const mergedPdf = await PDFDocument.create();

      // 2. Loop through all uploaded files
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // 3. Copy all pages from the current file into the new PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 4. Save and trigger download
      const mergedPdfBytes = await mergedPdf.save();
      // Add "as any" to bypass the strict type warning
    const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `NexaKit_Merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging the files. Please ensure they are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[600px]">
      
      {/* STUDIO SIDEBAR */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">PDF Studio</h2>
        
        <button 
          onClick={() => setActiveTab("merge")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "merge" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
          Merge PDFs
        </button>
        
        {/* Placeholder for future tools */}
        <button disabled className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
          Split PDF (Coming Soon)
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Merge PDF Files</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Combine multiple PDFs into a single document instantly. 100% private, files never leave your browser.</p>
        </div>

        {/* DROPZONE */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all mb-6 group"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <span className="text-base font-bold text-slate-700 dark:text-slate-200">Click or drag PDF files here</span>
          <span className="text-xs text-slate-400 mt-2">Max file size: Unlimited (Client-side)</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            multiple 
            className="hidden" 
          />
        </div>

        {/* FILE LIST */}
        {files.length > 0 && (
          <div className="flex flex-col gap-3 mb-6 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Files to Merge ({files.length})</h4>
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 truncate pr-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACTION BUTTON */}
        <div className="mt-auto flex justify-end">
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              files.length >= 2 && !isProcessing
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : (
              "Merge PDFs Now"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}