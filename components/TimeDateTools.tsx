"use client";

import Stopwatch from "./TimeDateTools/Stopwatch";
import CountdownTimer from "./TimeDateTools/CountdownTimer";
import DateDifference from "./TimeDateTools/DateDifference";
import AgeCalculator from "./TimeDateTools/AgeCalculator";
import WorldClock from "./TimeDateTools/WorldClock";

export default function TimeDateTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <Stopwatch activeTool={activeTool} />
      <CountdownTimer activeTool={activeTool} />
      <DateDifference activeTool={activeTool} />
      <AgeCalculator activeTool={activeTool} />
      <WorldClock activeTool={activeTool} />
    </>
  );
}