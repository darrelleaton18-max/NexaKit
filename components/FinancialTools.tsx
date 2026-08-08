"use client";

import IncomeTaxCalculator from "./FinancialTools/IncomeTaxCalculator";
import CurrencyConverter from "./FinancialTools/CurrencyConverter";
import MortgageCalculator from "./FinancialTools/MortgageCalculator";
import CompoundInterest from "./FinancialTools/CompoundInterest";
import NetWorthTracker from "./FinancialTools/NetWorthTracker";
import BudgetPlanner from "./FinancialTools/BudgetPlanner";
import SubscriptionTracker from "./FinancialTools/SubscriptionTracker";
import DebtDashboard from "./FinancialTools/DebtDashboard";
import SavingsGoal from "./FinancialTools/SavingsGoal";

// 5 New Tools
import EnvelopeBudget from "./FinancialTools/EnvelopeBudget";
import TotalCompCalculator from "./FinancialTools/TotalCompCalculator";
import TimeToBuyPlanner from "./FinancialTools/TimeToBuyPlanner";
import BankFeeAuditor from "./FinancialTools/BankFeeAuditor";
import FreelanceExpenseLog from "./FinancialTools/FreelanceExpenseLog";

export default function FinancialTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <IncomeTaxCalculator activeTool={activeTool} />
      <CurrencyConverter activeTool={activeTool} />
      <MortgageCalculator activeTool={activeTool} />
      <CompoundInterest activeTool={activeTool} />
      <NetWorthTracker activeTool={activeTool} />
      <BudgetPlanner activeTool={activeTool} />
      <SubscriptionTracker activeTool={activeTool} />
      <DebtDashboard activeTool={activeTool} />
      <SavingsGoal activeTool={activeTool} />
      
      {/* New Additions */}
      <EnvelopeBudget activeTool={activeTool} />
      <TotalCompCalculator activeTool={activeTool} />
      <TimeToBuyPlanner activeTool={activeTool} />
      <BankFeeAuditor activeTool={activeTool} />
      <FreelanceExpenseLog activeTool={activeTool} />
    </>
  );
}