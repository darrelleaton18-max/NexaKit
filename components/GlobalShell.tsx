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
    // Translate setup logic
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
        className={`w-full max-w-[728px] h-[90px] mx-auto mt-8 mb-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-2 transition-all duration-700 shadow-sm ${
          isVisible ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
        }`}
      >
        {isVisible ? (
          <>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Advertisement</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-tight">728x90 Leaderboard</span>
          </>
        ) : (
          <span className="text-xs font-bold text-slate-300 dark:text-slate-600 animate-pulse">Lazy Loading Ad...</span>
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
      className={`w-[160px] ${heightClass} rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-all duration-700 shadow-sm ${
        isVisible ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
      }`}
    >
      {isVisible ? (
        <>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2">Ad Slot {index + 1}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-tight" dangerouslySetInnerHTML={{ __html: textLabel.replace(" ", "<br/>") }} />
        </>
      ) : (
        <span className="text-xs font-bold text-slate-300 dark:text-slate-600 animate-pulse">Loading...</span>
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
  const mainRef = useRef<HTMLElement>(null);
  const [adLayout, setAdLayout] = useState<AdSize[]>(["standard"]);

  let activeTool = "home";
  const pathParts = pathname.split("/").filter(Boolean);

  if (pathname.includes("/privacy")) {
    activeTool = "privacy";
  } else if (pathname.includes("/terms")) {
    activeTool = "terms";
  } else if (pathParts.length === 2) {
    // Path looks like /financecalculators/tax-calculator
    activeTool = pathParts[1]; 
  }

  // ==========================================
  // INITIALIZATION: DARK MODE & REGION DETECT
  // ==========================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);

      // Region Detection using Timezone
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

      // Sync across components
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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // ==========================================
  // FILTER NAVIGATION BY REGION
  // ==========================================
  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => !t.regions || t.regions.includes(region) || t.regions.includes("Global"))
  })).filter(g => g.tools.length > 0);

  // Resize Observer for Ads
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      <header className="bg-slate-900 text-white h-16 flex items-center border-b-4 border-blue-600 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center w-full px-4 md:px-8 max-w-[1600px] mx-auto justify-between">
          
          <Link href="/" className="text-xl font-extrabold flex items-center gap-2.5 pr-6 whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              {/* Added width="20" and height="20" below to prevent the giant icon glitch */}
              <svg width="20" height="20" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Nexa<span className="text-sky-400">Kit</span></span>
          </Link>
          
          <nav className="flex-1 justify-center items-center gap-2 xl:gap-6 h-16 hidden lg:flex">
            {filteredNavGroups.map((g, idx) => (
              <div key={idx} className="relative group h-full flex items-center cursor-pointer">
                <div className="text-[12px] xl:text-sm font-semibold text-slate-300 group-hover:text-white transition flex items-center gap-1 whitespace-nowrap">
                  {g.group}
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 opacity-70 group-hover:opacity-100 transition transform group-hover:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <div className="absolute top-[64px] left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-b-lg shadow-xl min-w-[260px] overflow-hidden z-[100] py-2">
                  {g.tools.map((t) => {
                    const categorySlug = g.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                    
                    return (
                      <Link
                        key={t.id}
                        href={`/${categorySlug}/${t.id}`}
                        className={`block text-left px-5 py-3 text-sm transition ${
                          activeTool === t.id ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {t.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto lg:ml-6 shrink-0">
            {/* CUSTOM REGION SELECTOR WITH REAL FLAGS */}
            <div className="relative group hidden sm:block">
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-700 transition">
                {region === "Global" && <span>🌎 Global</span>}
                {region === "UK" && <><img src="https://flagcdn.com/w20/gb.png" width="16" alt="UK" className="rounded-[2px]" /> UK</>}
                {region === "US" && <><img src="https://flagcdn.com/w20/us.png" width="16" alt="US" className="rounded-[2px]" /> US</>}
                {region === "EU" && <><img src="https://flagcdn.com/w20/eu.png" width="16" alt="EU" className="rounded-[2px]" /> EU</>}
                {region === "CA" && <><img src="https://flagcdn.com/w20/ca.png" width="16" alt="CA" className="rounded-[2px]" /> Canada</>}
                {region === "AU" && <><img src="https://flagcdn.com/w20/au.png" width="16" alt="AU" className="rounded-[2px]" /> Australia</>}
                {region === "NZ" && <><img src="https://flagcdn.com/w20/nz.png" width="16" alt="NZ" className="rounded-[2px]" /> New Zealand</>}
                <svg className="w-4 h-4 opacity-70 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <div className="absolute top-full right-0 mt-1 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[160px] overflow-hidden z-[100] py-1">
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
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition ${
                      region === r.code ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {r.flag ? <img src={`https://flagcdn.com/w20/${r.flag}.png`} width="16" alt={r.code} className="rounded-[2px]" /> : <span>🌎</span>}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 dark:text-sky-300 transition-all flex items-center justify-center focus:outline-none shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <AdColumn side="left" layout={adLayout} />

        <main ref={mainRef} className="flex-1 flex flex-col p-4 md:p-10 w-full max-w-5xl mx-auto min-w-0">
          <LazyAd index={98} type="banner" />
          
          <div className="flex-1 pb-10">
            {children}
          </div>
          
          <LazyAd index={99} type="banner" />
        </main>

        <AdColumn side="right" layout={adLayout} />
      </div>

      <footer className="w-full bg-slate-900 border-t-4 border-slate-800 text-slate-400 py-10 text-center text-sm mt-auto relative z-50">
        
        {/* CSS Fix for Google Translate Widget */}
        <style dangerouslySetInnerHTML={{__html: `
          .skiptranslate > iframe.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-te-gadget { color: transparent !important; font-size: 0px !important; display: flex; align-items: center; justify-content: center; }
          .goog-te-gadget img, .goog-te-gadget span { display: none !important; }
          .goog-te-combo { color: #cbd5e1; background-color: #1e293b; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: 600; outline: none; border: 1px solid #334155; cursor: pointer; margin: 0 !important; }
        `}} />
        
        <div className="flex flex-col items-center justify-center gap-4 mb-6 px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/" className="hover:text-white transition">Home Dashboard</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
          
          {/* GOOGLE TRANSLATE WIDGET MOVED HERE */}
          <div id="google_translate_element" className="mt-2"></div>
        </div>
        
        <p>&copy; {new Date().getFullYear()} NexaKit Suite. All rights reserved.</p>
      </footer>

    </div>
  );
}