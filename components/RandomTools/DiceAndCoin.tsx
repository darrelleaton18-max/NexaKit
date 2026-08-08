"use client";

import { useState } from "react";

export default function DiceAndCoin({ activeTool }: { activeTool: string }) {
  if (activeTool !== "dice-coin") return null;

  // Coin State
  const [coinResult, setCoinResult] = useState("?");
  const [isFlipping, setIsFlipping] = useState(false);

  // Dice State
  const [diceSides, setDiceSides] = useState(6);
  const [diceResult, setDiceResult] = useState("-");
  const [isRolling, setIsRolling] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    let ticks = 0;
    // Rapidly alternate heads/tails for suspense
    const interval = setInterval(() => {
      setCoinResult(ticks % 2 === 0 ? "HEADS" : "TAILS");
      ticks++;
      if (ticks > 15) {
        clearInterval(interval);
        setCoinResult(Math.random() > 0.5 ? "HEADS" : "TAILS");
        setIsFlipping(false);
      }
    }, 50);
  };

  const rollDice = () => {
    setIsRolling(true);
    let ticks = 0;
    // Rapidly shuffle numbers for suspense
    const interval = setInterval(() => {
      setDiceResult(String(Math.floor(Math.random() * diceSides) + 1));
      ticks++;
      if (ticks > 15) {
        clearInterval(interval);
        setDiceResult(String(Math.floor(Math.random() * diceSides) + 1));
        setIsRolling(false);
      }
    }, 50);
  };

  const diceOptions = [4, 6, 8, 10, 12, 20];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Dice Roller & Coin Flipper</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Need to settle a debate or roll for initiative?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COIN FLIPPER */}
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center justify-between">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 block">Coin Flipper</span>
          
          <div className={`w-32 h-32 rounded-full border-[6px] border-amber-500 bg-slate-800 flex items-center justify-center mb-8 shadow-lg transition-transform ${isFlipping ? 'scale-110' : 'scale-100'}`}>
            <span className={`text-2xl font-black text-emerald-400 transition-opacity ${isFlipping ? 'opacity-50' : 'opacity-100'}`}>
              {coinResult}
            </span>
          </div>
          
          <button 
            onClick={flipCoin} 
            disabled={isFlipping} 
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isFlipping ? "Flipping..." : "Flip Coin"}
          </button>
        </div>

        {/* DICE ROLLER */}
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center justify-between">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 block">Dice Roller</span>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {diceOptions.map(sides => (
              <button 
                key={sides}
                onClick={() => setDiceSides(sides)}
                className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${diceSides === sides ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800/80 text-slate-500 hover:text-slate-300 border border-slate-300 dark:border-slate-700'}`}
              >
                D{sides}
              </button>
            ))}
          </div>

          <div className={`w-24 h-24 rounded-2xl border-[6px] border-blue-600 bg-slate-800 flex items-center justify-center mb-8 shadow-lg transition-transform ${isRolling ? 'scale-110' : 'scale-100'}`}>
            <span className={`text-4xl font-black text-sky-400 transition-opacity ${isRolling ? 'opacity-50' : 'opacity-100'}`}>
              {diceResult}
            </span>
          </div>
          
          <button 
            onClick={rollDice} 
            disabled={isRolling} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isRolling ? "Rolling..." : `Roll D${diceSides}`}
          </button>
        </div>

      </div>
    </div>
  );
}