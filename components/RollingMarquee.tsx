"use client";

import Link from "next/link";
import { navGroups } from "./navData";

// Notice we changed 'link' to 'id' so we can look up the correct folder dynamically!
const marqueeItems = [
  { label: "⚡ 100% In-Browser Processing", id: null, type: "badge" },
  { label: "🧮 Live Currency Converter", id: "currency-converter", type: "tool" },
  { label: "🔒 Zero Server Uploads", id: null, type: "badge" },
  { label: "📱 QR Code Generator", id: "qr-maker", type: "tool" },
  { label: "🎯 Spinning Decision Wheel", id: "wheel-gen", type: "tool" },
  { label: "💡 No Signup Required", id: null, type: "badge" },
  { label: "📊 Net Worth Tracker", id: "net-worth", type: "tool" },
  { label: "🎲 3D Dice Roller & Coin Flip", id: "dice-coin", type: "tool" },
  { label: "🛡️ Bank Fee & Leak Auditor", id: "fee-auditor", type: "tool" },
  { label: "✨ Instant Performance", id: null, type: "badge" },
];

export default function RollingMarquee() {
  return (
    <div className="w-full overflow-hidden bg-slate-100 dark:bg-slate-900/80 border-y border-slate-200 dark:border-slate-800 py-3.5 relative flex items-center my-2">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

      <div className="animate-marquee flex gap-4 items-center">
        {[...marqueeItems, ...marqueeItems].map((item, idx) => {
          
          if (item.type === "tool" && item.id) {
            // DYNAMIC ROUTING: Find the correct category slug automatically!
            let categorySlug = "tool"; 
            for (const group of navGroups) {
              if (group.tools.some(t => t.id === item.id)) {
                categorySlug = group.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
                break;
              }
            }
            const linkHref = `/${categorySlug}/${item.id}`;

            return (
              <Link 
                key={idx} 
                href={linkHref} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-all hover:border-blue-500 dark:hover:border-sky-400 hover:shadow-md group"
              >
                <span>{item.label}</span>
                <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors text-[10px]">
                  &rarr;
                </span>
              </Link>
            );
          }

          // Static Trust Feature Badge (Using the header gradient color)
          return (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 text-white text-xs font-bold shadow-xs whitespace-nowrap cursor-default select-none"
            >
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}