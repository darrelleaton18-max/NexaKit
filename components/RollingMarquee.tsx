"use client";

import Link from "next/link";

const marqueeItems = [
  { label: "⚡ 100% In-Browser Processing", link: null },
  { label: "🧮 Live Currency Converter", link: "/tool/currency-converter" },
  { label: "🔒 Zero Server Uploads", link: null },
  { label: "📱 QR Code Generator", link: "/tool/qr-maker" },
  { label: "🎯 Spinning Decision Wheel", link: "/tool/wheel-gen" },
  { label: "💡 No Signup Required", link: null },
  { label: "📊 Net Worth Tracker", link: "/tool/net-worth" },
  { label: "🎲 3D Dice Roller & Coin Flip", link: "/tool/dice-coin" },
  { label: "🛡️ Bank Fee & Leak Auditor", link: "/tool/fee-auditor" },
  { label: "✨ Free & Instant", link: null },
];

export default function RollingMarquee() {
  return (
    <div className="w-full overflow-hidden bg-slate-100 dark:bg-slate-900/80 border-y border-slate-200 dark:border-slate-800 py-3 relative flex items-center my-2">
      
      {/* CSS Animation injection for smooth infinite scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Gradient fade edges for a professional look */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Container (duplicated twice to create seamless infinite loop) */}
      <div className="animate-marquee flex gap-4 items-center">
        {[...marqueeItems, ...marqueeItems].map((item, idx) => {
          const content = (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs border border-slate-200/80 dark:border-slate-700 whitespace-nowrap transition-all hover:border-blue-500 dark:hover:border-sky-400">
              {item.label}
            </span>
          );

          return item.link ? (
            <Link key={idx} href={item.link} className="transition-transform hover:scale-105">
              {content}
            </Link>
          ) : (
            <div key={idx} className="cursor-default">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}