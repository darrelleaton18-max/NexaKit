"use client";

import { useState } from "react";

export default function RandomTools({ activeTool }: { activeTool: string }) {
  // If a random tool isn't active, don't render anything or run logic
  if (!["username-gen", "number-gen", "wheel-gen", "fact-gen", "random-picker"].includes(activeTool)) {
    return null;
  }

  // ==========================================
  // 1. RANDOM USERNAME GENERATOR STATE
  // ==========================================
  const [usernameOutput, setUsernameOutput] = useState("Click Generate");
  
  const generateUsername = () => {
    const adjectives = ["Cool", "Happy", "Fast", "Smart", "Brave", "Mighty", "Clever", "Swift", "Fierce", "Wild", "Cosmic", "Neon", "Cyber", "Quantum"];
    const nouns = ["Tiger", "Dragon", "Eagle", "Falcon", "Shark", "Wolf", "Bear", "Lion", "Panther", "Fox", "Ninja", "Rider", "Pilot", "Ghost"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9999);
    setUsernameOutput(`${adj}${noun}${num}`);
  };

  // ==========================================
  // 2. RANDOM NUMBER GENERATOR STATE
  // ==========================================
  const [numMin, setNumMin] = useState<number | "">(1);
  const [numMax, setNumMax] = useState<number | "">(100);
  const [numCount, setNumCount] = useState<number | "">(1);
  const [numResult, setNumResult] = useState("");
  
  const generateNumbers = () => {
    const min = Number(numMin) || 0;
    const max = Number(numMax) || 100;
    const count = Math.max(1, Math.min(100, Number(numCount) || 1));
    if (min > max) return setNumResult("Min must be less than Max");
    let res = [];
    for (let i = 0; i < count; i++) {
      res.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    setNumResult(res.join(", "));
  };

  // ==========================================
  // 3. SPINNING DECISION WHEEL STATE
  // ==========================================
  const [wheelInput, setWheelInput] = useState("Pizza\nBurgers\nTacos\nSushi");
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWinner, setWheelWinner] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  
  const wheelOptions = wheelInput.split("\n").filter((o) => o.trim() !== "");

  const spinWheel = () => {
    if (wheelOptions.length < 2 || isSpinning) return;
    setIsSpinning(true);
    setWheelWinner("");
    
    const spins = Math.floor(Math.random() * 5) + 5; 
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = wheelRotation + (spins * 360) + randomDegree;
    
    setWheelRotation(totalRotation);

    setTimeout(() => {
      const actualDeg = totalRotation % 360;
      const sliceSize = 360 / wheelOptions.length;
      const normalizedDeg = (360 - actualDeg) % 360;
      const winningIndex = Math.floor(normalizedDeg / sliceSize);
      setWheelWinner(wheelOptions[winningIndex]);
      setIsSpinning(false);
    }, 3000); 
  };

  const wheelColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const gradientStops = wheelOptions.map((opt, i) => {
    const start = (i * 100) / wheelOptions.length;
    const end = ((i + 1) * 100) / wheelOptions.length;
    const color = wheelColors[i % wheelColors.length];
    return `${color} ${start}% ${end}%`;
  }).join(", ");

  // ==========================================
  // 4. RANDOM FACT GENERATOR STATE
  // ==========================================
  const factsList = [
    "Honey never spoils; archaeologists have found 3,000-year-old edible honey in ancient Egyptian tombs.",
    "Bananas are botanical berries, but strawberries are not.",
    "A day on Venus is longer than a year on Venus.",
    "Wombat poop is cube-shaped to prevent it from rolling away.",
    "Octopuses have three hearts, nine brains, and blue blood.",
    "The Eiffel Tower can grow up to 15 cm (6 inches) taller during the summer due to thermal expansion.",
    "A group of flamingos is officially known as a 'flamboyance'.",
    "Cleopatra lived closer in time to the Apollo 11 Moon landing than to the construction of the Great Pyramid of Giza.",
    "Sharks existed before trees—sharks are over 400 million years old, while trees evolved around 350 million years ago.",
    "Nintendo was originally founded in 1889 as a hanafuda playing card company in Kyoto, Japan.",
    "Sloths can hold their breath underwater for up to 40 minutes, which is longer than dolphins.",
    "There are roughly 3 trillion trees on Earth, compared to about 100 billion stars in the Milky Way galaxy.",
    "Sea otters hold hands while sleeping to keep from drifting apart in ocean currents.",
    "Scotland has over 420 distinct words and terms for 'snow'.",
    "The heart of a shrimp is located inside its head.",
    "An average cumulus cloud weighs around 1.1 million pounds (500,000 kg).",
    "Venus is the only planet in our solar system that rotates clockwise.",
    "Cows have best friends and experience measurable stress when separated from them.",
    "The Alaskan Wood Frog can freeze solid during winter and thaw back to life in spring.",
    "Pigeons can be trained to distinguish between paintings by Monet and Picasso."
  ];

  const [currentFact, setCurrentFact] = useState("Click the button below to reveal a mind-blowing random fact!");

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * factsList.length);
    setCurrentFact(factsList[randomIndex]);
  };

  // ==========================================
  // 5. UNBIASED RANDOM PICKER STATE
  // ==========================================
  const [pickerInput, setPickerInput] = useState("");
  const [pickerResult, setPickerResult] = useState("None");

  return (
    <>
      {activeTool === "username-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Username Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate cool, unique usernames for gaming, social media, and forums.</p>
          
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-6 md:p-8 rounded-xl mb-6 flex items-center justify-center min-h-[120px]">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-600 dark:text-sky-400 tracking-tight break-all">{usernameOutput}</span>
          </div>
          
          <button onClick={generateUsername} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-sm">
            Generate Username
          </button>
        </div>
      )}

      {activeTool === "number-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Number Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate a single random number or a sequence within a specific range.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Min Value</label>
              <input type="number" value={numMin} onChange={(e) => setNumMin(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Max Value</label>
              <input type="number" value={numMax} onChange={(e) => setNumMax(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">How Many?</label>
              <input type="number" min="1" max="100" value={numCount} onChange={(e) => setNumCount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
            </div>
          </div>

          <button onClick={generateNumbers} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg mb-6 w-full sm:w-auto">
            Generate Numbers
          </button>

          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[100px] flex items-center justify-center">
            <span className="text-xl md:text-2xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all text-center">
              {numResult || "Ready to roll..."}
            </span>
          </div>
        </div>
      )}

      {activeTool === "wheel-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Spinning Decision Wheel</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Input your choices and spin the wheel to let fate decide.</p>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Wheel Options (One per line)</label>
              <textarea 
                value={wheelInput} 
                onChange={(e) => setWheelInput(e.target.value)} 
                className="w-full h-48 md:h-64 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white whitespace-pre-wrap resize-none" 
              />
              <button 
                onClick={spinWheel} 
                disabled={isSpinning || wheelOptions.length < 2}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-colors"
              >
                {isSpinning ? "Spinning..." : "SPIN THE WHEEL!"}
              </button>
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-slate-800 dark:border-t-white drop-shadow-md"></div>
                
                <div 
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-slate-800 dark:border-white relative overflow-hidden shadow-lg transition-transform ease-out"
                  style={{ 
                    background: `conic-gradient(${gradientStops})`,
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionDuration: isSpinning ? "3000ms" : "0ms"
                  }}
                >
                  {wheelOptions.map((opt, i) => {
                    const rotation = (i * 360) / wheelOptions.length + (360 / wheelOptions.length) / 2;
                    return (
                      <div key={i} className="absolute inset-0 flex items-start justify-center origin-center" style={{ transform: `rotate(${rotation}deg)` }}>
                        <span className="mt-6 font-bold text-white drop-shadow-md truncate w-24 text-center text-sm">{opt}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="h-12 flex items-center justify-center">
                {wheelWinner && !isSpinning && (
                  <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Winner</span>
                    <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 px-6 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 text-center break-all">{wheelWinner}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === "fact-gen" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Random Fact Generator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Discover fascinating, quirky, and surprising trivia with every click.</p>
          
          <div className="bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 p-6 md:p-8 rounded-2xl mb-6 flex items-center justify-center min-h-[140px] shadow-inner">
            <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 max-w-2xl leading-relaxed italic">
              "{currentFact}"
            </p>
          </div>
          
          <button onClick={getRandomFact} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-sm transition-all transform active:scale-95">
            Get Another Fact
          </button>
        </div>
      )}

      {activeTool === "random-picker" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Unbiased Random Picker</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Input a list of options and let the tool pick one at random without visuals.</p>
          <textarea value={pickerInput} onChange={(e) => setPickerInput(e.target.value)} placeholder={"Option 1\nOption 2"} className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
          <button onClick={() => { const opts = pickerInput.split("\n").filter(Boolean); setPickerResult(opts.length ? opts[Math.floor(Math.random() * opts.length)] : "No options!"); }} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-6">Pick Option</button>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-bold"><span className="dark:text-slate-300">Selected:</span><span className="text-blue-600 dark:text-sky-400 break-all">{pickerResult}</span></div>
        </div>
      )}
    </>
  );
}