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

    setTimeout(() => {
      setIsFlipping(false);
    }, 2500);
  };

  // ==========================================
  // TRUE 3D DICE ROLLER STATE & LOGIC
  // ==========================================
  const [diceSides, setDiceSides] = useState(6);
  const [diceResult, setDiceResult] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(1);
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0 });
  const [diceScale, setDiceScale] = useState(1);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    const result = Math.floor(Math.random() * diceSides) + 1;
    let targetX = 0;
    let targetY = 0;

    // If D6, calculate the precise 3D rotation to land on the correct face
    if (diceSides === 6) {
      switch (result) {
        case 1: targetX = 0; targetY = 0; break;       // Front
        case 6: targetX = 180; targetY = 0; break;     // Back
        case 2: targetX = -90; targetY = 0; break;     // Top
        case 5: targetX = 90; targetY = 0; break;      // Bottom
        case 3: targetX = 0; targetY = -90; break;     // Right
        case 4: targetX = 0; targetY = 90; break;      // Left
      }
    } else {
      // For non-D6, always land flat facing forward
      targetX = 0; 
      targetY = 0;
    }

    // Add extra wild tumbling spins (multiples of 360)
    const spinX = rollCount * 1080; // 3 extra vertical spins
    const spinY = rollCount * 1440; // 4 extra horizontal spins

    setDiceRotation({
      x: targetX + spinX,
      y: targetY + spinY
    });
    
    setRollCount(rc => rc + 1);

    // Make the dice "jump" toward the screen while tumbling
    setDiceScale(1.5);
    setTimeout(() => setDiceScale(1), 1200);

    // Rapidly cycle the number for non-D6 dice until it lands
    if (diceSides !== 6) {
      let ticks = 0;
      const interval = setInterval(() => {
        setDiceResult(Math.floor(Math.random() * diceSides) + 1);
        ticks++;
        if (ticks > 15) {
          clearInterval(interval);
          setDiceResult(result);
        }
      }, 100);
    } else {
      setDiceResult(result);
    }

    setTimeout(() => {
      setIsRolling(false);
    }, 2500);
  };

  // Helper to draw physical white dots (pips) for the 3D cube
  const renderDieFace = (val: number) => {
    const dot = <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>;
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

  // Physical 3D Face wrapper
  const DieFace = ({ value, transform }: { value: number, transform: string }) => (
    <div 
      className="absolute inset-0 rounded-2xl bg-indigo-500 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-indigo-400"
      style={{ transform, backfaceVisibility: 'hidden' }}
    >
      {renderDieFace(value)}
    </div>
  );

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
          
          <div className="relative w-48 h-48 mb-10" style={{ perspective: '1000px' }}>
            <div
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${coinRotation}deg)`,
                transition: 'transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <div className="absolute inset-0 rounded-full border-[10px] border-indigo-400 bg-indigo-600 flex items-center justify-center shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-4xl font-black text-white tracking-widest drop-shadow-md">HEADS</span>
              </div>
              
              <div className="absolute inset-0 rounded-full border-[10px] border-pink-400 bg-pink-500 flex items-center justify-center shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
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
        {/* TRUE 3D TUMBLING DICE ROLLER               */}
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

          <div className="relative w-28 h-28 mb-10" style={{ perspective: '1200px' }}>
            {/* Scale wrapper handles the "jump" toward the screen */}
            <div 
              className="w-full h-full"
              style={{
                transform: `scale(${diceScale})`,
                transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {/* Rotation wrapper handles the tumbling physics */}
              <div 
                className="w-full h-full relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg)`,
                  transition: 'transform 2.5s cubic-bezier(0.15, 0.85, 0.35, 1)'
                }}
              >
                {diceSides === 6 ? (
                  <>
                    {/* Width is 112px (w-28), so translateZ is half that (56px) to build a perfect cube */}
                    <DieFace value={1} transform="rotateY(0deg) translateZ(56px)" />
                    <DieFace value={6} transform="rotateY(180deg) translateZ(56px)" />
                    <DieFace value={2} transform="rotateX(90deg) translateZ(56px)" />
                    <DieFace value={5} transform="rotateX(-90deg) translateZ(56px)" />
                    <DieFace value={3} transform="rotateY(90deg) translateZ(56px)" />
                    <DieFace value={4} transform="rotateY(-90deg) translateZ(56px)" />
                  </>
                ) : (
                  <>
                    {/* Fallback tumbling tile for non-D6 dice */}
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500 shadow-inner flex items-center justify-center border-2 border-indigo-400" style={{ backfaceVisibility: 'hidden' }}>
                      <span className="text-5xl font-black text-white">{diceResult}</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-indigo-600 shadow-inner flex items-center justify-center border-2 border-indigo-500" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <span className="text-5xl font-black text-slate-300">{diceResult}</span>
                    </div>
                  </>
                )}
              </div>
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