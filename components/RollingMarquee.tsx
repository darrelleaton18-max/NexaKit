"use client";

import React from "react";

const marqueeItems = [
  { text: "Live Currency Converter", highlight: false, icon: "💱" },
  { text: "Zero Server Uploads", highlight: true, icon: "🔒" },
  { text: "QR Code Generator", highlight: false, icon: "📱" },
  { text: "Spinning Decision Wheel", highlight: false, icon: "🎯" },
  { text: "No Signup Required", highlight: true, icon: "💡" },
  { text: "PDF Studio", highlight: false, icon: "📄" },
  { text: "100% Private Workflows", highlight: true, icon: "🛡️" },
  { text: "Word & Character Counter", highlight: false, icon: "📝" },
  { text: "Income Tax Calculator", highlight: false, icon: "💰" },
  { text: "Instant Local Execution", highlight: true, icon: "⚡" },
];

export default function RollingMarquee() {
  // Tripling the array creates a perfectly seamless infinite scroll loop
  const scrollItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden flex relative py-2 mask-edges">
      
      {/* Zero-config CSS for the marquee animation and smooth edge fading. Hover pause removed. */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333333%); } 
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
      
      <div className="animate-marquee gap-3 md:gap-4 pl-3 md:pl-4">
        {scrollItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-transform cursor-default select-none ${
              item.highlight
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20 border border-orange-400/30"
                : "bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/[0.05] text-neutral-600 dark:text-neutral-300 shadow-sm"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
            
            {!item.highlight && (
              <span className="text-neutral-400 dark:text-neutral-600 font-normal ml-0.5">→</span>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}