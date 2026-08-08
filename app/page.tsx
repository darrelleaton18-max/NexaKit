"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navGroups } from "../components/navData";

export default function Home() {
  const [region, setRegion] = useState("Global");

  // Listen to the Global Region state
  useEffect(() => {
    const handleRegionSync = () => {
      setRegion(localStorage.getItem("nexaRegion") || "Global");
    };
    
    // Run once on mount to get initial value
    handleRegionSync();
    
    window.addEventListener("regionChange", handleRegionSync);
    return () => window.removeEventListener("regionChange", handleRegionSync);
  }, []);

  // Filter the tools based on the selected region
  const filteredNavGroups = navGroups.map(g => ({
    ...g,
    tools: g.tools.filter(t => !t.regions || t.regions.includes(region) || t.regions.includes("Global"))
  })).filter(g => g.tools.length > 0);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div className="text-center py-6 md:py-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to <span className="text-blue-600 dark:text-sky-400">NexaKit</span></h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Select any of our 30 premium web utilities below to instantly format data, calculate finances, track time, or manage your everyday development needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <Link href="/tool/currency-converter" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=600&h=300" alt="Currency Converter" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-blue-600/90 px-2 py-1 rounded">Popular</span>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">Live Currency Converter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Convert global currencies with real-time mid-market exchange rates and historic charts.</p>
          </div>
        </Link>
        <Link href="/tool/qr-maker" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=300" alt="QR Code Generator" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-emerald-600/90 px-2 py-1 rounded">Utility</span>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">QR Code Generator</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Instantly create and download custom scannable QR codes for links, text, and contact info.</p>
          </div>
        </Link>
        <Link href="/tool/wheel-gen" className="group flex flex-col text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600&h=300" alt="Spinning Decision Wheel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute bottom-3 left-4 text-white font-bold tracking-wider uppercase text-[10px] bg-amber-500/90 px-2 py-1 rounded">Fun</span>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Spinning Decision Wheel</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Can't decide? Enter your options and let the random physics wheel choose for you.</p>
          </div>
        </Link>
      </div>
      
      <div className="flex flex-col gap-8">
        {filteredNavGroups.map((group, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">{group.group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tool/${tool.id}`}
                  className="text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-sky-300 font-semibold text-sm transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 flex items-center justify-between group hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="leading-tight pr-2">{tool.label}</span>
                  <svg className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}