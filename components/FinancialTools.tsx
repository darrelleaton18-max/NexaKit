"use client";

import IncomeTaxCalculator from "./FinancialTools/IncomeTaxCalculator";
import CurrencyConverter from "./FinancialTools/CurrencyConverter";
import MortgageCalculator from "./FinancialTools/MortgageCalculator";
import CompoundInterest from "./FinancialTools/CompoundInterest";

export default function FinancialTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <IncomeTaxCalculator activeTool={activeTool} />
      <CurrencyConverter activeTool={activeTool} />
      <MortgageCalculator activeTool={activeTool} />
      <CompoundInterest activeTool={activeTool} />
    </>
  );
}