"use client";

import { useState, useEffect } from "react";

export default function FinancialTools({ activeTool }: { activeTool: string }) {
  if (!["tax-calculator", "currency-converter", "loan-calc", "compound-calc"].includes(activeTool)) {
    return null;
  }

  // ==========================================
  // 1. MASSIVE MULTI-REGION TAX ENGINE
  // ==========================================
  
  // Shared State
  const [taxCountry, setTaxCountry] = useState<"UK" | "US">("UK");
  const [salary, setSalary] = useState<number | "">(65000);
  const [salaryPeriod, setSalaryPeriod] = useState<"year" | "month" | "week" | "day" | "hour">("year");
  const [hoursPerWeek, setHoursPerWeek] = useState<number | "">(40);

  // UK Specific State
  const [region, setRegion] = useState<"rUK" | "scotland">("rUK");
  const [taxYear, setTaxYear] = useState("2024/25");
  const [isMarriedUK, setIsMarriedUK] = useState(false);
  const [isBlind, setIsBlind] = useState(false);
  const [niCategory, setNiCategory] = useState<"A" | "B" | "C" | "H" | "M">("A");
  const [studentLoan, setStudentLoan] = useState("none");
  const [pensionValue, setPensionValue] = useState<number | "">(5);
  const [pensionUnit, setPensionUnit] = useState<"%" | "£">("%");
  const [pensionType, setPensionType] = useState<"salSac" | "ras" | "netPay">("salSac");

  // US Specific State
  const [usFilingStatus, setUsFilingStatus] = useState<"single" | "married">("single");
  const [usStateTaxPct, setUsStateTaxPct] = useState<number | "">(4.5); // Average approximation
  const [us401kPct, setUs401kPct] = useState<number | "">(5);

  const resetTaxCalculator = () => {
    setSalary(65000); setSalaryPeriod("year"); setHoursPerWeek(40);
    setRegion("rUK"); setTaxYear("2024/25"); setIsMarriedUK(false); setIsBlind(false);
    setNiCategory("A"); setStudentLoan("none"); setPensionValue(5); setPensionUnit("%"); setPensionType("salSac");
    setUsFilingStatus("single"); setUsStateTaxPct(4.5); setUs401kPct(5);
  };

  const calculateTaxes = () => {
    // 1. Normalize Annual Gross
    let rawPay = Number(salary) || 0;
    let annualGross = rawPay;
    if (salaryPeriod === "month") annualGross = rawPay * 12;
    else if (salaryPeriod === "week") annualGross = rawPay * 52;
    else if (salaryPeriod === "day") annualGross = rawPay * 260;
    else if (salaryPeriod === "hour") annualGross = rawPay * (Number(hoursPerWeek) || 40) * 52;

    if (taxCountry === "US") {
      // ==========================================
      // UNITED STATES IRS TAX MATH (2024 Brackets)
      // ==========================================
      const _401k = annualGross * ((Number(us401kPct) || 0) / 100);
      const grossForTax = Math.max(0, annualGross - _401k);
      
      const standardDeduction = usFilingStatus === "single" ? 14600 : 29200;
      const taxableIncome = Math.max(0, grossForTax - standardDeduction);

      let federalTax = 0;
      let rem = taxableIncome;

      if (usFilingStatus === "single") {
        const b1 = Math.min(rem, 11600); federalTax += b1 * 0.10; rem -= b1;
        const b2 = Math.min(Math.max(rem, 0), 47150 - 11600); federalTax += b2 * 0.12; rem -= b2;
        const b3 = Math.min(Math.max(rem, 0), 100525 - 47150); federalTax += b3 * 0.22; rem -= b3;
        const b4 = Math.min(Math.max(rem, 0), 191950 - 100525); federalTax += b4 * 0.24; rem -= b4;
        const b5 = Math.min(Math.max(rem, 0), 243725 - 191950); federalTax += b5 * 0.32; rem -= b5;
        const b6 = Math.min(Math.max(rem, 0), 609350 - 243725); federalTax += b6 * 0.35; rem -= b6;
        if (rem > 0) federalTax += rem * 0.37;
      } else {
        const b1 = Math.min(rem, 23200); federalTax += b1 * 0.10; rem -= b1;
        const b2 = Math.min(Math.max(rem, 0), 94300 - 23200); federalTax += b2 * 0.12; rem -= b2;
        const b3 = Math.min(Math.max(rem, 0), 201050 - 94300); federalTax += b3 * 0.22; rem -= b3;
        const b4 = Math.min(Math.max(rem, 0), 383900 - 201050); federalTax += b4 * 0.24; rem -= b4;
        const b5 = Math.min(Math.max(rem, 0), 487450 - 383900); federalTax += b5 * 0.32; rem -= b5;
        const b6 = Math.min(Math.max(rem, 0), 731200 - 487450); federalTax += b6 * 0.35; rem -= b6;
        if (rem > 0) federalTax += rem * 0.37;
      }

      // FICA (Social Security 6.2% up to $168,600 + Medicare 1.45% + Add. Med 0.9% over 200k)
      const ssTax = Math.min(annualGross, 168600) * 0.062;
      let medTax = annualGross * 0.0145;
      if (usFilingStatus === "single" && annualGross > 200000) medTax += (annualGross - 200000) * 0.009;
      if (usFilingStatus === "married" && annualGross > 250000) medTax += (annualGross - 250000) * 0.009;
      const ficaTotal = ssTax + medTax;

      // State Tax (Simplified Approximation)
      const stateTax = annualGross * ((Number(usStateTaxPct) || 0) / 100);

      const totalDeductions = federalTax + ficaTotal + stateTax + _401k;
      return { 
        currency: "USD", symbol: "$",
        gross: annualGross, allowance: standardDeduction, pension: _401k, 
        tax1: federalTax, tax1Name: "Federal Tax",
        tax2: ficaTotal, tax2Name: "FICA (SS & Medicare)",
        tax3: stateTax, tax3Name: "State Tax (Est.)",
        deductions: totalDeductions, net: Math.max(0, annualGross - totalDeductions) 
      };

    } else {
      // ==========================================
      // UNITED KINGDOM HMRC TAX MATH
      // ==========================================
      let annualPension = 0;
      const penVal = Number(pensionValue) || 0;
      if (pensionUnit === "%") annualPension = annualGross * (penVal / 100);
      else annualPension = salaryPeriod === "month" ? penVal * 12 : salaryPeriod === "week" ? penVal * 52 : penVal;

      let grossForTax = annualGross;
      let grossForNI = annualGross;

      if (pensionType === "salSac") {
        grossForTax = Math.max(0, annualGross - annualPension);
        grossForNI = Math.max(0, annualGross - annualPension);
      } else if (pensionType === "netPay") {
        grossForTax = Math.max(0, annualGross - annualPension);
      }

      let baseAllowance = 12570;
      if (isBlind) baseAllowance += 3070;
      if (isMarriedUK) baseAllowance += 1260;
      if (grossForTax > 100000) baseAllowance = Math.max(0, baseAllowance - (grossForTax - 100000) / 2);

      let incomeTax = 0;
      const taxableIncome = Math.max(0, grossForTax - baseAllowance);

      if (region === "scotland") {
        let rem = taxableIncome;
        const b1 = Math.min(rem, 2306); incomeTax += b1 * 0.19; rem -= b1;
        const b2 = Math.min(rem, 11685); incomeTax += b2 * 0.20; rem -= b2;
        const b3 = Math.min(rem, 17101); incomeTax += b3 * 0.21; rem -= b3;
        const b4 = Math.min(rem, 31338); incomeTax += b4 * 0.42; rem -= b4;
        const b5 = Math.min(rem, 50140); incomeTax += b5 * 0.45; rem -= b5;
        if (rem > 0) incomeTax += rem * 0.48;
      } else {
        let rem = taxableIncome;
        const b1 = Math.min(rem, 37700); incomeTax += b1 * 0.20; rem -= b1;
        const b2 = Math.min(rem, 74870); incomeTax += b2 * 0.40; rem -= b2;
        if (rem > 0) incomeTax += rem * 0.45;
      }

      let ni = 0;
      let mainNiRate = niCategory === "C" ? 0 : niCategory === "B" ? 0.0185 : 0.08;
      let upperNiRate = niCategory === "C" ? 0 : 0.02;

      if (grossForNI > 12570 && mainNiRate > 0) ni += (Math.min(grossForNI, 50270) - 12570) * mainNiRate;
      if (grossForNI > 50270 && upperNiRate > 0) ni += (grossForNI - 50270) * upperNiRate;

      let slDeduction = 0;
      let slThreshold = studentLoan === "plan1" ? 24990 : studentLoan === "plan2" ? 27295 : studentLoan === "plan4" ? 31395 : studentLoan === "plan5" ? 25000 : studentLoan === "postgrad" ? 21000 : 0;
      let slRate = studentLoan === "postgrad" ? 0.06 : 0.09;
      if (slThreshold > 0 && annualGross > slThreshold) slDeduction = (annualGross - slThreshold) * slRate;

      const totalDeductions = incomeTax + ni + annualPension + slDeduction;
      return { 
        currency: "GBP", symbol: "£",
        gross: annualGross, allowance: baseAllowance, pension: annualPension, 
        tax1: incomeTax, tax1Name: "Income Tax",
        tax2: ni, tax2Name: "National Insurance",
        tax3: slDeduction, tax3Name: "Student Loan",
        deductions: totalDeductions, net: Math.max(0, annualGross - totalDeductions) 
      };
    }
  };
  
  const taxData = calculateTaxes();
  const formatMoney = (val: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: taxData.currency }).format(val);

  // ==========================================
  // 2. CURRENCY CONVERTER STATE
  // ==========================================
  const [currAmount, setCurrAmount] = useState<number | "">(100);
  const [currFrom, setCurrFrom] = useState("GBP");
  const [currTo, setCurrTo] = useState("USD");
  const [currResult, setCurrResult] = useState<string | null>(null);
  const [currRate, setCurrRate] = useState<number | null>(null);
  const [currLoading, setCurrLoading] = useState(false);

  const currencyList = [
    { code: "GBP", name: "GBP (£) - British Pound" }, { code: "USD", name: "USD ($) - US Dollar" },
    { code: "EUR", name: "EUR (€) - Euro" }, { code: "JPY", name: "JPY (¥) - Japanese Yen" },
    { code: "CAD", name: "CAD ($) - Canadian Dollar" }, { code: "AUD", name: "AUD ($) - Australian Dollar" },
  ];

  const convertCurrency = async () => {
    const amt = Number(currAmount) || 0;
    if (amt <= 0) { setCurrResult("0.00"); setCurrRate(null); return; }
    setCurrLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${currFrom}`);
      const data = await res.json();
      if (data && data.rates && data.rates[currTo]) {
        setCurrRate(data.rates[currTo]);
        setCurrResult((amt * data.rates[currTo]).toFixed(2));
      } else { setCurrResult("Unavailable"); setCurrRate(null); }
    } catch {
      setCurrResult("Error"); setCurrRate(null);
    } finally { setCurrLoading(false); }
  };
  useEffect(() => { convertCurrency(); }, [currAmount, currFrom, currTo]);

  // ==========================================
  // 3. LOAN & COMPOUND CALCULATORS
  // ==========================================
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

  const [ciPrincipal, setCiPrincipal] = useState<number | "">(10000);
  const [ciRate, setCiRate] = useState<number | "">(6);
  const [ciYears, setCiYears] = useState<number | "">(10);
  const [ciFreq, setCiFreq] = useState<number>(12);

  const calculateCI = () => {
    const P = Number(ciPrincipal) || 0, r = (Number(ciRate) || 0) / 100, t = Number(ciYears) || 0, n = ciFreq;
    const amount = P * Math.pow(1 + r / n, n * t);
    return { total: amount, interest: amount - P };
  };
  const ciData = calculateCI();
  const formatGeneric = (val: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "GBP" }).format(val);

  return (
    <>
      {activeTool === "tax-calculator" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">Income Tax & Take-Home Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select your country to apply accurate local tax rules and deductions.</p>
              </div>
              
              {/* Dynamic Region Engine Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <button onClick={() => setTaxCountry("UK")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${taxCountry === "UK" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>🇬🇧 UK (HMRC)</button>
                <button onClick={() => setTaxCountry("US")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${taxCountry === "US" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>🇺🇸 USA (IRS)</button>
              </div>
            </div>

            {/* Universal Income Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Gross Income ({taxData.symbol})</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-1 gap-2">
                    <span className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-slate-300 flex items-center justify-center">{taxData.symbol}</span>
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" />
                  </div>
                  <select value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value as any)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white w-full sm:w-auto">
                    <option value="year">per Year</option><option value="month">per Month</option><option value="week">per Week</option><option value="day">per Day</option><option value="hour">per Hour</option>
                  </select>
                </div>
              </div>
              {salaryPeriod === "hour" && (
                <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Hours per Week</label><input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" /></div>
              )}
            </div>

            {/* Conditional Sub-Engines Based on Region */}
            {taxCountry === "US" ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">United States Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Filing Status</label>
                    <select value={usFilingStatus} onChange={(e) => setUsFilingStatus(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                      <option value="single">Single</option><option value="married">Married Filing Jointly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">State Tax Rate (Est. %)</label>
                    <input type="number" step="0.1" value={usStateTaxPct} onChange={(e) => setUsStateTaxPct(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Pre-Tax 401(k) (%)</label>
                    <input type="number" step="0.1" value={us401kPct} onChange={(e) => setUs401kPct(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">United Kingdom Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Region</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                      <option value="rUK">UK (England, Wales, NI)</option><option value="scotland">Scotland</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">NI Category</label>
                    <select value={niCategory} onChange={(e) => setNiCategory(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                      <option value="A">A - Standard Rate</option><option value="B">B - Married Women</option><option value="C">C - Over Pension Age</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Student Loan</label>
                    <select value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                      <option value="none">None</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4</option><option value="plan5">Plan 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Pension (%)</label>
                    <input type="number" value={pensionValue} onChange={(e) => setPensionValue(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Universal Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-blue-700 dark:text-sky-400 uppercase tracking-wider">Take-Home (Yearly)</span><span className="block text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-sky-200 mt-1 break-all">{formatMoney(taxData.net)}</span></div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Take-Home (Monthly)</span><span className="block text-2xl md:text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 break-all">{formatMoney(taxData.net / 12)}</span></div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Deductions</span><span className="block text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 break-all">{formatMoney(taxData.deductions)}</span></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                    <th className="p-3 font-semibold rounded-tl-lg">Breakdown</th>
                    <th className="p-3 font-semibold">Yearly</th>
                    <th className="p-3 font-semibold">Monthly</th>
                    <th className="p-3 font-semibold">Weekly</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Daily</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Gross Income</td>
                    <td className="p-3">{formatMoney(taxData.gross)}</td><td className="p-3">{formatMoney(taxData.gross / 12)}</td><td className="p-3">{formatMoney(taxData.gross / 52)}</td><td className="p-3">{formatMoney(taxData.gross / 260)}</td>
                  </tr>
                  
                  {/* Dynamic Deductions mapped from the region engine */}
                  {taxData.pension > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">Retirement / Pension</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.pension)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.pension / 12)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.pension / 52)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.pension / 260)}</td>
                    </tr>
                  )}
                  {taxData.tax1 > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">{taxData.tax1Name}</td>
                      <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1 / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1 / 260)}</td>
                    </tr>
                  )}
                  {taxData.tax2 > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">{taxData.tax2Name}</td>
                      <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2 / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2 / 260)}</td>
                    </tr>
                  )}
                  {taxData.tax3 > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">{taxData.tax3Name}</td>
                      <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3 / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3 / 260)}</td>
                    </tr>
                  )}

                  <tr className="bg-blue-50/50 dark:bg-blue-950/30 font-bold text-slate-900 dark:text-white">
                    <td className="p-3 font-sans text-blue-900 dark:text-sky-300 rounded-bl-lg">Net Take-Home Pay</td>
                    <td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net / 12)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net / 52)}</td><td className="p-3 text-blue-700 dark:text-sky-400 rounded-br-lg">{formatMoney(taxData.net / 260)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REMAINDER OF EXISTING TOOLS UNCHANGED */}
      {activeTool === "currency-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Live Currency Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert global currencies with real-time exchange rates.</p>
          <div className="flex flex-col md:flex-row items-end gap-3 mb-6">
            <div className="flex-1 w-full"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Amount</label><input type="number" value={currAmount} onChange={(e) => setCurrAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium" /></div>
            <div className="flex-1 w-full"><label className="block text-xs font-bold mb-2 dark:text-slate-300">From Currency</label><select value={currFrom} onChange={(e) => setCurrFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">{currencyList.map((c) => (<option key={`from-${c.code}`} value={c.code}>{c.name}</option>))}</select></div>
            <div className="flex-1 w-full"><label className="block text-xs font-bold mb-2 dark:text-slate-300">To Currency</label><select value={currTo} onChange={(e) => setCurrTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">{currencyList.map((c) => (<option key={`to-${c.code}`} value={c.code}>{c.name}</option>))}</select></div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center"><span className="text-sm font-bold text-slate-600 dark:text-slate-300">Converted Value:</span><span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400">{currLoading ? "Fetching..." : `${currResult || "0.00"} ${currTo}`}</span></div>
        </div>
      )}

      {activeTool === "loan-calc" && (
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
      )}

      {activeTool === "compound-calc" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Compound Interest Calculator</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Project future investment growth using compound interest formulas.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Initial (£)</label><input type="number" value={ciPrincipal} onChange={(e) => setCiPrincipal(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Annual Rate (%)</label><input type="number" value={ciRate} onChange={(e) => setCiRate(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Years</label><input type="number" value={ciYears} onChange={(e) => setCiYears(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Frequency</label><select value={ciFreq} onChange={(e) => setCiFreq(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value={12}>Monthly</option><option value={1}>Yearly</option></select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl text-center"><span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">FUTURE BALANCE</span><span className="block text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">{formatGeneric(ciData.total)}</span></div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">INTEREST EARNED</span><span className="block text-2xl md:text-3xl font-black text-blue-900 dark:text-sky-200 mt-1">{formatGeneric(ciData.interest)}</span></div>
          </div>
        </div>
      )}
    </>
  );
}