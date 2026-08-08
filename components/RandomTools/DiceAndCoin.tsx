"use client";

import { useState } from "react";

export default function DiceAndCoin({ activeTool }: { activeTool: string }) {
  if (activeTool !== "dice-coin") return null;

  // ==========================================
  // COIN FLIPPER STATE & LOGIC
  // ==========================================
  const [coinRotation, setCoinRotation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const isHeads = Math.random() > 0.5;
    // Add 4 to 7 full 360-degree spins for suspense
    const extraSpins = (Math.floor(Math.random() * 4) + 4) * 360; 
    // If Tails, add 180 degrees so it lands on the back face
    const landingOffset = isHeads ? 0 : 180; 
    const newRotation = coinRotation + extraSpins + landingOffset;

    setCoinRotation(newRotation);

    // Wait for the 2.5s CSS transition to finish before allowing another flip
    setTimeout(() => {
      setIsFlipping(false);
    }, 2500);
  };

  // ==========================================
  // DICE ROLLER STATE & LOGIC
  // ==========================================
  const [diceSides, setDiceSides] = useState(6);
  const [diceResult, setDiceResult] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [diceTransform, setDiceTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    let ticks = 0;
    // Rapidly tumble the die in 3D space
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * diceSides) + 1);
      
      // Randomly rotate all axes and scale up (bounce)
      setDiceTransform(`rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) scale(1.3)`);
      ticks++;

      if (ticks > 12) {
        clearInterval(rollInterval);
        setDiceResult(Math.floor(Math.random() * diceSides) + 1);
        // Snap back to flat view facing the user
        setDiceTransform("rotateX(0deg) rotateY(0deg) scale(1)"); 
        setIsRolling(false);
      }
    }, 100);
  };

  // Helper to draw actual dots (pips) for a standard D6, just like the video
  const renderDieFace = (val: number) => {
    if (diceSides !== 6) return <span className="text-5xl font-black text-white">{val}</span>;

    const dot = <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>;
    switch (val) {
      case 1: return <div className="flex items-center justify-center w-full h-full">{dot}</div>;
      case 2: return <div className="flex justify-between w-full h-full p-4"><div className="self-start">{dot}</div><div className="self-end">{dot}</div></div>;
      case 3: return <div className="flex justify-between w-full h-full p-4"><div className="self-start">{dot}</div><div className="self-center">{dot}</div><div className="self-end">{dot}</div></div>;
      case 4: return <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-4 place-items-center">{dot}{dot}{dot}{dot}</div>;
      case 5: return <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-4 place-items-center"><div className="col-start-1 row-start-1">{dot}</div><div className="col-start-3 row-start-1">{dot}</div><div className="col-start-2 row-start-2">{dot}</div><div className="col-start-1 row-start-3">{dot}</div><div className="col-start-3 row-start-3">{dot}</div></div>;
      case 6: return <div className="grid grid-cols-2 grid-rows-3 w-full h-full p-4 place-items-center">{dot}{dot}{dot}{dot}{dot}{dot}</div>;
      default: return null;
    }
  };

  const diceOptions = [4, 6, 8, 10, 12, 20];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Dice Roller & Coin Flipper</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Need to settle a debate or roll for initiative?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ========================================== */}
        {/* 3D COIN FLIPPER                            */}
        {/* ========================================== */}
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center justify-between overflow-hidden">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8 block">Coin Flipper</span>
          
          {/* 3D Perspective Container */}
          <div className="relative w-48 h-48 mb-10" style={{ perspective: '1000px' }}>
            <div
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${coinRotation}deg)`,
                transition: 'transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              {/* Front Face (HEADS - Indigo) */}
              <div
                className="absolute inset-0 rounded-full border-[10px] border-indigo-400 bg-indigo-600 flex items-center justify-center shadow-xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-4xl font-black text-white tracking-widest drop-shadow-md">HEADS</span>
              </div>
              
              {/* Back Face (TAILS - Pink) - Rotated 180deg by default */}
              <div
                className="absolute inset-0 rounded-full border-[10px] border-pink-400 bg-pink-500 flex items-center justify-center shadow-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              >
                <span className="text-4xl font-black text-white tracking-widest drop-shadow-md">TAILS</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={flipCoin} 
            disabled={isFlipping} 
            className="w-full py-4 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isFlipping ? "Flipping..." : "Flip Coin"}
          </button>
        </div>

        {/* ========================================== */}
        {/* 3D TUMBLING DICE ROLLER                    */}
        {/* ========================================== */}
        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center justify-between overflow-hidden">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 block">Dice Roller</span>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {diceOptions.map(sides => (
              <button 
                key={sides}
                onClick={() => { setDiceSides(sides); setDiceResult(sides); }}
                disabled={isRolling}
                className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${diceSides === sides ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-300 dark:border-slate-700'}`}
              >
                D{sides}
              </button>
            ))}
          </div>

          {/* 3D Perspective Container */}
          <div className="relative w-36 h-36 mb-10" style={{ perspective: '1000px' }}>
            <div 
              className="w-full h-full rounded-3xl bg-indigo-500 shadow-xl flex items-center justify-center transition-all"
              style={{
                transform: diceTransform,
                transitionDuration: isRolling ? '100ms' : '600ms',
                transitionTimingFunction: isRolling ? 'linear' : 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d',
                // Adding a fake 3D lip when flat
                boxShadow: isRolling ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' : 'inset 0 4px 0 rgba(255,255,255,0.2), 0 8px 0 #3730a3, 0 15px 20px rgba(0,0,0,0.4)'
              }}
            >
              {renderDieFace(diceResult)}
            </div>
          </div>
          
          <button 
            onClick={rollDice} 
            disabled={isRolling} 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-lg font-bold rounded-xl transition-transform active:scale-95 shadow-md"
          >
            {isRolling ? "Rolling..." : `Roll D${diceSides}`}
          </button>
        </div>

      </div>
    </div>
  );
}