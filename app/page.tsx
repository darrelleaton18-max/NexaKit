"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData";

export default function Home() {
  const [region, setRegion] = useState("Global");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleRegionSync = () => {
      setRegion(localStorage.getItem("nexaRegion") || "Global");
    };
    handleRegionSync();
    window.addEventListener("regionChange", handleRegionSync);
    return () => window.removeEventListener("regionChange", handleRegionSync);
  }, []);

  // Filter tools based on region
  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => {
      const matchesRegion = !t.regions || t.regions.includes(region) || t.regions.includes("Global");
      const matchesSearch = searchQuery === "" || t.label.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    })
  })).filter(g => g.tools.length > 0);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      
      {/* ========================================== */}
      {/* HERO SECTION WITH TRUST BADGES             */}
      {/* ========================================== */}
      <div className="text-center py-8 md:py-12 bg-gradient-to-b from-slate-100/50 dark:from-slate-900/50 to-transparent rounded-3xl px-4 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 text-xs font-bold mb-4 border border-blue-200 dark:border-blue-800/50">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse"></span>
          30+ Professional Web Utilities • Free & Secure
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Every tool you need, <span className="text-blue-600 dark:text-sky-400">all in one place.</span>
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Lightning-fast calculators, text formatters, and data converters processed 100% locally in your browser. No signups, no data storage.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for any tool (e.g., Currency, Tax, QR Code, JSON)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md hover:bg-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* FEATURED HIGHLIGHT CARDS                   */}
      {/* ========================================== */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/tool/currency-converter" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600&h=300" alt="Currency Converter" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-blue-600 px-2.5 py-1 rounded-md shadow">Popular</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">Live Currency Converter</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Convert global currencies with real-time mid-market exchange rates.</p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-sky-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Launch Tool &rarr;</span>
            </div>
          </Link>

          <Link href="/tool/qr-maker" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=300" alt="QR Code Generator" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-emerald-600 px-2.5 py-1 rounded-md shadow">Utility</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">QR Code Generator</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Instantly create and download custom scannable QR codes for links and text.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Launch Tool &rarr;</span>
            </div>
          </Link>

          <Link href="/tool/wheel-gen" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600&h=300" alt="Spinning Decision Wheel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-amber-500 px-2.5 py-1 rounded-md shadow">Fun</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Spinning Decision Wheel</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Enter your options and let the physics-based random wheel choose for you.</p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Launch Tool &rarr;</span>
            </div>
          </Link>
        </div>
      )}
      
      {/* ========================================== */}
      {/* STRUCTURED CATEGORY DIRECTORY              */}
      {/* ========================================== */}
      <div className="flex flex-col gap-8">
        {filteredNavGroups.map((group, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                {group.group}
              </h2>
              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                {group.tools.length} Tools
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tool/${tool.id}`}
                  className="text-left px-5 py-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-sky-300 font-semibold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <span className="leading-snug pr-2">{tool.label}</span>
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}