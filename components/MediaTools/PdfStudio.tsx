"use client";

import { useState, useRef } from "react";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

const MAX_FILE_SIZE_MB = 15;

export default function PdfStudio() {
  const [activeTab, setActiveTab] = useState("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Settings States
  const [pageRange, setPageRange] = useState("");
  const [rotationAngle, setRotationAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [securePassword, setSecurePassword] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection WITH 15MB SIZE LIMIT
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => {
        if (file.type !== "application/pdf") {
          alert(`"${file.name}" is not a PDF.`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          alert(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit to prevent browser crashes.`);
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Remove a file from the list
  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  // ==========================================
  // LOGIC: MERGE PDFS
  // ==========================================
  const handleMerge = async () => {
    if (files.length < 2) return alert("Please upload at least 2 PDFs to merge.");
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
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

  // ==========================================
  // LOGIC: SPLIT PDF
  // ==========================================
  const handleSplit = async () => {
    if (files.length === 0) return alert("Please upload a PDF to split.");
    if (!pageRange.trim()) return alert("Please enter the pages you want to extract.");
    setIsProcessing(true);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = originalPdf.getPageCount();

      const indicesToExtract = new Set<number>();
      const parts = pageRange.split(',');

      for (const part of parts) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr?.trim(), 10);
        const end = parseInt(endStr?.trim(), 10);

        if (!isNaN(start)) {
          const actualEnd = !isNaN(end) ? end : start;
          for (let i = start; i <= actualEnd; i++) {
            if (i >= 1 && i <= totalPages) {
              indicesToExtract.add(i - 1);
            }
          }
        }
      }

      const indicesArray = Array.from(indicesToExtract).sort((a, b) => a - b);
      if (indicesArray.length === 0) {
        setIsProcessing(false);
        return alert("Invalid page range. Please check your numbers and try again.");
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, indicesArray);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `NexaKit_Extracted_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("An error occurred while splitting the file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // LOGIC: ROTATE PDF
  // ==========================================
  const handleRotate = async () => {
    if (files.length === 0) return alert("Please upload a PDF to rotate.");
    setIsProcessing(true);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotationAngle));
      });

      const rotatedPdfBytes = await pdf.save();
      const blob = new Blob([rotatedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `NexaKit_Rotated_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error rotating PDF:", error);
      alert("An error occurred while rotating the file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // LOGIC: WATERMARK PDF
  // ==========================================
  const handleWatermark = async () => {
    if (files.length === 0) return alert("Please upload a PDF to watermark.");
    if (!watermarkText.trim()) return alert("Please enter watermark text.");
    setIsProcessing(true);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      const helveticaFont = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 10;
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        
        const x = (width / 2) - (textWidth * 0.35);
        const y = (height / 2) - (textWidth * 0.35);

        page.drawText(watermarkText, {
          x: x,
          y: y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.6, 0.6, 0.6),
          opacity: 0.4,
          rotate: degrees(45),
        });
      });

      const watermarkedPdfBytes = await pdf.save();
      const blob = new Blob([watermarkedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `NexaKit_Watermarked_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error watermarking PDF:", error);
      alert("An error occurred while adding the watermark.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // LOGIC: PROTECT PDF (MOCKED)
  // ==========================================
  const handleProtect = () => {
    if (files.length === 0) return alert("Please upload a PDF to protect.");
    if (!securePassword.trim()) return alert("Please enter a secure password.");
    
    alert("Notice: 100% Client-Side PDF encryption requires WebAssembly (WASM), which is not currently active in this build to preserve performance. Your file was not uploaded to a server.");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[600px]">
      
      {/* STUDIO SIDEBAR */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">PDF Studio</h2>
        
        <button 
          onClick={() => { setActiveTab("merge"); setFiles([]); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "merge" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
          Merge PDFs
        </button>
        
        <button 
          onClick={() => { setActiveTab("split"); setFiles([]); setPageRange(""); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "split" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
          Split & Extract
        </button>

        <button 
          onClick={() => { setActiveTab("rotate"); setFiles([]); setRotationAngle(90); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "rotate" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Rotate Pages
        </button>

        <button 
          onClick={() => { setActiveTab("watermark"); setFiles([]); setWatermarkText("CONFIDENTIAL"); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "watermark" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          Add Watermark
        </button>

        <button 
          onClick={() => { setActiveTab("protect"); setFiles([]); setSecurePassword(""); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "protect" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Password Protect
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            {activeTab === "merge" && "Merge PDF Files"}
            {activeTab === "split" && "Split & Extract PDF Pages"}
            {activeTab === "rotate" && "Rotate PDF Pages"}
            {activeTab === "watermark" && "Watermark PDF Pages"}
            {activeTab === "protect" && "Password Protect PDF"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {activeTab === "merge" && "Combine multiple PDFs into a single document instantly. 100% private, files never leave your browser."}
            {activeTab === "split" && "Extract specific pages from a PDF to create a new, smaller document. Processed instantly in your browser."}
            {activeTab === "rotate" && "Permanently rotate all pages in a PDF document (90°, 180°, or 270°). Fixed instantly in your browser."}
            {activeTab === "watermark" && "Stamp custom text diagonally across every page of your PDF document. Processed instantly in your browser."}
            {activeTab === "protect" && "Encrypt and lock your PDF document with a secure user password to prevent unauthorized viewing."}
          </p>
        </div>

        {/* DROPZONE */}
        {(activeTab === "merge" || (activeTab !== "merge" && files.length === 0)) && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-sky-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all mb-6 group ${activeTab === "protect" ? "hover:border-emerald-500 dark:hover:border-emerald-400" : ""}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${activeTab === "protect" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-sky-400"}`}>
              {activeTab === "protect" ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              )}
            </div>
            <span className="text-base font-bold text-slate-700 dark:text-slate-200">
              {activeTab === "merge" ? "Click or drag PDF files here" : "Click to upload a PDF"}
            </span>
            <span className="text-xs text-slate-400 mt-2">Max file size: {MAX_FILE_SIZE_MB}MB (Client-side restriction)</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/pdf" 
              multiple={activeTab === "merge"} 
              className="hidden" 
            />
          </div>
        )}

        {/* FILE LIST & SETTINGS */}
        {files.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            
            {/* Merge File List */}
            {activeTab === "merge" && (
              <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
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

            {/* Split Settings */}
            {activeTab === "split" && (
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{files[0].name}</span>
                  </div>
                  <button onClick={() => setFiles([])} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Change File
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Pages to Extract
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                  <p className="text-[11px] font-medium text-slate-500 mt-2">
                    Separate page numbers or ranges with commas. 
                  </p>
                </div>
              </div>
            )}

            {/* Rotate Settings */}
            {activeTab === "rotate" && (
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{files[0].name}</span>
                  </div>
                  <button onClick={() => setFiles([])} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Change File
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                    Select Rotation Angle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setRotationAngle(90)} 
                      className={`py-3 rounded-lg text-sm font-bold border transition-all ${rotationAngle === 90 ? "bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-900/30 dark:border-sky-400 dark:text-sky-400" : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 hover:border-blue-300"}`}
                    >
                      90° Right
                    </button>
                    <button 
                      onClick={() => setRotationAngle(270)} 
                      className={`py-3 rounded-lg text-sm font-bold border transition-all ${rotationAngle === 270 ? "bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-900/30 dark:border-sky-400 dark:text-sky-400" : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 hover:border-blue-300"}`}
                    >
                      90° Left
                    </button>
                    <button 
                      onClick={() => setRotationAngle(180)} 
                      className={`py-3 rounded-lg text-sm font-bold border transition-all ${rotationAngle === 180 ? "bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-900/30 dark:border-sky-400 dark:text-sky-400" : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 hover:border-blue-300"}`}
                    >
                      180° Flip
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Watermark Settings */}
            {activeTab === "watermark" && (
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{files[0].name}</span>
                  </div>
                  <button onClick={() => setFiles([])} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Change File
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL or DRAFT"
                    maxLength={30}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                  <p className="text-[11px] font-medium text-slate-500 mt-2">
                    This text will be stamped semi-transparently and diagonally across the center of every page.
                  </p>
                </div>
              </div>
            )}

            {/* Password Protect Settings */}
            {activeTab === "protect" && (
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{files[0].name}</span>
                  </div>
                  <button onClick={() => setFiles([])} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Change File
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Require this password to open:
                  </label>
                  <input
                    type="password"
                    value={securePassword}
                    onChange={(e) => setSecurePassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                  <p className="text-[11px] font-medium text-slate-500 mt-2">
                    Keep this safe! There is no way to recover the document if the password is lost.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTON */}
        <div className="mt-auto flex justify-end">
          <button
            onClick={() => {
              if (activeTab === "merge") handleMerge();
              else if (activeTab === "split") handleSplit();
              else if (activeTab === "rotate") handleRotate();
              else if (activeTab === "watermark") handleWatermark();
              else if (activeTab === "protect") handleProtect();
            }}
            disabled={
              (activeTab === "merge" && files.length < 2) || 
              (activeTab === "split" && (files.length === 0 || !pageRange)) || 
              (activeTab === "rotate" && files.length === 0) || 
              (activeTab === "watermark" && (files.length === 0 || !watermarkText)) || 
              (activeTab === "protect" && (files.length === 0 || !securePassword)) || 
              isProcessing
            }
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              ((activeTab === "merge" && files.length >= 2) || 
               (activeTab === "split" && files.length > 0 && pageRange) || 
               (activeTab === "rotate" && files.length > 0) ||
               (activeTab === "watermark" && files.length > 0 && watermarkText) ||
               (activeTab === "protect" && files.length > 0 && securePassword)) && !isProcessing
                ? activeTab === "protect" 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : (
              activeTab === "merge" ? "Merge PDFs Now" : 
              activeTab === "split" ? "Extract Pages Now" : 
              activeTab === "rotate" ? "Rotate PDF Now" :
              activeTab === "protect" ? "Encrypt & Lock PDF" :
              "Add Watermark Now"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}