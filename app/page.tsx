"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData"; 
import { LazyAd } from "../components/GlobalShell";
import RollingMarquee from "../components/RollingMarquee";

// Deletes any emojis or symbols before the first actual letter
const cleanCategoryName = (name: string) => {
  return name.replace(/^[^a-zA-Z]+/, '').trim();
};

// Smart component that assigns custom SVGs based on keywords in the tool's name
const ToolIcon = ({ toolName, className }: { toolName: string, className?: string }) => {
  const name = toolName.toLowerCase();
  
  // PDF / Document Tools
  if (name.includes("merge")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7l-3 3m3-3l3 3m5-8V7a2 2 0 00-2-2h-2" /></svg>;
  if (name.includes("split") || name.includes("cut")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242m4.242 4.242L9 9m5.121 5.121A3 3 0 1015 15a3 3 0 00-.879-.879M9 9A3 3 0 106 6a3 3 0 003 3z" /></svg>;
  if (name.includes("compress") || name.includes("reduce")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;
  if (name.includes("rotate")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
  if (name.includes("watermark") || name.includes("stamp")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19h6" /></svg>;
  if (name.includes("pdf")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

  // Finance Tools
  if (name.includes("tax") || name.includes("income")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  if (name.includes("currency")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
  if (name.includes("mortgage") || name.includes("loan") || name.includes("buy")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  if (name.includes("compound") || name.includes("net worth") || name.includes("investment")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
  if (name.includes("budget") || name.includes("audit") || name.includes("fee")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

  // Time Tools
  if (name.includes("stopwatch") || name.includes("timer") || name.includes("clock")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (name.includes("date") || name.includes("day")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

  // Text & String Tools
  if (name.includes("word") || name.includes("character") || name.includes("lorem")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>;
  if (name.includes("case") || name.includes("letter")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>;
  if (name.includes("sort") || name.includes("list")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>;

  // Math Tools
  if (name.includes("percent") || name.includes("calculator") || name.includes("metric")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

  // Utilities / Dev / Media
  if (name.includes("password") || name.includes("hash")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>;
  if (name.includes("qr") || name.includes("barcode")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
  if (name.includes("image") || name.includes("png") || name.includes("jpg")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  if (name.includes("wheel") || name.includes("random") || name.includes("dice")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (name.includes("json") || name.includes("xml") || name.includes("code")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;

  // Audio & Video Tools
  if (name.includes("audio") || name.includes("volume")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>;
  if (name.includes("video") || name.includes("trimmer")) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

  // Fallback Generic Icon
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  // Automatically calculate total active tools and format into badge text (e.g., 33 -> "30+")
  const totalToolsCount = navGroups.reduce((acc, group) => acc + group.tools.length, 0);
  const roundedToolCount = Math.floor(totalToolsCount / 10) * 10;
  const toolBadgeText = `${roundedToolCount}+`;

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).nexaSearchQuery) {
      setSearchQuery((window as any).nexaSearchQuery);
    }
    
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('Omni-search', handleSearch);
    
    return () => window.removeEventListener('Omni-search', handleSearch);
  }, []);

  const allCategories = ["All Categories", ...navGroups.map(g => cleanCategoryName(g.group))];

  const filteredGroups = navGroups.map(group => {
    const cleanName = cleanCategoryName(group.group);
    const filteredTools = group.tools.filter(tool =>
      tool.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, cleanName, tools: filteredTools };
  }).filter(group => {
    const matchesCategory = activeCategory === "All Categories" || group.cleanName === activeCategory;
    return matchesCategory && group.tools.length > 0;
  });

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* ROLLING MARQUEE */}
      <div className="w-full pt-1 pb-0">
        <RollingMarquee />
      </div>
      
      {/* HERO SECTION */}
      <div className="w-full pt-6 pb-12 md:pt-10 md:pb-16 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          ⚡ {toolBadgeText} Professional Power Tools • Zero Server Lag
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
          Instant utilities. <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Zero friction.</span><br className="hidden md:block" /> Built for speed.
        </h1>

        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Instant financial calculators, text formatters, and data workflows running locally in your browser. No bloat, no accounts, and 100% private.
        </p>

      </div>

      {/* CATEGORY FILTERS (Added hover pop/lift animation) */}
      <div className="w-full flex flex-wrap justify-center gap-2.5 mb-10">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
              activeCategory === cat
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg shadow-black/10 dark:shadow-white/10 scale-105"
                : "bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TOP AD BANNER */}
      <div className="w-full mb-12">
        <LazyAd index={98} type="banner" />
      </div>

      {/* TOOLS GRID */}
      <div className="w-full flex flex-col">
        {filteredGroups.map((group, idx) => (
          
          <div key={idx} className="w-full flex flex-col mb-14 last:mb-0 group/section">
            
            {/* Sleek Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100 dark:border-white/5 transition-colors group-hover/section:border-neutral-200 dark:group-hover/section:border-white/10">
              <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {group.cleanName}
              </h2>
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5 px-3 py-1 rounded-full transition-colors group-hover/section:bg-orange-50 dark:group-hover/section:bg-orange-500/10 group-hover/section:text-orange-600 dark:group-hover/section:text-orange-400 uppercase tracking-widest">
                {group.tools.length} Tools
              </span>
            </div>

            {/* Premium Grid: Uses 2 columns on tablets, 3 on desktops */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {group.tools.map((tool) => {
                const categorySlug = group.cleanName.replace(/[^a-zA-Z]/g, "").toLowerCase();
                
                return (
                  <Link
                    key={tool.id}
                    href={`/${categorySlug}/${tool.id}`}
                    className="group flex items-center p-4 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-white/[0.05] rounded-2xl hover:bg-orange-50/50 dark:hover:bg-[#1a1a1a] hover:border-orange-400/50 dark:hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    {/* Balanced Icon Box */}
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-neutral-50 dark:bg-[#1a1a1a] text-neutral-500 dark:text-neutral-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center mr-4 transition-all duration-300 shadow-sm border border-neutral-100 dark:border-white/5 group-hover:border-transparent">
                      <ToolIcon toolName={tool.label} className="w-6 h-6" />
                    </div>
                    
                    {/* Text Container - Allowed to breathe! */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-[14px] md:text-[15px] truncate">
                        {tool.label}
                      </h3>
                      <p 
                        className="text-[11px] md:text-[12px] font-medium text-neutral-400 dark:text-neutral-500 truncate mt-1" 
                        title={tool.description}
                      >
                        {tool.description || group.cleanName.toUpperCase()}
                      </p>
                    </div>

                    {/* Right Arrow */}
                    <div className="w-6 h-6 shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-orange-500 group-hover:translate-x-1.5 transition-all duration-300 flex items-center justify-center ml-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
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