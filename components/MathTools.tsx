"use client";

import PercentageCalculator from "./MathTools/PercentageCalculator";
import UnitConverter from "./MathTools/UnitConverter";
import StatisticsCalculator from "./MathTools/StatisticsCalculator";
import PrimeGenerator from "./MathTools/PrimeGenerator";
import BaseConverter from "./MathTools/BaseConverter";

export default function MathTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <PercentageCalculator activeTool={activeTool} />
      <UnitConverter activeTool={activeTool} />
      <StatisticsCalculator activeTool={activeTool} />
      <PrimeGenerator activeTool={activeTool} />
      <BaseConverter activeTool={activeTool} />
    </>
  );
}