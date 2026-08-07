"use client";

import { useState } from "react";

export default function MortgageCalculator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "loan-calc") return null;

  const [loanAmount, setLoanAmount] = useState<number | "">(250000);
  const [loanInterest, setLoanInterest] = useState<number | "">(4.5);
  const [loanYears, setLoanYears] = useState<number | "">(25);

  const calculateLoan = () => {
    const P = Number(loanAmount) || 0, r = (Number(loanInterest) || 0) / 100 / 12, n = (Number(loanYears) || 0) * 12;
    if (!P || !r || !n) return { monthly: 0, totalPay: 0, interest: 0 };
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = monthly * n;
    return { monthly, totalPay, interest: totalPay - P };
  };
  
  const loanData = calculateLoan();
  const formatGeneric = (val: number) => new Intl.NumberFormat('en-GB', { style: "currency", currency: "GBP" }).format(val);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Mortgage & Loan Repayment Calculator</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Calculate monthly repayments, total interest, and the true cost of your mortgage or loan.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Loan Amount (£)</label><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Interest Rate (%)</label><input type="number" step="0.1" value={loanInterest} onChange={(e) => setLoanInterest(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
        <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Term (Years)</label><input type="number" value={loanYears} onChange={(e) => setLoanYears(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">MONTHLY PAYMENT</span><span className="block text-xl md:text-2xl font-black text-blue-900 dark:text-sky-200 mt-1">{formatGeneric(loanData.monthly)}</span></div>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center"><span className="text-xs text-slate-600 dark:text-slate-400 font-bold">TOTAL REPAID</span><span className="block text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{formatGeneric(loanData.totalPay)}</span></div>
        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl text-center"><span className="text-xs text-amber-600 dark:text-amber-400 font-bold">TOTAL INTEREST</span><span className="block text-xl md:text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">{formatGeneric(loanData.interest)}</span></div>
      </div>
    </div>
  );
}