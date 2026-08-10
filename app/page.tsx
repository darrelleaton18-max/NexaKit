"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData"; 
import { LazyAd } from "../components/GlobalShell";
import RollingMarquee from "../components/RollingMarquee";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Sync with global navbar search
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).nexaSearchQuery) {
      setSearchQuery((window as any).nexaSearchQuery);
    }
    
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('nexa-search', handleSearch);
    
    return () => window.removeEventListener('nexa-search', handleSearch);
  }, []);

  const allCategories = ["All Categories", ...navGroups.map(g => g.group)];

  const categoryIcons: Record<string, string> = {
    "Finance Calculators": "💰",
    "Finance Trackers": "📊",
    "Math": "🧮",
    "Time": "⏱️",
    "Text": "📝",
    "Documents": "📄",
    "Dev": "⚙️",
    "Random": "🎲",
    "Media": "🖼️",
    "Language": "🗣️",
  };

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
      
      {/* TIGHTENED SPACING: Reduced padding here */}
      <div className="w-full pt-1 pb-0">
        <RollingMarquee />
      </div>
      
      {/* TIGHTENED SPACING: Reduced top padding and bottom margin */}
      <div className="w-full pt-6 pb-12 md:pt-10 md:pb-16 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          ⚡ 30+ Professional Power Tools • Zero Server Lag
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
          Instant utilities. <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Zero friction.</span><br className="hidden md:block" /> Built for speed.
        </h1>

        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Instant financial calculators, text formatters, and data workflows running locally in your browser. No bloat, no accounts, and 100% private.
        </p>

      </div>

      {/* CATEGORY FILTERS */}
      <div className="w-full flex flex-wrap justify-center gap-2.5 mb-10">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg shadow-black/10 dark:shadow-white/10"
                : "bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            {categoryIcons[cat] && <span>{categoryIcons[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* TOP AD BANNER */}
      <div className="w-full mb-12">
        <LazyAd index={98} type="banner" />
      </div>

      {/* TOOLS GRID */}
      <div className="w-full flex flex-col gap-12">
        {filteredGroups.map((group, idx) => (
          
          <div key={idx} className="w-full bg-neutral-50 dark:bg-[#131313] border border-neutral-200 dark:border-white/5 rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200/60 dark:border-white/[0.05]">
              <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-3 tracking-tight">
                {categoryIcons[group.group]} {group.group}
              </h2>
              <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 bg-white dark:bg-black/20 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-white/5 shadow-sm">
                {group.tools.length} Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {group.tools.map((tool) => {
                const categorySlug = group.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                
                return (
                  <Link
                    key={tool.id}
                    href={`/${categorySlug}/${tool.id}`}
                    className="group flex items-center p-5 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] rounded-[24px] hover:border-orange-500/40 dark:hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-black/40 text-neutral-500 dark:text-neutral-400 group-hover:bg-orange-500/10 group-hover:text-orange-600 dark:group-hover:text-orange-500 flex items-center justify-center font-black text-2xl mr-4 transition-colors duration-300 shadow-inner">
                      {tool.label.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate text-[17px]">
                        {tool.label}
                      </h3>
                      <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-500 truncate mt-1 uppercase tracking-wider">
                        {group.group}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-50 dark:bg-black/40 text-neutral-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shrink-0 transform group-hover:translate-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </Link>
                );
              })}
            </div>
            
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-20 text-neutral-500 dark:text-neutral-400 font-medium">
            No tools found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
}