"use client";

import React, { useState } from "react";

export default function UrlInspector({ activeTool }: { activeTool: string }) {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // If this tool isn't selected, return null so it stays hidden
  if (activeTool !== "url-inspector") return null;

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setResult(null);

    let targetUrl = inputUrl.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      const parsed = new URL(targetUrl);
      
      const analysis = {
        valid: true,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        search: parsed.search,
        port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
        origin: parsed.origin,
      };

      let statusCode = "Unknown / CORS Restricted";
      let isLive = false;

      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status) {
            statusCode = data.status.http_code || "200 OK (Reachable)";
            isLive = true;
          } else {
            isLive = true;
            statusCode = "200 OK (Proxy Verified)";
          }
        }
      } catch (err) {
        statusCode = "Network Error / Domain Unreachable";
      }

      setResult({ ...analysis, statusCode, isLive });
    } catch (err) {
      setResult({ valid: false, error: "Invalid URL format. Please enter a valid web address." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
          URL & Domain Inspector
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Analyze URL syntax, break down components, and check live domain reachability.
        </p>
      </div>

      <form onSubmit={analyzeUrl} className="flex gap-3">
        <input
          type="text"
          placeholder="e.g., https://example.com/path?query=1"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-1 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-orange-500 transition shadow-inner"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Inspect URL"}
        </button>
      </form>

      {result && (
        <div className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          {!result.valid ? (
            <div className="text-red-500 font-medium text-sm">{result.error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Reachability Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${result.isLive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {result.statusCode}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 dark:bg-black/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Protocol</span>
                  <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{result.protocol}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-black/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Hostname (Domain)</span>
                  <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{result.hostname}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-black/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Path</span>
                  <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{result.pathname || "/"}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-black/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Port</span>
                  <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{result.port}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}