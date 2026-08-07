"use client";

import { useState } from "react";

export default function DevTools({ activeTool }: { activeTool: string }) {
  // If a dev tool isn't active, don't render anything or run logic
  if (!["json-formatter", "base64", "password-gen", "qr-maker"].includes(activeTool)) {
    return null;
  }

  // ... rest of the code

  // ==========================================
  // 1. JSON FORMATTER & MINIFY STATE
  // ==========================================
  const [jsonInput, setJsonInput] = useState('{"name": "NexaKit", "status": "active", "tools": 29}');
  const [jsonOutput, setJsonOutput] = useState("");
  
  const formatJson = (space: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, space));
    } catch (e: any) {
      setJsonOutput("Invalid JSON: " + e.message);
    }
  };

  // ==========================================
  // 2. BASE64 ENCODER / DECODER STATE
  // ==========================================
  const [b64Input, setB64Input] = useState("Hello World");
  const [b64Output, setB64Output] = useState("");
  
  const processBase64 = (mode: "encode" | "decode") => {
    try {
      setB64Output(mode === "encode" ? btoa(b64Input) : atob(b64Input));
    } catch {
      setB64Output("Error: Invalid string for base64 operation.");
    }
  };

  // ==========================================
  // 3. KEY & PASSWORD GENERATOR STATE
  // ==========================================
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdUpper, setPwdUpper] = useState(true);
  const [pwdLower, setPwdLower] = useState(true);
  const [pwdNum, setPwdNum] = useState(true);
  const [pwdSym, setPwdSym] = useState(true);
  const [pwdOutput, setPwdOutput] = useState("");

  const generatePassword = () => {
    let charset = "";
    if (pwdUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (pwdNum) charset += "0123456789";
    if (pwdSym) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!charset) return setPwdOutput("Select at least 1 set");
    let res = "";
    for (let i = 0; i < pwdLength; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    setPwdOutput(res);
  };

  // ==========================================
  // 4. QR CODE MAKER STATE
  // ==========================================
  const [qrText, setQrText] = useState("https://example.com");
  const [qrSrc, setQrSrc] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com");
  const [qrDownloading, setQrDownloading] = useState(false);

  const downloadQRCode = async () => {
    setQrDownloading(true);
    try {
      const response = await fetch(qrSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "NexaKit-QRCode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const link = document.createElement("a");
      link.href = qrSrc;
      link.download = "NexaKit-QRCode.png";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setQrDownloading(false);
    }
  };

  return (
    <>
      {activeTool === "json-formatter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">JSON Formatter & Minifier</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Format, prettify, or minify your raw JSON data.</p>
          
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Raw JSON Input</label>
          <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="w-full h-40 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-mono text-sm mb-4 dark:text-white" />
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={() => formatJson(2)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Prettify JSON</button>
            <button onClick={() => formatJson(0)} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg">Minify JSON</button>
          </div>

          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Processed Output</label>
          <textarea readOnly value={jsonOutput} placeholder="Formatted JSON will appear here..." className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg font-mono text-sm dark:text-white" />
        </div>
      )}

      {activeTool === "base64" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Base64 Encoder / Decoder</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Encode raw strings into Base64 or decode Base64 back into readable text.</p>
          
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input String</label>
          <textarea value={b64Input} onChange={(e) => setB64Input(e.target.value)} className="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={() => processBase64("encode")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg">Encode to Base64</button>
            <button onClick={() => processBase64("decode")} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-lg">Decode from Base64</button>
          </div>

          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Output</label>
          <textarea readOnly value={b64Output} className="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg font-mono break-all dark:text-white" />
        </div>
      )}

      {activeTool === "password-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Key & Password Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate secure, randomized passwords or API keys with custom requirements.</p>
          <div className="mb-4"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Length: {pwdLength}</label><input type="range" min="6" max="64" value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))} className="w-full" /></div>
          <button onClick={generatePassword} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-4">Generate Key</button>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono break-all dark:text-white">{pwdOutput || "Click Generate"}</div>
        </div>
      )}

      {activeTool === "qr-maker" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">QR Code Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly generate a scannable QR code from any URL or text input.</p>
          
          <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
            <button onClick={() => setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
              Generate QR Code
            </button>
            <button onClick={downloadQRCode} disabled={qrDownloading} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              {qrDownloading ? "Downloading..." : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PNG
                </>
              )}
            </button>
          </div>
          
          <div className="flex justify-center"><img src={qrSrc} alt="QR Code" className="p-3 border border-slate-200 dark:border-slate-700 bg-white rounded-lg max-w-full h-auto" crossOrigin="anonymous" /></div>
        </div>
      )}
    </>
  );
}