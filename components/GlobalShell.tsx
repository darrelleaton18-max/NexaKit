"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navGroups } from "./navData";

type AdSize = "skyscraper" | "standard" | "banner";

export const LazyAd = ({ index, type }: { index: number; type: AdSize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [adVersion, setAdVersion] = useState(1);
  const adRef = useRef<HTMLDivElement>(null);

  // 1. Simulate ad loading and automatic rotation
  useEffect(() => {
    // Initial load
    const loadTimer = setTimeout(() => setIsVisible(true), 1000);

    // Rotate every 15 seconds
    const rotateTimer = setInterval(() => {
      setIsVisible(false); // Trigger fade out
      setTimeout(() => {
        setAdVersion(prev => prev + 1); // Change version number
        setIsVisible(true); // Trigger fade in
      }, 800); // Show "Loading..." for 800ms between rotations
    }, 15000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(rotateTimer);
    };
  }, []);

  // 2. Google Translate script
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;
    const userLang = navigator.language.split('-')[0];
    if (!document.cookie.includes('googtrans=')) {
      document.cookie = `googtrans=/en/${userLang}; path=/`;
    }
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    const fixUI = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select && select.options[0]) {
        if (select.options[0].text === 'Select Language' || select.options[0].value === '') {
          select.options[0].text = 'English';
        }
        clearInterval(fixUI);
      }
    }, 500);
    return () => clearInterval(fixUI);
  }, []);

  if (type === "banner") {
    return (
      <div
        ref={adRef}
        className={`w-full max-w-[728px] h-[90px] mx-auto mt-4 mb-4 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center p-2 transition-all duration-700 shadow-sm ${
          isVisible ? "bg-neutral-100/80 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 opacity-100" : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/50 opacity-50"
        }`}
      >
        {isVisible ? (
          <>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-1">Advertisement</span>
            <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm leading-tight flex items-center justify-center">
              728x90 Leaderboard <span className="opacity-50 text-[10px] ml-2 font-mono">v{adVersion}</span>
            </span>
          </>
        ) : (
          <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 animate-pulse">Refreshing Ad...</span>
        )}
      </div>
    );
  }

  const isSkyscraper = type === "skyscraper";
  const heightClass = isSkyscraper ? "h-[600px]" : "h-[250px]";
  const textLabel = isSkyscraper ? "160x600 Skyscraper" : "160x250 Standard";

  return (
    <div
      ref={adRef}
      className={`w-[160px] ${heightClass} rounded-3xl border border-dashed flex flex-col items-center justify-center text-center p-4 transition-all duration-700 shadow-sm ${
        isVisible ? "bg-neutral-100/80 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 opacity-100" : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/50 opacity-50"
      }`}
    >
      {isVisible ? (
        <>
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-2">Ad Slot {index}</span>
          <span className="text-neutral-600 dark:text-neutral-400 font-medium text-sm leading-tight flex flex-col items-center">
            <span dangerouslySetInnerHTML={{ __html: textLabel.replace(" ", "<br/>") }} />
            <span className="opacity-40 text-[10px] mt-2 font-mono">Refresh #{adVersion}</span>
          </span>
        </>
      ) : (
        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 animate-pulse">Loading...</span>
      )}
    </div>
  );
};

const AdColumn = ({ side }: { side: "left" | "right" }) => {
  return (
    <aside className="hidden xl:block w-[160px] shrink-0 relative">
      <div className="sticky top-28 flex flex-col items-center gap-4">
        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
          Advertisement
        </span>
        <LazyAd index={side === "left" ? 1 : 2} type="skyscraper" />
      </div>
    </aside>
  );
};

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [region, setRegion] = useState("Global");
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- MEGA MENU STATE ---
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  let activeTool = "home";
  const pathParts = pathname.split("/").filter(Boolean);

  if (pathname.includes("/privacy")) {
    activeTool = "privacy";
  } else if (pathname.includes("/terms")) {
    activeTool = "terms";
  } else if (pathParts.length === 2) {
    activeTool = pathParts[1]; 
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("omniTheme");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark");
      } else {
        setIsDark(false); 
      }

      const savedRegion = localStorage.getItem("omniRegion") || localStorage.getItem("nexaRegion");
      if (savedRegion) {
        setRegion(savedRegion);
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let detected = "Global";
        if (tz.startsWith("Europe/London")) detected = "UK";
        else if (tz.startsWith("America/")) detected = "US";
        else if (tz.startsWith("Canada/") || tz.includes("Toronto") || tz.includes("Vancouver")) detected = "CA";
        else if (tz.startsWith("Australia/")) detected = "AU";
        else if (tz.startsWith("Pacific/Auckland")) detected = "NZ";
        else if (tz.startsWith("Europe/")) detected = "EU";
        
        setRegion(detected);
        localStorage.setItem("omniRegion", detected);
      }

      const handleRegionSync = () => {
        setRegion(localStorage.getItem("omniRegion") || localStorage.getItem("nexaRegion") || "Global");
      };
      window.addEventListener("regionChange", handleRegionSync);
      return () => window.removeEventListener("regionChange", handleRegionSync);
    }
  }, []);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    localStorage.setItem("omniRegion", newRegion);
    window.dispatchEvent(new Event("regionChange"));
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.background = "#050505"; 
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.background = "#ffffff"; 
    }
  }, [isDark]);

  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => !t.regions || t.regions.includes(region) || t.regions.includes("Global"))
  })).filter(g => g.tools.length > 0);

  const allTools = filteredNavGroups.flatMap(g => 
    g.tools.map(t => ({
      ...t,
      categoryName: g.group,
      categorySlug: g.group.replace(/[^a-zA-Z]/g, "").toLowerCase()
    }))
  );

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : allTools.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const topResults = searchResults.slice(0, 5);
  const hasMore = searchResults.length > 5;

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-gradient-to-br from-white via-neutral-50 to-orange-100/40 dark:from-neutral-950 dark:via-[#0a0a0a] dark:to-orange-950/20 text-neutral-800 dark:text-neutral-100 selection:bg-orange-500 selection:text-white flex flex-col font-sans transition-colors duration-300 p-2 sm:p-4 md:p-6 lg:p-8`}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          0% { transform: rotate3d(1, 1, 0, 0deg); }
          100% { transform: rotate3d(1, 1, 0, 360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate3d(0, 1, 1, 0deg); }
          100% { transform: rotate3d(0, 1, 1, -360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.6)); }
          50% { filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.9)); }
        }
        .animate-orbit-1 { animation: spin-slow 8s linear infinite; transform-origin: center; }
        .animate-orbit-2 { animation: spin-reverse 6s linear infinite; transform-origin: center; }
        .animate-orb { animation: pulse-glow 3s ease-in-out infinite; }
      `}} />

      <div className="flex flex-1 w-full max-w-[1920px] mx-auto gap-1 lg:gap-2">
        
        <AdColumn side="left" />

        <div className="flex-1 flex flex-col relative min-w-0">

          <div className="sticky top-0 w-full h-4 md:h-6 z-40 bg-gradient-to-b from-white via-white/90 to-transparent dark:from-[#050505] dark:via-[#050505]/90 dark:to-transparent pointer-events-none"></div>
          
          <header className="sticky top-4 md:top-6 z-50 mx-4 md:mx-8 mb-6 backdrop-blur-2xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-white/10 rounded-2xl md:rounded-[2rem] px-6 lg:px-8 h-[72px] flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all">
            
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 cursor-pointer group">
                
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/20 relative overflow-hidden animate-orb">
                  <div className="absolute w-4 h-4 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 shadow-md shadow-orange-500 z-10"></div>
                  <div className="absolute w-7 h-7 rounded-full border border-neutral-400/60 animate-orbit-1 z-20"></div>
                  <div className="absolute w-8 h-8 rounded-full border-2 border-dashed border-orange-500/80 animate-orbit-2 z-20"></div>
                </div>

                <div className="flex flex-col hidden sm:flex">
                  <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    Omni Utility
                  </span>
                </div>
              </Link>

              <div className="relative group hidden lg:block h-10 flex items-center">
                <button className="flex items-center gap-2 h-full px-5 rounded-full border border-neutral-200 dark:border-neutral-700/50 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-white hover:border-orange-500/30 transition-all bg-neutral-50 dark:bg-white/[0.02]">
                  Explore
                  <svg className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div className="absolute top-10 left-0 pt-2 hidden group-hover:block w-[700px] z-50">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8 grid grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
                      
                      {filteredNavGroups.map((g, idx) => {
                        const categorySlug = g.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                        const isExpanded = expandedCategories.includes(g.group);
                        const visibleTools = isExpanded ? g.tools : g.tools.slice(0, 5);

                        return (
                          <div key={idx} className="flex flex-col gap-2.5">
                            <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-500 uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-800/50 pb-1.5 mb-1">
                              {g.group}
                            </span>
                            
                            {visibleTools.map(t => (
                              <Link
                                key={t.id}
                                href={`/${categorySlug}/${t.id}`}
                                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-white transition-colors truncate"
                              >
                                {t.label}
                              </Link>
                            ))}
                            
                            {g.tools.length > 5 && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault(); 
                                  toggleCategory(g.group);
                                }}
                                className="text-left text-xs font-bold text-neutral-500 hover:text-orange-500 mt-1 transition-colors"
                              >
                                {isExpanded ? "- View less" : "+ View all"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative" ref={searchContainerRef}>
              <svg className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (typeof window !== 'undefined') {
                    (window as any).omniSearchQuery = e.target.value;
                    window.dispatchEvent(new CustomEvent('omni-search', { detail: e.target.value }));
                  }
                }}
                className="w-full bg-neutral-50 dark:bg-black/20 hover:bg-neutral-100 dark:hover:bg-white/[0.05] border border-neutral-200 dark:border-white/5 focus:border-orange-500/50 rounded-full pl-11 pr-16 py-2.5 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all shadow-inner outline-none ring-0"
              />
              <kbd className="absolute right-4 hidden sm:inline-block bg-white dark:bg-white/10 text-neutral-500 dark:text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/5 shadow-sm pointer-events-none">Ctrl K</kbd>
              
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {topResults.length > 0 ? (
                    <div className="flex flex-col">
                      {topResults.map(tool => (
                        <Link 
                          key={tool.id}
                          href={`/${tool.categorySlug}/${tool.id}`} 
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery("");
                          }}
                          className="px-5 py-3.5 hover:bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {tool.label}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                              {tool.categoryName}
                            </span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-black/30 flex items-center justify-center text-neutral-400 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                          </div>
                        </Link>
                      ))}
                      {hasMore && (
                        <Link 
                          href="/" 
                          onClick={() => setIsSearchFocused(false)} 
                          className="block px-5 py-3.5 bg-neutral-50 dark:bg-black/20 text-xs font-bold text-center text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-neutral-100 dark:hover:bg-black/40 transition-colors"
                        >
                          View all {searchResults.length} matching tools →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-sm text-neutral-500 dark:text-neutral-400 text-center font-medium">
                      No tools found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="md:hidden p-3 rounded-full bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-300 hover:text-orange-500 transition-all shadow-sm flex items-center justify-center"
                title="Open Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>

              <div className="relative hidden sm:block group">
                <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-300 text-xs font-bold rounded-full px-4 py-2.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition shadow-sm">
                  {region === "Global" && <span>🌎 Global</span>}
                  {region === "UK" && <><img src="https://flagcdn.com/w20/gb.png" width="16" alt="UK" className="rounded-[2px]" /> UK</>}
                  {region === "US" && <><img src="https://flagcdn.com/w20/us.png" width="16" alt="US" className="rounded-[2px]" /> US</>}
                  {region === "EU" && <><img src="https://flagcdn.com/w20/eu.png" width="16" alt="EU" className="rounded-[2px]" /> EU</>}
                  {region === "CA" && <><img src="https://flagcdn.com/w20/ca.png" width="16" alt="CA" className="rounded-[2px]" /> Canada</>}
                  {region === "AU" && <><img src="https://flagcdn.com/w20/au.png" width="16" alt="AU" className="rounded-[2px]" /> Australia</>}
                  {region === "NZ" && <><img src="https://flagcdn.com/w20/nz.png" width="16" alt="NZ" className="rounded-[2px]" /> New Zealand</>}
                  <svg className="w-4 h-4 opacity-70 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-[100]">
                  <div className="flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden py-2">
                    {[
                      { code: "Global", label: "Global", flag: null },
                      { code: "UK", label: "UK", flag: "gb" },
                      { code: "US", label: "US", flag: "us" },
                      { code: "EU", label: "EU", flag: "eu" },
                      { code: "CA", label: "Canada", flag: "ca" },
                      { code: "AU", label: "Australia", flag: "au" },
                      { code: "NZ", label: "New Zealand", flag: "nz" },
                    ].map((r) => (
                      <button
                        key={r.code}
                        onClick={() => handleRegionChange(r.code)}
                        className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition ${
                          region === r.code ? "bg-orange-600 text-white font-bold" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        {r.flag ? <img src={`https://flagcdn.com/w20/${r.flag}.png`} width="16" alt={r.code} className="rounded-[2px]" /> : <span>🌎</span>}
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const newThemeState = !isDark;
                  setIsDark(newThemeState);
                  localStorage.setItem("omniTheme", newThemeState ? "dark" : "light");
                }}
                className="p-3 rounded-full bg-neutral-50 dark:bg-white/[0.02] hover:bg-neutral-100 dark:hover:bg-white/[0.05] border border-neutral-200 dark:border-white/5 text-amber-500 dark:text-amber-400 transition-all shadow-sm flex items-center justify-center"
                title="Toggle Theme"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
                ) : (
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                )}
              </button>
            </div>
          </header>

          <main ref={mainRef} className="flex-1 flex flex-col p-6 md:p-10 pt-0 w-full">
            <div className="flex-1 pb-10">
              {children}
            </div>
            
            <LazyAd index={99} type="banner" />
          </main>

          <footer className="w-full bg-transparent border-t border-neutral-200 dark:border-white/[0.05] text-neutral-500 dark:text-neutral-400 py-8 px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm relative z-50">
            
            <style dangerouslySetInnerHTML={{__html: `
              .skiptranslate > iframe.skiptranslate { display: none !important; }
              body { top: 0px !important; }
              .goog-te-gadget { color: transparent !important; font-size: 0px !important; display: flex; align-items: center; justify-content: center; }
              .goog-te-gadget img, .goog-te-gadget span { display: none !important; }
              .goog-te-combo { color: #52525b; background-color: #fafafa; padding: 8px 16px; border-radius: 99px; font-size: 13px; font-weight: 700; outline: none; border: 1px solid #e5e5e5; cursor: pointer; margin: 0 !important; }
              .dark .goog-te-combo { color: #a3a3a3; background-color: #171717; border-color: rgba(255,255,255,0.1); }
            `}} />
            
            <p>&copy; {new Date().getFullYear()} Omni Utility. 100% Private.</p>

            <div className="flex flex-wrap justify-center gap-6 font-semibold">
              <Link href="/" className="hover:text-orange-600 dark:hover:text-white transition">Home</Link>
              <Link href="/privacy" className="hover:text-orange-600 dark:hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-600 dark:hover:text-white transition">Terms</Link>
            </div>
            
            <div id="google_translate_element"></div>
          </footer>

        </div>

        <AdColumn side="right" />

      </div>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold text-xs tracking-widest uppercase">Search Utilities</span>
            <button 
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="relative w-full">
            <svg className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              autoFocus
              type="text"
              placeholder="Type to search tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (typeof window !== 'undefined') {
                  (window as any).omniSearchQuery = e.target.value;
                  window.dispatchEvent(new CustomEvent('omni-search', { detail: e.target.value }));
                }
              }}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl pl-12 pr-4 py-3.5 text-base text-white placeholder-neutral-400 outline-none shadow-xl"
            />
          </div>

          <div className="flex-1 overflow-y-auto mt-4 flex flex-col gap-2">
            {searchResults.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.categorySlug}/${tool.id}`}
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                className="flex items-center justify-between p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl active:scale-95 transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{tool.label}</span>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{tool.categoryName}</span>
                </div>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
              </Link>
            ))}
            {searchQuery.trim() !== "" && searchResults.length === 0 && (
              <div className="text-center py-10 text-neutral-400 text-sm">
                No tools found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}