"use client";

import { useState, useEffect } from "react";

export default function ColorConverter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "color-conv") return null;

  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");

  const hexToRgb = (hexVal: string) => {
    let h = hexVal.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const num = parseInt(h, 16);
    return isNaN(num) ? null : { r: num >> 16, g: (num >> 8) & 255, b: num & 255 };
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val)) {
      const parsedRgb = hexToRgb(val);
      if (parsedRgb) {
        setRgb(`rgb(${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b})`);
        
        // Approximate HSL for display
        let r = parsedRgb.r / 255, g = parsedRgb.g / 255, b = parsedRgb.b / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Color Space Converter</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert color codes instantly and preview them.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">HEX Code</label>
            <div className="flex gap-2">
              <input type="color" value={hex.length === 7 ? hex : "#ffffff"} onChange={(e) => handleHexChange(e.target.value)} className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0" />
              <input type="text" value={hex} onChange={(e) => handleHexChange(e.target.value)} className="flex-1 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-mono uppercase" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">RGB Format</label>
            <input readOnly value={rgb} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-slate-400 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 dark:text-slate-300">HSL Format</label>
            <input readOnly value={hsl} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg dark:text-slate-400 font-mono" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold dark:text-slate-300">Live Preview</label>
          <div 
            className="flex-1 min-h-[200px] w-full rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 transition-colors duration-200"
            style={{ backgroundColor: /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex) ? hex : 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
}