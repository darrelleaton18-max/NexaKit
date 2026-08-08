"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData";
import RollingMarquee from "../components/RollingMarquee";

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
      {/* HORIZONTAL CLICKONTOOL ROW GRID LAYOUT     */}
      {/* ========================================== */}
      <div className="flex flex-col gap-12">
        {filteredNavGroups.map((group, idx) => {
          const cleanCategoryName = group.group.replace(/[^a-zA-Z\s]/g, "").trim();
          return (
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

              {/* Horizontal Row Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.id}`}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Left: Icon Badge + Title / Category Stack */}
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-sky-400 flex items-center justify-center font-bold text-base shadow-inner border border-blue-100 dark:border-blue-800/40 shrink-0 group-hover:scale-105 transition-transform">
                        {tool.label.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors truncate">
                          {tool.label}
                        </span>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {cleanCategoryName}
                        </span>
                      </div>
                    </div>

                    {/* Right: Clean Arrow Icon */}
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/80 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}