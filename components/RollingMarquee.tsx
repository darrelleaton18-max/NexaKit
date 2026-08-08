"use client";

import Link from "next/link";

const marqueeItems = [
  { label: "⚡ 100% In-Browser Processing", link: null, type: "badge" },
  { label: "🧮 Live Currency Converter", link: "/tool/currency-converter", type: "tool" },
  { label: "🔒 Zero Server Uploads", link: null, type: "badge" },
  { label: "📱 QR Code Generator", link: "/tool/qr-maker", type: "tool" },
  { label: "🎯 Spinning Decision Wheel", link: "/tool/wheel-gen", type: "tool" },
  { label: "💡 No Signup Required", link: null, type: "badge" },
  { label: "📊 Net Worth Tracker", link: "/tool/net-worth", type: "tool" },
  { label: "🎲 3D Dice Roller & Coin Flip", link: "/tool/dice-coin", type: "tool" },
  { label: "🛡️ Bank Fee & Leak Auditor", link: "/tool/fee-auditor", type: "tool" },
  { label: "✨ Instant Performance", link: null, type: "badge" },
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
          
          if (item.type === "tool") {
            // Interactive Tool Pill
            return (
              <Link 
                key={idx} 
                href={item.link!} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-all hover:border-blue-500 dark:hover:border-sky-400 hover:shadow-md group"
              >
                <span>{item.label}</span>
                <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors text-[10px]">
                  &rarr;
                </span>
              </Link>
            );
          }

          // Static Trust Feature Badge (Using the header gradient color!)
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