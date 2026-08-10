"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./navData";

type AdSize = "skyscraper" | "standard" | "banner";

const LazyAd = ({ index, type }: { index: number; type: AdSize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

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
        className={`w-full max-w-[728px] h-[90px] mx-auto mt-8 mb-4 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center p-2 transition-all duration-700 shadow-sm ${
          isVisible ? "bg-slate-100/80 dark:bg-slate-900 border-slate-300 dark:border-slate-800 opacity-100" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 opacity-50"
        }`}
      >
        {isVisible ? (
          <>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Advertisement</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-tight">728x90 Leaderboard</span>
          </>
        ) : (
          <span className="text-xs font-bold text-slate-400 dark:text-slate-600 animate-pulse">Lazy Loading Ad...</span>
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
        isVisible ? "bg-slate-100/80 dark:bg-slate-900 border-slate-300 dark:border-slate-800 opacity-100" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 opacity-50"
      }`}
    >
      {isVisible ? (
        <>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2">Ad Slot {index + 1}</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-tight" dangerouslySetInnerHTML={{ __html: textLabel.replace(" ", "<br/>") }} />
        </>
      ) : (
        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 animate-pulse">Loading...</span>
      )}
    </div>
  );
};

const AdColumn = ({ side, layout }: { side: "left" | "right"; layout: AdSize[] }) => {
  return (
    <aside className="hidden xl:flex flex-col items-center gap-6 w-[160px] shrink-0 pt-6 pb-10 h-full relative">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-[-10px]">Advertisement</span>
      {layout.map((adSize, i) => (
        <LazyAd key={`${side}-${i}-${adSize}`} index={i} type={adSize} />
      ))}
    </aside>
  );
};

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [region, setRegion] = useState("Global");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const [adLayout, setAdLayout] = useState<AdSize[]>(["standard"]);

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
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);

      const savedRegion = localStorage.getItem("nexaRegion");
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
        localStorage.setItem("nexaRegion", detected);
      }

      const handleRegionSync = () => {
        setRegion(localStorage.getItem("nexaRegion") || "Global");
      };
      window.addEventListener("regionChange", handleRegionSync);
      return () => window.removeEventListener("regionChange", handleRegionSync);
    }
  }, []);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    localStorage.setItem("nexaRegion", newRegion);
    window.dispatchEvent(new Event("regionChange"));
  };

  // OUTER CANVAS BACKGROUND CONTROL (Pure Black in Dark Mode for that floating Bento effect)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000000"; 
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f1f5f9"; 
    }
  }, [isDark]);

  useEffect(() => {
    if (!mainRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (activeTool === "privacy" || activeTool === "terms") {
            setAdLayout([]);
            continue;
        }
        const h = entry.contentRect.height;
        const TALL_H = 624; 
        const SHORT_H = 274; 
        let bestLayout: AdSize[] = [];
        let minWaste = h;
        const maxTall = Math.floor(h / TALL_H);
        for (let tallAds = 0; tallAds <= maxTall; tallAds++) {
          const remainder = h - (tallAds * TALL_H);
          const shortAds = Math.floor(remainder / SHORT_H);
          const waste = remainder - (shortAds * SHORT_H);
          if (waste < minWaste) {
            minWaste = waste;
            bestLayout = [...Array(tallAds).fill("skyscraper"), ...Array(shortAds).fill("standard")];
          }
        }
        if (bestLayout.length === 0) bestLayout = ["standard"];
        setAdLayout((prev) => JSON.stringify(prev) === JSON.stringify(bestLayout) ? prev : bestLayout);
      }
    });
    resizeObserver.observe(mainRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTool, children]);

  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => !t.regions || t.regions.includes(region) || t.regions.includes("Global"))
  })).filter(g => g.tools.length > 0);

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen text-slate-800 dark:text-slate-100 selection:bg-orange-500 selection:text-white flex flex-col font-sans transition-colors duration-300 p-2 sm:p-4 md:p-6 lg:p-8`}>
      
      {/* OUTER WRAPPER: AD COLUMNS FLANKING THE CENTRAL APP CARD */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto gap-4 lg:gap-8">
        
        {/* LEFT AD COLUMN */}
        <AdColumn side="left" layout={adLayout} />

        {/* ============================================================== */}
        {/* THE "BENTO BOX" MAIN APP CARD */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 rounded-[24px] md:rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden min-w-0 ring-1 ring-black/5 dark:ring-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          
          {/* HEADER SECTION (Inside the card) */}
          <header className="px-6 lg:px-10 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
            
            <div className="flex items-center gap-6">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl">
                  ⚡
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    NexaKit
                  </span>
                </div>
              </Link>

              {/* EXPLORE TOOLS PILL (Dropdown) */}
              <div className="relative group hidden lg:block h-10 flex items-center">
                <button className="flex items-center gap-2 h-full px-5 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:border-orange-500/30 transition-all bg-slate-50 dark:bg-slate-900">
                  Explore
                  <svg className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div className="absolute top-12 left-0 hidden group-hover:block w-[700px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50">
                  <div className="p-8 grid grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {filteredNavGroups.map((g, idx) => {
                      const categorySlug = g.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                      return (
                        <div key={idx} className="flex flex-col gap-2.5">
                          <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50 pb-1.5 mb-1">
                            {g.group}
                          </span>
                          {g.tools.slice(0, 5).map(t => (
                            <Link
                              key={t.id}
                              href={`/${categorySlug}/${t.id}`}
                              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-white transition-colors truncate"
                            >
                              {t.label}
                            </Link>
                          ))}
                          {g.tools.length > 5 && (
                            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-orange-500 mt-1">
                              + View all
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH PILL */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500/50 rounded-full px-5 py-2.5 text-sm text-slate-500 dark:text-slate-400 transition-all group shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Search tools...
                </span>
                <kbd className="hidden sm:inline-block bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">Ctrl K</kbd>
              </button>
            </div>

            {/* ACTION PILLS: REGION & THEME */}
            <div className="flex items-center gap-3">
              
              <div className="relative hidden sm:block group">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm">
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
                  <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2">
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
                          region === r.code ? "bg-orange-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-sky-300 transition-all shadow-sm flex items-center justify-center"
                title="Toggle Theme"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                )}
              </button>
            </div>
          </header>

          {/* SECONDARY CATEGORY NAV (Only visible if the active view wants it, but highly styled) */}
          <nav className="bg-slate-50/50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/60 px-6 lg:px-10 py-3 overflow-x-auto scrollbar-none flex items-center gap-2 relative z-40">
            {["All", "Finance Calculators", "Finance Trackers", "Math", "Time", "Text", "Documents", "Dev", "Random", "Media", "Language"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/25"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* MAIN INJECTED CONTENT */}
          <main ref={mainRef} className="flex-1 flex flex-col p-6 md:p-10 w-full overflow-y-auto">
            <LazyAd index={98} type="banner" />
            
            <div className="flex-1 pb-10">
              {children}
            </div>
            
            <LazyAd index={99} type="banner" />
          </main>

          {/* FOOTER */}
          <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 py-8 px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm relative z-50">
            
            <style dangerouslySetInnerHTML={{__html: `
              .skiptranslate > iframe.skiptranslate { display: none !important; }
              body { top: 0px !important; }
              .goog-te-gadget { color: transparent !important; font-size: 0px !important; display: flex; align-items: center; justify-content: center; }
              .goog-te-gadget img, .goog-te-gadget span { display: none !important; }
              .goog-te-combo { color: #64748b; background-color: #f8fafc; padding: 8px 16px; border-radius: 99px; font-size: 13px; font-weight: 700; outline: none; border: 1px solid #e2e8f0; cursor: pointer; margin: 0 !important; }
              .dark .goog-te-combo { color: #cbd5e1; background-color: #0f172a; border-color: rgba(255,255,255,0.1); }
            `}} />
            
            <p>&copy; {new Date().getFullYear()} NexaKit Suite. 100% Private.</p>

            <div className="flex flex-wrap justify-center gap-6 font-semibold">
              <Link href="/" className="hover:text-orange-600 dark:hover:text-white transition">Home</Link>
              <Link href="/privacy" className="hover:text-orange-600 dark:hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-600 dark:hover:text-white transition">Terms</Link>
            </div>
            
            <div id="google_translate_element"></div>
          </footer>

        </div>
        {/* END BENTO CARD */}

        {/* RIGHT AD COLUMN (Outside the App) */}
        <AdColumn side="right" layout={adLayout} />

      </div>
    </div>
  );
}