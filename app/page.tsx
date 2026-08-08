"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData";
import RollingMarquee from "../components/RollingMarquee"; // <-- 1. IMPORT THE MARQUEE

export default function Home() {
  const [region, setRegion] = useState("Global");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleRegionSync = () => {
      setRegion(localStorage.getItem("nexaRegion") || "Global");
    };
    handleRegionSync();
    window.addEventListener("regionChange", handleRegionSync);
    return () => window.removeEventListener("regionChange", handleRegionSync);
  }, []);

  // Filter groups and tools based on region, search query, and category filter pills
  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => {
      const matchesRegion = !t.regions || t.regions.includes(region) || t.regions.includes("Global");
      const matchesSearch = searchQuery === "" || t.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || g.group.includes(activeCategory);
      return matchesRegion && matchesSearch && matchesCategory;
    })
  })).filter(g => g.tools.length > 0);

  // Helper to extract a short contextual description for tool cards
  const getToolDescription = (id: string, label: string) => {
    if (id.includes('tax') || id.includes('currency') || id.includes('loan') || id.includes('compound') || id.includes('comp') || id.includes('time-to-buy') || id.includes('fee')) {
      return "Calculate precise financial metrics, audit fees, or project future capital growth.";
    }
    if (id.includes('net-worth') || id.includes('budget') || id.includes('sub') || id.includes('debt') || id.includes('savings') || id.includes('envelope') || id.includes('freelance')) {
      return "Track assets, automate zero-based budgets, and audit recurring cash flow.";
    }
    if (id.includes('pct') || id.includes('unit') || id.includes('stats') || id.includes('prime') || id.includes('base')) {
      return "Perform advanced mathematical operations, unit conversions, and sequence generations.";
    }
    if (id.includes('stopwatch') || id.includes('countdown') || id.includes('date') || id.includes('age') || id.includes('timezone')) {
      return "Track precise time intervals, manage timezones, and calculate temporal offsets.";
    }
    if (id.includes('word') || id.includes('case') || id.includes('list') || id.includes('find') || id.includes('lorem') || id.includes('lang') || id.includes('trans')) {
      return "Format text strings, encode character arrays, and translate language feeds.";
    }
    if (id.includes('json') || id.includes('base64') || id.includes('url') || id.includes('hash') || id.includes('color') || id.includes('qr')) {
      return "Developer utilities for minifying JSON, encoding hashes, and building assets.";
    }
    if (id.includes('password') || id.includes('num') || id.includes('uuid') || id.includes('dice') || id.includes('username') || id.includes('wheel')) {
      return "Generate cryptographically secure tokens, rolling physics items, and unique tags.";
    }
    return "Optimize, convert, and manage digital media files securely in your browser.";
  };

  // Simplified category name extractor
  const categoryList = ["All", ...navGroups.map(g => g.group.replace(/[^a-zA-Z\s]/g, "").trim())];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      
      {/* HERO SECTION */}
      <div className="text-center py-10 md:py-14 bg-gradient-to-b from-slate-100/50 dark:from-slate-900/50 to-transparent rounded-3xl px-4 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 text-xs font-bold mb-5 border border-blue-200 dark:border-blue-800/50 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse"></span>
          ⚡ 30+ Professional Power Tools • Zero Server Lag
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Instant utilities. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 dark:from-sky-400 dark:to-blue-500">Zero friction.</span> Built for speed.
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          Instant financial calculators, text formatters, and data workflows running locally in your browser. No bloat, no accounts, and 100% private.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative mb-6">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* 2. PLACED ROLLING MARQUEE BANNER HERE */}
        <RollingMarquee />

      </div>

      {/* ========================================== */}
      {/* INTERACTIVE CATEGORY FILTER PILLS BAR      */}
      {/* ========================================== */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
          {categoryList.map((cat, idx) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isSelected 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* CLICKONTOOL CARD GRID LAYOUT               */}
      {/* ========================================== */}
      <div className="flex flex-col gap-12">
        {filteredNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-5">
            
            {/* Section Header */}
            <div className="flex justify-between items-end pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  {group.group}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {group.tools.length} Tools available
              </span>
            </div>

            {/* Individual Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {group.tools.map((tool) => {
                const cleanCategoryName = group.group.replace(/[^a-zA-Z\s]/g, "").trim();
                return (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.id}`}
                    className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Top Row: Icon badge & Arrow */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg shadow-inner border border-blue-100 dark:border-blue-800/40 group-hover:scale-110 transition-transform">
                        {tool.label.charAt(0)}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
                      </div>
                    </div>

                    {/* Middle: Title & Contextual Description */}
                    <div className="mb-6">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {tool.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {getToolDescription(tool.id, tool.label)}
                      </p>
                    </div>

                    {/* Bottom Row: Category Tag & Status Badge */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold">
                      <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {cleanCategoryName}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/40">
                        Free • Online
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}