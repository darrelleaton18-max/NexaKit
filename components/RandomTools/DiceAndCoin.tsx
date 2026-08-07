"use client";

import { useState } from "react";

export default function DiceAndCoin({ activeTool }: { activeTool: string }) {
  if (activeTool !== "dice-coin") return null;

  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const [diceType, setDiceType] = useState(6);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "HEADS" : "TAILS";
      setCoinResult(outcome);
      setIsFlipping(false);
    }, 400); // UI visual delay
  };

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const outcome = (array[0] % diceType) + 1;
      setDiceResult(outcome);
      setIsRolling(false);
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Dice Roller & Coin Flipper</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Need to settle a debate or roll for initiative?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coin Flip Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-widest text-xs">Coin Flipper</h3>
          
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 transition-transform duration-300 ${isFlipping ? 'animate-spin border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700 text-transparent' : 'border-amber-400 bg-amber-100 dark:border-amber-600 dark:bg-amber-900/30'}`}>
            <span className={`text-2xl font-black ${coinResult === 'HEADS' ? 'text-blue-600 dark:text-sky-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {!isFlipping ? coinResult || "?" : "?"}
            </span>
          </div>

          <button onClick={flipCoin} disabled={isFlipping} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-transform active:scale-95 disabled:opacity-50">
            Flip Coin
          </button>
        </div>

        {/* Dice Roll Section */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-widest text-xs">Dice Roller</h3>
          
          <div className="flex gap-2 mb-4 flex-wrap justify-center">
            {[4, 6, 8, 10, 12, 20].map(d => (
              <button 
                key={d} 
                onClick={() => setDiceType(d)} 
                className={`px-3 py-1 text-xs font-bold rounded-md border transition-colors ${diceType === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
              >
                D{d}
              </button>
            ))}
          </div>

          <div className={`w-24 h-24 rounded-2xl border-4 flex items-center justify-center mb-6 transition-transform duration-300 ${isRolling ? 'animate-bounce border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700 text-transparent' : 'border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30'}`}>
             <span className="text-4xl font-black font-mono text-blue-700 dark:text-sky-300">
               {!isRolling ? diceResult || "-" : "-"}
             </span>
          </div>

          <button onClick={rollDice} disabled={isRolling} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-transform active:scale-95 disabled:opacity-50">
            Roll D{diceType}
          </button>
        </div>
      </div>
    </div>
  );
}