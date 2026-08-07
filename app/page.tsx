"use client";

import { useState, useEffect, useRef } from "react";

// Import all of our newly extracted tool components!
import FinancialTools from "../components/FinancialTools";
import MathTools from "../components/MathTools";
import TimeDateTools from "../components/TimeDateTools";
import TextTools from "../components/TextTools";
import DevTools from "../components/DevTools";
import RandomTools from "../components/RandomTools";
import ImageTools from "../components/ImageTools";
import JpgTools from "../components/JpgTools";
import GifTools from "../components/GifTools";

// ==========================================
// 💵 LAZY LOADED DYNAMIC AD COMPONENTS
// ==========================================
type AdSize = "skyscraper" | "standard" | "banner";

const LazyAd = ({ index, type }: { index: number; type: AdSize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 🌍 GOOGLE TRANSLATE WIDGET INITIALIZATION
  // ==========================================
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
        className={`w-full max-w-[728px] h-[90px] mx-auto mt-8 mb-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-2 transition-all duration-700 shadow-sm ${
          isVisible 
            ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" 
            : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
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
        isVisible 
          ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" 
          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
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

// ==========================================
// 🛠️ NAVIGATION & MENU CONFIGURATION
// ==========================================
const navGroups = [
  {
    group: "💰 Finance",
    tools: [
      { id: "tax-calculator", label: "Income Tax Calculator" },
      { id: "currency-converter", label: "Live Currency Converter" },
      { id: "loan-calc", label: "Mortgage / Loan Calc" },
      { id: "compound-calc", label: "Compound Interest Calc" },
    ],
  },
  {
    group: "🧮 Math",
    tools: [
      { id: "pct-calc", label: "Percentage Calculator" },
      { id: "unit-converter", label: "Metric / Unit Converter" },
      { id: "stats-calc", label: "Statistics Calculator" },
      { id: "prime-gen", label: "Prime Number Generator" },
      { id: "base-converter", label: "Number Base Converter" },
    ],
  },
  {
    group: "⏱️ Time",
    tools: [
      { id: "stopwatch", label: "Precision Stopwatch" },
      { id: "countdown", label: "Countdown Timer" },
      { id: "date-diff", label: "Date Difference Calc" },
      { id: "age-calc", label: "Age Calculator" },
      { id: "timezone", label: "World Clock / Timezones" },
    ],
  },
  {
    group: "📝 Text",
    tools: [
      { id: "word-counter", label: "Word & Character Counter" },
      { id: "case-converter", label: "Text Case Converter" },
      { id: "list-tools", label: "List Sorter & Deduplicator" },
      { id: "find-replace", label: "Find & Replace Text" },
      { id: "lorem-gen", label: "Dummy Lorem Generator" },
      { id: "lang-converter", label: "Language Converter" },
    ],
  },
  {
    group: "🛠️ Dev",
    tools: [
      { id: "json-formatter", label: "JSON Formatter / Minify" },
      { id: "base64", label: "Base64 Encoder / Decoder" },
      { id: "password-gen", label: "Key & Password Generator" },
      { id: "qr-maker", label: "QR Code Generator" },
    ],
  },
  {
    group: "🎲 Random",
    tools: [
      { id: "username-gen", label: "Random Username Gen" },
      { id: "number-gen", label: "Random Number Gen" },
      { id: "wheel-gen", label: "Spinning Decision Wheel" },
      { id: "fact-gen", label: "Random Fact Generator" },
      { id: "random-picker", label: "Unbiased Random Picker" },
    ],
  },
  {
  group: "🖼️ Media",
  tools: [
    { id: "image-tools", label: "PNG & Image Studio" },
    { id: "jpg-tools", label: "JPEG Optimizer" },
    { id: "gif-tools", label: "GIF Converter" },
  ],
},
];

export default function Home() {
  const [activeTool, setActiveTool] = useState("home"); 
  const [isDark, setIsDark] = useState(false);

  // System-aware initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Guarantee theme background switches globally
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
    }
  }, [isDark]);

  // ==========================================
  // 📏 PAGE SIZE AD OPTIMIZATION ALGORITHM
  // ==========================================
  const mainRef = useRef<HTMLElement>(null);
  const [adLayout, setAdLayout] = useState<AdSize[]>(["standard"]);

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
            bestLayout = [
              ...Array(tallAds).fill("skyscraper"),
              ...Array(shortAds).fill("standard")
            ];
          }
        }
        
        if (bestLayout.length === 0) bestLayout = ["standard"];
        setAdLayout((prev) => JSON.stringify(prev) === JSON.stringify(bestLayout) ? prev : bestLayout);
      }
    });

    resizeObserver.observe(mainRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTool]); 

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* ========================================== */}
      {/* TOP NAVIGATION HEADER WITH DROPDOWNS       */}
      {/* ========================================== */}
      <header className="bg-slate-900 text-white h-16 flex items-center border-b-4 border-blue-600 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center w-full px-4 md:px-8 max-w-[1600px] mx-auto justify-between">
          
          <a href="#" onClick={() => setActiveTool("home")} className="text-xl font-extrabold flex items-center gap-2.5 pr-6 whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Nexa<span className="text-sky-400">Kit</span></span>
          </a>
          
          <nav className="flex-1 justify-center items-center gap-2 xl:gap-6 h-16 hidden lg:flex">
            {navGroups.map((g, idx) => (
              <div key={idx} className="relative group h-full flex items-center cursor-pointer">
                <div className="text-[12px] xl:text-sm font-semibold text-slate-300 group-hover:text-white transition flex items-center gap-1 whitespace-nowrap">
                  {g.group}
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 opacity-70 group-hover:opacity-100 transition transform group-hover:rotate-180 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <div className="absolute top-[64px] left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-b-lg shadow-xl min-w-[260px] overflow-hidden z-[100] py-2">
                  {g.tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`text-left px-5 py-3 text-sm transition ${
                        activeTool === t.id ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto lg:ml-6 shrink-0">
            <style dangerouslySetInnerHTML={{__html: `
              .skiptranslate > iframe.skiptranslate { display: none !important; }
              body { top: 0px !important; }
              .goog-te-gadget { color: transparent !important; font-size: 0px !important; display: flex; align-items: center; margin-top: 2px; }
              .goog-te-gadget img, .goog-te-gadget span { display: none !important; }
              .goog-te-combo { color: #334155; background-color: #f8fafc; padding: 6px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; outline: none; border: 1px solid #cbd5e1; cursor: pointer; margin: 0 !important; }
              .dark .goog-te-combo { color: #cbd5e1; background-color: #1e293b; border-color: #334155; }
            `}} />
            <div id="google_translate_element" className="hidden sm:block"></div>

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

      {/* ========================================== */}
      {/* PAGE LAYOUT WITH DYNAMIC AD COLUMNS        */}
      {/* ========================================== */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <AdColumn side="left" layout={adLayout} />

        <main ref={mainRef} className="flex-1 flex flex-col p-4 md:p-10 w-full max-w-5xl mx-auto min-w-0">
          <LazyAd index={98} type="banner" />

          <div className="flex-1">
            {/* TOOL 0: HOME DASHBOARD */}
            {activeTool === "home" && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                <div className="text-center py-6 md:py-10">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to <span className="text-blue-600 dark:text-sky-400">NexaKit</span></h1>
                  <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Select any of our 30 premium web utilities below to instantly format data, calculate finances, track time, or manage your everyday development needs.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {navGroups.map((group, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">{group.group}</h2>
                      <div className="flex flex-col gap-2">
                        {group.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className="text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-sky-300 font-semibold text-sm transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 flex items-center justify-between group"
                          >
                            {tool.label}
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEGAL PAGES */}
            {activeTool === "privacy" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 dark:text-white">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Last updated: August 6, 2026</p>
                <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">1. Information We Collect</h2>
                    <p>NexaKit is designed as a client-side utility suite. The vast majority of our tools (such as the calculators, text formatters, and converters) process your data locally within your browser. We do not store or transmit your inputted text, files, or financial numbers to our servers.</p>
                  </section>
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">2. Google AdSense & Cookies</h2>
                    <p>To keep NexaKit free, we use Google AdSense to display advertisements. AdSense uses cookies to serve ads based on your prior visits to our website or other websites on the internet.</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                      <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
                      <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-sky-400 hover:underline">Google's Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-sky-400 hover:underline">www.aboutads.info</a>.</li>
                    </ul>
                  </section>
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">3. Third-Party APIs</h2>
                    <p>Some tools, such as the Live Currency Converter or the Translation Tool, rely on external APIs (like Open Exchange Rates or MyMemory Translation). When you use these specific tools, your browser makes direct requests to these third-party services, which may log your IP address in accordance with their own respective privacy policies.</p>
                  </section>
                </div>
              </div>
            )}

            {activeTool === "terms" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 dark:text-white">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Last updated: August 6, 2026</p>
                <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">1. Acceptance of Terms</h2>
                    <p>By accessing and using NexaKit, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our tools.</p>
                  </section>
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">2. Disclaimer of Warranties</h2>
                    <p>All utilities provided by NexaKit, including financial calculators and data converters, are provided "as is" without warranty of any kind. While we strive for accuracy, we do not guarantee that the results generated by our tools are 100% accurate, complete, or reliable. You should independently verify any critical financial or technical data before making decisions based upon it.</p>
                  </section>
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">3. Limitation of Liability</h2>
                    <p>In no event shall NexaKit or its creators be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our tools.</p>
                  </section>
                </div>
              </div>
            )}

            {/* EXTRACTED TOOL COMPONENTS */}
            <FinancialTools activeTool={activeTool} />
            <MathTools activeTool={activeTool} />
            <TimeDateTools activeTool={activeTool} />
            <TextTools activeTool={activeTool} />
            <DevTools activeTool={activeTool} />
            <RandomTools activeTool={activeTool} />
            <ImageTools activeTool={activeTool} isDark={isDark} />
            <JpgTools activeTool={activeTool} isDark={isDark} />
            <GifTools activeTool={activeTool} isDark={isDark} />

          </div>
          
          <LazyAd index={99} type="banner" />
        </main>

        <AdColumn side="right" layout={adLayout} />
      </div>

      {/* ========================================== */}
      {/* SITE FOOTER                                */}
      {/* ========================================== */}
      <footer className="w-full bg-slate-900 border-t-4 border-slate-800 text-slate-400 py-8 text-center text-sm mt-auto relative z-50">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-3 px-4">
          <button onClick={() => setActiveTool("home")} className="hover:text-white transition">Home Dashboard</button>
          <button onClick={() => setActiveTool("privacy")} className="hover:text-white transition">Privacy Policy</button>
          <button onClick={() => setActiveTool("terms")} className="hover:text-white transition">Terms of Service</button>
        </div>
        <p>&copy; {new Date().getFullYear()} NexaKit Suite. All rights reserved.</p>
      </footer>

    </div>
  );
}