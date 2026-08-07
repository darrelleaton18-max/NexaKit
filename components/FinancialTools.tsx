"use client";

import { useState, useEffect } from "react";

// ==========================================
// 💱 EXPANDED CURRENCY LIST (34 CURRENCIES)
// ==========================================
const currencyList = [
  { code: "GBP", name: "GBP (£) - British Pound" },
  { code: "USD", name: "USD ($) - US Dollar" },
  { code: "EUR", name: "EUR (€) - Euro" },
  { code: "JPY", name: "JPY (¥) - Japanese Yen" },
  { code: "CAD", name: "CAD ($) - Canadian Dollar" },
  { code: "AUD", name: "AUD ($) - Australian Dollar" },
  { code: "CHF", name: "CHF (Fr) - Swiss Franc" },
  { code: "CNY", name: "CNY (¥) - Chinese Yuan" },
  { code: "INR", name: "INR (₹) - Indian Rupee" },
  { code: "NZD", name: "NZD ($) - New Zealand Dollar" },
  { code: "SGD", name: "SGD ($) - Singapore Dollar" },
  { code: "HKD", name: "HKD ($) - Hong Kong Dollar" },
  { code: "SEK", name: "SEK (kr) - Swedish Krona" },
  { code: "KRW", name: "KRW (₩) - South Korean Won" },
  { code: "NOK", name: "NOK (kr) - Norwegian Krone" },
  { code: "MXN", name: "MXN ($) - Mexican Peso" },
  { code: "BRL", name: "BRL (R$) - Brazilian Real" },
  { code: "ZAR", name: "ZAR (R) - South African Rand" },
  { code: "TRY", name: "TRY (₺) - Turkish Lira" },
  { code: "AED", name: "AED (د.إ) - UAE Dirham" },
  { code: "SAR", name: "SAR (﷼) - Saudi Riyal" },
  { code: "THB", name: "THB (฿) - Thai Baht" },
  { code: "IDR", name: "IDR (Rp) - Indonesian Rupiah" },
  { code: "MYR", name: "MYR (RM) - Malaysian Ringgit" },
  { code: "PHP", name: "PHP (₱) - Philippine Peso" },
  { code: "PLN", name: "PLN (zł) - Polish Zloty" },
  { code: "CZK", name: "CZK (Kč) - Czech Koruna" },
  { code: "HUF", name: "HUF (Ft) - Hungarian Forint" },
  { code: "DKK", name: "DKK (kr) - Danish Krone" },
  { code: "ILS", name: "ILS (₪) - Israeli New Shekel" },
  { code: "EGP", name: "EGP (£) - Egyptian Pound" },
  { code: "CLP", name: "CLP ($) - Chilean Peso" },
  { code: "PKR", name: "PKR (₨) - Pakistani Rupee" },
  { code: "NGN", name: "NGN (₦) - Nigerian Naira" },
];

export default function FinancialTools({ activeTool }: { activeTool: string }) {
  // If a financial tool isn't active, don't render anything or run heavy logic
  if (!["tax-calculator", "currency-converter", "loan-calc", "compound-calc"].includes(activeTool)) {
    return null;
  }

  // ==========================================
  // 1. UK INCOME TAX CALCULATOR STATE
  // ==========================================
  const [salary, setSalary] = useState<number | "">(45000);
  const [salaryPeriod, setSalaryPeriod] = useState<"year" | "month" | "week" | "day" | "hour">("year");
  const [hoursPerWeek, setHoursPerWeek] = useState<number | "">(37.5);
  const [region, setRegion] = useState<"rUK" | "scotland">("rUK");
  const [taxYear, setTaxYear] = useState("2026/27");
  const [isMarried, setIsMarried] = useState(false);
  const [isBlind, setIsBlind] = useState(false);
  const [niCategory, setNiCategory] = useState<"A" | "B" | "C" | "H" | "M">("A");
  const [studentLoan, setStudentLoan] = useState("none");
  const [ageGroup, setAgeGroup] = useState("under65");
  const [rentalIncome, setRentalIncome] = useState<number | "">(0);
  const [wageExtras, setWageExtras] = useState<number | "">(0);
  const [benefitsInKind, setBenefitsInKind] = useState<number | "">(0);
  const [taxCodeInput, setTaxCodeInput] = useState("");
  const [pensionValue, setPensionValue] = useState<number | "">(5);
  const [pensionUnit, setPensionUnit] = useState<"%" | "£">("%");
  const [pensionType, setPensionType] = useState<"salSac" | "ras" | "netPay">("salSac");

  const resetTaxCalculator = () => {
    setSalary(45000); setSalaryPeriod("year"); setHoursPerWeek(37.5); setRegion("rUK"); setTaxYear("2026/27");
    setIsMarried(false); setIsBlind(false); setNiCategory("A"); setStudentLoan("none"); setAgeGroup("under65");
    setRentalIncome(0); setWageExtras(0); setBenefitsInKind(0); setTaxCodeInput("");
    setPensionValue(5); setPensionUnit("%"); setPensionType("salSac");
  };

  const calculateTax = () => {
    let rawPay = Number(salary) || 0;
    let annualSalary = rawPay;
    if (salaryPeriod === "month") annualSalary = rawPay * 12;
    else if (salaryPeriod === "week") annualSalary = rawPay * 52;
    else if (salaryPeriod === "day") annualSalary = rawPay * 260;
    else if (salaryPeriod === "hour") annualSalary = rawPay * (Number(hoursPerWeek) || 37.5) * 52;

    const extraTaxable = (Number(rentalIncome) || 0) + (Number(wageExtras) || 0) + (Number(benefitsInKind) || 0);
    const totalGross = annualSalary + extraTaxable;

    let annualPension = 0;
    const penVal = Number(pensionValue) || 0;
    if (pensionUnit === "%") annualPension = annualSalary * (penVal / 100);
    else annualPension = salaryPeriod === "month" ? penVal * 12 : salaryPeriod === "week" ? penVal * 52 : penVal;

    let grossForTax = totalGross;
    let grossForNI = annualSalary;
    let grossForSL = totalGross;

    if (pensionType === "salSac") {
      grossForTax = Math.max(0, totalGross - annualPension);
      grossForNI = Math.max(0, annualSalary - annualPension);
      grossForSL = Math.max(0, totalGross - annualPension);
    } else if (pensionType === "netPay") {
      grossForTax = Math.max(0, totalGross - annualPension);
    }

    let baseAllowance = 12570;
    let customCode = taxCodeInput.trim().toUpperCase();
    let isFlatCode = false;
    let flatTaxRate = 0;

    if (customCode) {
      if (customCode === "BR") { isFlatCode = true; flatTaxRate = 0.20; }
      else if (customCode === "D0") { isFlatCode = true; flatTaxRate = 0.40; }
      else if (customCode === "D1") { isFlatCode = true; flatTaxRate = 0.45; }
      else if (customCode === "NT") { isFlatCode = true; flatTaxRate = 0; }
      else {
        const numMatch = customCode.match(/\d+/);
        if (numMatch) {
          const codeVal = parseInt(numMatch[0], 10) * 10;
          baseAllowance = customCode.startsWith("K") ? -codeVal : codeVal;
        }
      }
    }

    if (!isFlatCode) {
      if (isBlind) baseAllowance += taxYear === "2026/27" ? 3250 : 3130;
      if (isMarried) baseAllowance += 1260;
      if (grossForTax > 100000) baseAllowance = Math.max(0, baseAllowance - (grossForTax - 100000) / 2);
    }

    let incomeTax = 0;
    const taxableIncome = Math.max(0, grossForTax - baseAllowance);

    if (isFlatCode) {
      incomeTax = grossForTax * flatTaxRate;
    } else if (region === "scotland") {
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
    let mainNiRate = niCategory === "C" || ageGroup === "over65" ? 0 : niCategory === "B" ? 0.0185 : 0.08;
    let upperNiRate = niCategory === "C" || ageGroup === "over65" ? 0 : 0.02;

    if (grossForNI > 12570 && mainNiRate > 0) ni += (Math.min(grossForNI, 50270) - 12570) * mainNiRate;
    if (grossForNI > 50270 && upperNiRate > 0) ni += (grossForNI - 50270) * upperNiRate;

    let slDeduction = 0;
    let slThreshold = studentLoan === "plan1" ? 24990 : studentLoan === "plan2" ? 27295 : studentLoan === "plan4" ? 31395 : studentLoan === "plan5" ? 25000 : studentLoan === "postgrad" ? 21000 : 0;
    let slRate = studentLoan === "postgrad" ? 0.06 : 0.09;
    if (slThreshold > 0 && grossForSL > slThreshold) slDeduction = (grossForSL - slThreshold) * slRate;

    const totalDeductions = incomeTax + ni + annualPension + slDeduction;
    return { gross: totalGross, pension: annualPension, allowance: baseAllowance, tax: incomeTax, ni, studentLoan: slDeduction, deductions: totalDeductions, net: Math.max(0, totalGross - totalDeductions) };
  };
  const taxData = calculateTax();

  // ==========================================
  // 2. CURRENCY CONVERTER STATE
  // ==========================================
  const [currAmount, setCurrAmount] = useState<number | "">(100);
  const [currFrom, setCurrFrom] = useState("GBP");
  const [currTo, setCurrTo] = useState("USD");
  const [currResult, setCurrResult] = useState<string | null>(null);
  const [currRate, setCurrRate] = useState<number | null>(null);
  const [currLoading, setCurrLoading] = useState(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.currency) {
          const isSupported = currencyList.some((c) => c.code === data.currency);
          if (isSupported) {
            setCurrFrom(data.currency);
            if (data.currency === "USD") setCurrTo("EUR"); 
          }
        }
      })
      .catch(() => console.log("Location fetch failed, keeping default."));
  }, []);

  const convertCurrency = async () => {
    const amt = Number(currAmount) || 0;
    if (amt <= 0) { setCurrResult("0.00"); setCurrRate(null); return; }
    setCurrLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${currFrom}`);
      const data = await res.json();
      if (data && data.rates && data.rates[currTo]) {
        const rate = data.rates[currTo];
        setCurrRate(rate);
        setCurrResult((amt * rate).toFixed(2));
      } else {
        setCurrResult("Unavailable");
        setCurrRate(null);
      }
    } catch {
      const fallbackRates: Record<string, Record<string, number>> = {
        GBP: { USD: 1.28, EUR: 1.17, JPY: 190.5, CAD: 1.75, AUD: 1.94, GBP: 1 },
        USD: { GBP: 0.78, EUR: 0.92, JPY: 148.8, CAD: 1.37, AUD: 1.52, USD: 1 },
        EUR: { GBP: 0.85, USD: 1.09, JPY: 162.2, CAD: 1.49, AUD: 1.65, EUR: 1 },
      };
      const rate = fallbackRates[currFrom]?.[currTo] || 1;
      setCurrRate(rate);
      setCurrResult((amt * rate).toFixed(2));
    } finally {
      setCurrLoading(false);
    }
  };

  useEffect(() => { convertCurrency(); }, [currAmount, currFrom, currTo]);

  // ==========================================
  // 3. LOAN & MORTGAGE STATE
  // ==========================================
  const [loanAmount, setLoanAmount] = useState<number | "">(250000);
  const [loanInterest, setLoanInterest] = useState<number | "">(4.5);
  const [loanYears, setLoanYears] = useState<number | "">(25);

  const calculateLoan = () => {
    const P = Number(loanAmount) || 0;
    const r = (Number(loanInterest) || 0) / 100 / 12;
    const n = (Number(loanYears) || 0) * 12;
    if (!P || !r || !n) return { monthly: 0, totalPay: 0, interest: 0 };
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = monthly * n;
    return { monthly, totalPay, interest: totalPay - P };
  };
  const loanData = calculateLoan();

  // ==========================================
  // 4. COMPOUND INTEREST STATE
  // ==========================================
  const [ciPrincipal, setCiPrincipal] = useState<number | "">(10000);
  const [ciRate, setCiRate] = useState<number | "">(6);
  const [ciYears, setCiYears] = useState<number | "">(10);
  const [ciFreq, setCiFreq] = useState<number>(12);

  const calculateCI = () => {
    const P = Number(ciPrincipal) || 0;
    const r = (Number(ciRate) || 0) / 100;
    const t = Number(ciYears) || 0;
    const n = ciFreq;
    const amount = P * Math.pow(1 + r / n, n * t);
    return { total: amount, interest: amount - P };
  };
  const ciData = calculateCI();

  const formatGBP = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  return (
    <>
      {activeTool === "tax-calculator" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">UK Income Tax & Take-Home Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Advanced salary tax breakdown with Region, Pension Type, Allowances & NI Letters.</p>
              </div>
              <button onClick={resetTaxCalculator} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg shrink-0">Reset All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Salary Amount</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-1 gap-2">
                    <span className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-slate-300 flex items-center justify-center">£</span>
                    <input type="number" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" placeholder="0" />
                  </div>
                  <select value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value as any)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white w-full sm:w-auto">
                    <option value="year">per Year</option><option value="month">per Month</option><option value="week">per Week</option><option value="day">per Day</option><option value="hour">per Hour</option>
                  </select>
                </div>
              </div>
              {salaryPeriod === "hour" && (
                <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Hours per Week</label><input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" /></div>
              )}
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Region / Country</label>
                <select value={region} onChange={(e) => setRegion(e.target.value as any)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="rUK">UK (England, Wales, NI)</option><option value="scotland">Scotland</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Tax Year</label>
                <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="2026/27">2026/27</option><option value="2025/26">2025/26</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Age Bracket</label>
                <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="under65">Under 65</option><option value="65to74">65 - 74</option><option value="over65">75+ / State Pension Age</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">NI Category Letter</label>
                <select value={niCategory} onChange={(e) => setNiCategory(e.target.value as any)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="A">A - Standard Rate</option><option value="B">B - Married Women / Widows</option><option value="C">C - Over State Pension Age (No NI)</option><option value="H">H - Apprentice Under 25</option><option value="M">M - Under 21</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Student Loan Plan</label>
                <select value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="none">No Student Loan</option><option value="plan1">Plan 1 (Pre-2012)</option><option value="plan2">Plan 2 (Post-2012)</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5 (Post-2023)</option><option value="postgrad">Postgraduate Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Tax Code (Optional)</label>
                <input type="text" value={taxCodeInput} onChange={(e) => setTaxCodeInput(e.target.value)} placeholder="e.g. 1257L, BR, K100" className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg uppercase dark:text-white" />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">Pension Contribution Mechanics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Contribution Amount</label>
                  <div className="flex gap-2">
                    <input type="number" value={pensionValue} onChange={(e) => setPensionValue(e.target.value === "" ? "" : Number(e.target.value))} className="flex-1 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                    <select value={pensionUnit} onChange={(e) => setPensionUnit(e.target.value as any)} className="p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white"><option value="%">%</option><option value="£">£</option></select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 dark:text-slate-300">Pension Scheme Type</label>
                  <select value={pensionType} onChange={(e) => setPensionType(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                    <option value="salSac">Salary Sacrifice (Saves Tax, NI & Student Loan)</option><option value="ras">Relief at Source / RAS</option><option value="netPay">Net Pay Arrangement</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Rental Income (£/yr)</label><input type="number" value={rentalIncome} onChange={(e) => setRentalIncome(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="0" /></div>
              <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Wage Extras (£/yr)</label><input type="number" value={wageExtras} onChange={(e) => setWageExtras(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="0" /></div>
              <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Benefits in Kind (£/yr)</label><input type="number" value={benefitsInKind} onChange={(e) => setBenefitsInKind(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="e.g. Car / Health" /></div>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"><input type="checkbox" checked={isMarried} onChange={(e) => setIsMarried(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /> Married Allowance Transfer (+£1,260 PA)</label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"><input type="checkbox" checked={isBlind} onChange={(e) => setIsBlind(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /> Blind Person's Allowance (+£3,250 PA)</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-blue-700 dark:text-sky-400 uppercase tracking-wider">Take-Home (Yearly)</span><span className="block text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-sky-200 mt-1 break-all">{formatGBP(taxData.net)}</span></div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Take-Home (Monthly)</span><span className="block text-2xl md:text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 break-all">{formatGBP(taxData.net / 12)}</span></div>
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Deductions</span><span className="block text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 break-all">{formatGBP(taxData.deductions)}</span></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                    <th className="p-3 font-semibold">Breakdown Category</th>
                    <th className="p-3 font-semibold">Yearly</th>
                    <th className="p-3 font-semibold">Monthly</th>
                    <th className="p-3 font-semibold">Weekly</th>
                    <th className="p-3 font-semibold">Daily</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Gross Income</td>
                    <td className="p-3">{formatGBP(taxData.gross)}</td><td className="p-3">{formatGBP(taxData.gross / 12)}</td><td className="p-3">{formatGBP(taxData.gross / 52)}</td><td className="p-3">{formatGBP(taxData.gross / 260)}</td>
                  </tr>
                  {taxData.pension > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">Pension Contribution</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">-{formatGBP(taxData.pension)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatGBP(taxData.pension / 12)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatGBP(taxData.pension / 52)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatGBP(taxData.pension / 260)}</td>
                    </tr>
                  )}
                  <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">Income Tax ({region === "scotland" ? "Scotland" : "rUK"})</td>
                      <td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.tax)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.tax / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.tax / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.tax / 260)}</td>
                    </tr>
                  <tr className="text-slate-600 dark:text-slate-400">
                    <td className="p-3 font-sans">National Insurance (Cat {niCategory})</td>
                    <td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.ni)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.ni / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.ni / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.ni / 260)}</td>
                  </tr>
                  {taxData.studentLoan > 0 && (
                    <tr className="text-slate-600 dark:text-slate-400">
                      <td className="p-3 font-sans">Student Loan</td>
                      <td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.studentLoan)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.studentLoan / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.studentLoan / 52)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatGBP(taxData.studentLoan / 260)}</td>
                    </tr>
                  )}
                  <tr className="bg-blue-50/50 dark:bg-blue-950/30 font-bold text-slate-900 dark:text-white">
                    <td className="p-3 font-sans text-blue-900 dark:text-sky-300">Net Take-Home Pay</td>
                    <td className="p-3 text-blue-700 dark:text-sky-400">{formatGBP(taxData.net)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatGBP(taxData.net / 12)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatGBP(taxData.net / 52)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatGBP(taxData.net / 260)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTool === "currency-converter" && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">Live Currency Converter</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert global currencies with real-time exchange rates.</p>
          
          <div className="flex flex-col md:flex-row items-end gap-3 mb-6">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Amount</label>
              <input type="number" value={currAmount} onChange={(e) => setCurrAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium" />
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">From Currency</label>
              <select value={currFrom} onChange={(e) => setCurrFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
                {currencyList.map((c) => (
                  <option key={`from-${c.code}`} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const temp = currFrom;
                setCurrFrom(currTo);
                setCurrTo(temp);
              }}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition-colors shrink-0 self-stretch md:self-end flex items-center justify-center"
              title="Swap Currencies"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">To Currency</label>
              <select value={currTo} onChange={(e) => setCurrTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
                {currencyList.map((c) => (
                  <option key={`to-${c.code}`} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Converted Value:</span>
              {currRate && !currLoading && (
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  Rate: 1 {currFrom} = {currRate.toFixed(4)} {currTo}
                </span>
              )}
            </div>
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all">
              {currLoading ? "Fetching rate..." : `${currResult || "0.00"} ${currTo}`}
            </span>
          </div>
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
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">MONTHLY PAYMENT</span><span className="block text-xl md:text-2xl font-black text-blue-900 dark:text-sky-200 mt-1 break-all">{formatGBP(loanData.monthly)}</span></div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs text-slate-600 dark:text-slate-400 font-bold">TOTAL REPAID</span><span className="block text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1 break-all">{formatGBP(loanData.totalPay)}</span></div>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-center"><span className="text-xs text-amber-600 dark:text-amber-400 font-bold">TOTAL INTEREST</span><span className="block text-xl md:text-2xl font-black text-amber-900 dark:text-amber-200 mt-1 break-all">{formatGBP(loanData.interest)}</span></div>
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
            <div>
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Frequency</label>
              <select value={ciFreq} onChange={(e) => setCiFreq(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                <option value={12}>Monthly</option><option value={1}>Yearly</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">FUTURE BALANCE</span><span className="block text-2xl md:text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1 break-all">{formatGBP(ciData.total)}</span></div>
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">INTEREST EARNED</span><span className="block text-2xl md:text-3xl font-black text-blue-900 dark:text-sky-200 mt-1 break-all">{formatGBP(ciData.interest)}</span></div>
          </div>
        </div>
      )}
    </>
  );
}