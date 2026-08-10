"use client";

import { useState } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData"; 

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const allCategories = ["All Categories", ...navGroups.map(g => g.group)];

  const filteredGroups = navGroups.map(group => {
    const filteredTools = group.tools.filter(tool =>
      tool.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, tools: filteredTools };
  }).filter(group => {
    const matchesCategory = activeCategory === "All Categories" || group.group === activeCategory;
    return matchesCategory && group.tools.length > 0;
  });

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* HERO SECTION */}
      <div className="w-full py-12 md:py-20 flex flex-col items-center text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          ⚡ 30+ Professional Power Tools • Zero Server Lag
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white leading-tight">
          Instant utilities. <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Zero friction.</span><br className="hidden md:block" /> Built for speed.
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Instant financial calculators, text formatters, and data workflows running locally in your browser. No bloat, no accounts, and 100% private.
        </p>

        {/* Main Search Bar */}
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-2xl px-5 shadow-xl transition-all group-hover:border-orange-500/40">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              placeholder="Search for any tool (e.g., Currency, Tax, QR Code, JSON)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none px-4 py-5 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-lg font-medium"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="w-full flex flex-wrap justify-center gap-2.5 mb-14">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-black/10 dark:shadow-white/10"
                : "bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TOOLS GRID */}
      <div className="w-full flex flex-col gap-12">
        {filteredGroups.map((group, idx) => (
          <div key={idx} className="w-full">
            
            {/* Group Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/[0.05] pb-3 px-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                {group.group === "Finance Calculators" && "💰"}
                {group.group === "Finance Trackers" && "📊"}
                {group.group === "Math" && "🧮"}
                {group.group === "Time" && "⏱️"}
                {group.group === "Text" && "📝"}
                {group.group === "Documents" && "📄"}
                {group.group === "Dev" && "⚙️"}
                {group.group === "Random" && "🎲"}
                {group.group === "Media" && "🖼️"}
                {group.group === "Language" && "🗣️"}
                {group.group}
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/[0.03] px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
                {group.tools.length} Tools
              </span>
            </div>

            {/* Grid Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {group.tools.map((tool) => {
                const categorySlug = group.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                
                return (
                  <Link
                    key={tool.id}
                    href={`/${categorySlug}/${tool.id}`}
                    className="group flex items-center p-4 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/[0.05] rounded-[20px] hover:border-orange-500/50 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    {/* Tool Icon / Initial */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-500 flex items-center justify-center font-black text-2xl mr-4 transition-colors duration-300 shadow-inner">
                      {tool.label.charAt(0)}
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate text-base">
                        {tool.label}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-500 truncate mt-1 uppercase tracking-wider">
                        {group.group}
                      </p>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/[0.02] text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shrink-0 transform group-hover:translate-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
            
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">
            No tools found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}