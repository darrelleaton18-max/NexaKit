"use client";

import { useState } from "react";

export default function IncomeTaxCalculator({ activeTool }: { activeTool: string }) {
  if (activeTool !== "tax-calculator") return null;

  const [taxCountry, setTaxCountry] = useState<"UK" | "US">("UK");
  const [salary, setSalary] = useState<number | "">(65000);
  const [salaryPeriod, setSalaryPeriod] = useState<"year" | "month" | "week" | "day" | "hour">("year");
  const [hoursPerWeek, setHoursPerWeek] = useState<number | "">(40);
  const [bonus, setBonus] = useState<number | "">(0);

  const [region, setRegion] = useState<"rUK" | "scotland">("rUK");
  const [taxYear, setTaxYear] = useState("2024/25");
  const [taxCodeInput, setTaxCodeInput] = useState("");
  const [isMarriedUK, setIsMarriedUK] = useState(false);
  const [isBlind, setIsBlind] = useState(false);
  const [niCategory, setNiCategory] = useState<"A" | "B" | "C" | "H" | "M">("A");
  const [studentLoan, setStudentLoan] = useState("none");
  const [pensionValue, setPensionValue] = useState<number | "">(5);
  const [pensionUnit, setPensionUnit] = useState<"%" | "£">("%");
  const [pensionType, setPensionType] = useState<"salSac" | "ras" | "netPay">("salSac");
  const [rentalIncome, setRentalIncome] = useState<number | "">(0);
  const [wageExtras, setWageExtras] = useState<number | "">(0);
  const [benefitsInKind, setBenefitsInKind] = useState<number | "">(0);

  const [usFilingStatus, setUsFilingStatus] = useState<"single" | "married_joint" | "married_sep" | "hoh">("single");
  const [usStateTaxPct, setUsStateTaxPct] = useState<number | "">(4.5); 
  const [usLocalTaxPct, setUsLocalTaxPct] = useState<number | "">(0); 
  const [us401kPct, setUs401kPct] = useState<number | "">(5);
  const [usHealthIns, setUsHealthIns] = useState<number | "">(0);
  const [usItemized, setUsItemized] = useState<number | "">(0);
  const [usDependents, setUsDependents] = useState<number | "">(0);

  const resetTaxCalculator = () => {
    setSalary(65000); setSalaryPeriod("year"); setHoursPerWeek(40); setBonus(0);
    setRegion("rUK"); setTaxYear("2024/25"); setTaxCodeInput(""); setIsMarriedUK(false); setIsBlind(false);
    setNiCategory("A"); setStudentLoan("none"); setPensionValue(5); setPensionUnit("%"); setPensionType("salSac");
    setRentalIncome(0); setWageExtras(0); setBenefitsInKind(0);
    setUsFilingStatus("single"); setUsStateTaxPct(4.5); setUsLocalTaxPct(0); setUs401kPct(5); 
    setUsHealthIns(0); setUsItemized(0); setUsDependents(0);
  };

  const calculateTaxes = () => {
    let rawPay = Number(salary) || 0;
    let baseAnnual = rawPay;
    if (salaryPeriod === "month") baseAnnual = rawPay * 12;
    else if (salaryPeriod === "week") baseAnnual = rawPay * 52;
    else if (salaryPeriod === "day") baseAnnual = rawPay * 260;
    else if (salaryPeriod === "hour") baseAnnual = rawPay * (Number(hoursPerWeek) || 40) * 52;

    const annualBonus = Number(bonus) || 0;
    const totalAnnualGross = baseAnnual + annualBonus;

    if (taxCountry === "US") {
      const _401k = totalAnnualGross * ((Number(us401kPct) || 0) / 100);
      const healthIns = Number(usHealthIns) || 0;
      const preTaxDeductions = _401k + healthIns;
      const agi = Math.max(0, totalAnnualGross - preTaxDeductions); 
      
      let standardDeduction = usFilingStatus === "married_joint" ? 29200 : usFilingStatus === "hoh" ? 21900 : 14600;
      const deductionToUse = Math.max(standardDeduction, Number(usItemized) || 0);
      const taxableIncome = Math.max(0, agi - deductionToUse);

      let federalTax = 0, rem = taxableIncome;
      if (usFilingStatus === "single" || usFilingStatus === "married_sep") {
        const b1 = Math.min(rem, 11600); federalTax += b1 * 0.10; rem -= b1;
        const b2 = Math.min(Math.max(rem, 0), 47150 - 11600); federalTax += b2 * 0.12; rem -= b2;
        const b3 = Math.min(Math.max(rem, 0), 100525 - 47150); federalTax += b3 * 0.22; rem -= b3;
        const b4 = Math.min(Math.max(rem, 0), 191950 - 100525); federalTax += b4 * 0.24; rem -= b4;
        const b5 = Math.min(Math.max(rem, 0), 243725 - 191950); federalTax += b5 * 0.32; rem -= b5;
        const b6 = Math.min(Math.max(rem, 0), 609350 - 243725); federalTax += b6 * 0.35; rem -= b6;
        if (rem > 0) federalTax += rem * 0.37;
      } else if (usFilingStatus === "married_joint") {
        const b1 = Math.min(rem, 23200); federalTax += b1 * 0.10; rem -= b1;
        const b2 = Math.min(Math.max(rem, 0), 94300 - 23200); federalTax += b2 * 0.12; rem -= b2;
        const b3 = Math.min(Math.max(rem, 0), 201050 - 94300); federalTax += b3 * 0.22; rem -= b3;
        const b4 = Math.min(Math.max(rem, 0), 383900 - 201050); federalTax += b4 * 0.24; rem -= b4;
        const b5 = Math.min(Math.max(rem, 0), 487450 - 383900); federalTax += b5 * 0.32; rem -= b5;
        const b6 = Math.min(Math.max(rem, 0), 731200 - 487450); federalTax += b6 * 0.35; rem -= b6;
        if (rem > 0) federalTax += rem * 0.37;
      } else { 
        const b1 = Math.min(rem, 16550); federalTax += b1 * 0.10; rem -= b1;
        const b2 = Math.min(Math.max(rem, 0), 63100 - 16550); federalTax += b2 * 0.12; rem -= b2;
        const b3 = Math.min(Math.max(rem, 0), 100500 - 63100); federalTax += b3 * 0.22; rem -= b3;
        const b4 = Math.min(Math.max(rem, 0), 191950 - 100500); federalTax += b4 * 0.24; rem -= b4;
        const b5 = Math.min(Math.max(rem, 0), 243700 - 191950); federalTax += b5 * 0.32; rem -= b5;
        const b6 = Math.min(Math.max(rem, 0), 609350 - 243700); federalTax += b6 * 0.35; rem -= b6;
        if (rem > 0) federalTax += rem * 0.37;
      }

      federalTax = Math.max(0, federalTax - ((Number(usDependents) || 0) * 2000));
      const ficaIncome = Math.max(0, totalAnnualGross - healthIns);
      const ssTax = Math.min(ficaIncome, 168600) * 0.062;
      let medTax = ficaIncome * 0.0145;
      const medThreshold = usFilingStatus === "married_joint" ? 250000 : 200000;
      if (ficaIncome > medThreshold) medTax += (ficaIncome - medThreshold) * 0.009;
      const ficaTotal = ssTax + medTax;
      const stateTax = agi * ((Number(usStateTaxPct) || 0) / 100);
      const localTax = agi * ((Number(usLocalTaxPct) || 0) / 100);
      const totalTaxes = federalTax + ficaTotal + stateTax + localTax;

      return { 
        currency: "USD", symbol: "$", gross: totalAnnualGross, allowance: deductionToUse, preTax: preTaxDeductions, taxable: taxableIncome,
        tax1: federalTax, tax1Name: "Federal Income Tax", tax2: ficaTotal, tax2Name: "FICA (SS & Medicare)", tax3: stateTax + localTax, tax3Name: "State & Local Taxes",
        deductions: totalTaxes + preTaxDeductions, net: Math.max(0, totalAnnualGross - (totalTaxes + preTaxDeductions)) 
      };
    } else {
      const extraTaxable = (Number(rentalIncome) || 0) + (Number(wageExtras) || 0) + (Number(benefitsInKind) || 0);
      const totalGrossIncome = totalAnnualGross + extraTaxable;

      let annualPension = 0;
      const penVal = Number(pensionValue) || 0;
      if (pensionUnit === "%") annualPension = totalAnnualGross * (penVal / 100);
      else annualPension = salaryPeriod === "month" ? penVal * 12 : salaryPeriod === "week" ? penVal * 52 : penVal;

      let grossForTax = totalGrossIncome, grossForNI = totalAnnualGross, grossForSL = totalGrossIncome;
      if (pensionType === "salSac") {
        grossForTax = Math.max(0, totalGrossIncome - annualPension);
        grossForNI = Math.max(0, totalAnnualGross - annualPension);
        grossForSL = Math.max(0, totalGrossIncome - annualPension);
      } else if (pensionType === "netPay") {
        grossForTax = Math.max(0, totalGrossIncome - annualPension);
      }

      let baseAllowance = 12570, customCode = taxCodeInput.trim().toUpperCase(), isFlatCode = false, flatTaxRate = 0;
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
        if (isBlind) baseAllowance += 3070;
        if (isMarriedUK) baseAllowance += 1260;
        if (grossForTax > 100000) baseAllowance = Math.max(0, baseAllowance - (grossForTax - 100000) / 2);
      }

      let incomeTax = 0, rem = Math.max(0, grossForTax - baseAllowance);
      if (isFlatCode) {
        incomeTax = grossForTax * flatTaxRate;
      } else if (region === "scotland") {
        const b1 = Math.min(rem, 2306); incomeTax += b1 * 0.19; rem -= b1;
        const b2 = Math.min(rem, 11685); incomeTax += b2 * 0.20; rem -= b2;
        const b3 = Math.min(rem, 17101); incomeTax += b3 * 0.21; rem -= b3;
        const b4 = Math.min(rem, 31338); incomeTax += b4 * 0.42; rem -= b4;
        const b5 = Math.min(rem, 50140); incomeTax += b5 * 0.45; rem -= b5;
        if (rem > 0) incomeTax += rem * 0.48;
      } else {
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
      if (slThreshold > 0 && grossForSL > slThreshold) slDeduction = (grossForSL - slThreshold) * (studentLoan === "postgrad" ? 0.06 : 0.09);

      const totalDeductions = incomeTax + ni + annualPension + slDeduction;
      return { 
        currency: "GBP", symbol: "£", gross: totalAnnualGross, allowance: baseAllowance, preTax: annualPension, taxable: Math.max(0, grossForTax - baseAllowance),
        tax1: incomeTax, tax1Name: "Income Tax", tax2: ni, tax2Name: "National Insurance", tax3: slDeduction, tax3Name: "Student Loan",
        deductions: totalDeductions, net: Math.max(0, (totalAnnualGross + (Number(wageExtras) || 0)) - totalDeductions) 
      };
    }
  };
  
  const taxData = calculateTaxes();
  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: "currency", currency: taxData.currency }).format(val);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Pro Income Tax Calculator</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Advanced localized engine supporting precise deductions, tax codes, and regional laws.</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
            <button onClick={() => setTaxCountry("UK")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${taxCountry === "UK" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>🇬🇧 UK</button>
            <button onClick={() => setTaxCountry("US")} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${taxCountry === "US" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>🇺🇸 USA</button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Primary Income</h3>
            <button onClick={resetTaxCalculator} className="text-xs font-bold text-red-500 hover:text-red-700 transition">Reset Fields</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold mb-2 dark:text-slate-300">Base Salary / Wage ({taxData.symbol})</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 gap-2">
                  <span className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-slate-300 flex items-center justify-center">{taxData.symbol}</span>
                  <input type="number" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" />
                </div>
                <select value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value as any)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg font-medium dark:text-white w-full sm:w-auto">
                  <option value="year">per Year</option><option value="month">per Month</option><option value="week">per Week</option><option value="day">per Day</option><option value="hour">per Hour</option>
                </select>
              </div>
            </div>
            {salaryPeriod === "hour" && (
              <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Hours per Week</label><input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" /></div>
            )}
            <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Annual Bonus ({taxData.symbol})</label><input type="number" value={bonus} onChange={(e) => setBonus(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" /></div>
          </div>
        </div>

        {taxCountry === "US" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">IRS Filing Details</h3>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Filing Status</label>
                <select value={usFilingStatus} onChange={(e) => setUsFilingStatus(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                  <option value="single">Single</option><option value="married_joint">Married Filing Jointly</option><option value="married_sep">Married Filing Separately</option><option value="hoh">Head of Household</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">State Tax (%)</label>
                  <input type="number" step="0.1" value={usStateTaxPct} onChange={(e) => setUsStateTaxPct(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Local/City Tax (%)</label>
                  <input type="number" step="0.1" value={usLocalTaxPct} onChange={(e) => setUsLocalTaxPct(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Dependents (Child Tax Credit)</label>
                <input type="number" value={usDependents} onChange={(e) => setUsDependents(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Deductions & Benefits</h3>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Pre-Tax 401(k) / IRA (%)</label>
                <input type="number" step="0.1" value={us401kPct} onChange={(e) => setUs401kPct(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Annual Health Ins. / FSA ($)</label>
                <input type="number" value={usHealthIns} onChange={(e) => setUsHealthIns(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Itemized Deductions ($) <span className="font-normal text-slate-400">(Overrides Standard)</span></label>
                <input type="number" value={usItemized} onChange={(e) => setUsItemized(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
              </div>
            </div>
          </div>
        )}

        {taxCountry === "UK" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">HMRC Region & Codes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Tax Year</label>
                  <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                    <option value="2024/25">2024 / 2025</option><option value="2023/24">2023 / 2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                    <option value="rUK">Rest of UK</option><option value="scotland">Scotland</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Custom Tax Code</label>
                  <input type="text" value={taxCodeInput} onChange={(e) => setTaxCodeInput(e.target.value)} placeholder="e.g. 1257L, BR" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">NI Category</label>
                  <select value={niCategory} onChange={(e) => setNiCategory(e.target.value as any)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                    <option value="A">A - Standard</option><option value="B">B - Married Women</option><option value="C">C - State Pension Age</option><option value="H">H - Apprentice</option><option value="M">M - Under 21</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"><input type="checkbox" checked={isMarriedUK} onChange={(e) => setIsMarriedUK(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /> Marriage Allowance</label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"><input type="checkbox" checked={isBlind} onChange={(e) => setIsBlind(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /> Blind Person's Allowance</label>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Pensions, Loans & Extras</h3>
              <div>
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Pension Scheme</label>
                <div className="flex gap-2 mb-2">
                  <input type="number" value={pensionValue} onChange={(e) => setPensionValue(e.target.value === "" ? "" : Number(e.target.value))} className="w-20 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  <select value={pensionUnit} onChange={(e) => setPensionUnit(e.target.value as any)} className="p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white"><option value="%">%</option><option value="£">£</option></select>
                  <select value={pensionType} onChange={(e) => setPensionType(e.target.value as any)} className="flex-1 p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white text-sm">
                    <option value="salSac">Salary Sacrifice</option><option value="ras">Relief at Source</option><option value="netPay">Net Pay Arrangement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Student Loan</label>
                  <select value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                    <option value="none">None</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4 (Scot)</option><option value="plan5">Plan 5</option><option value="postgrad">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Benefits in Kind (£)</label>
                  <input type="number" value={benefitsInKind} onChange={(e) => setBenefitsInKind(e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. Car" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Wage Extras (£)</label><input type="number" value={wageExtras} onChange={(e) => setWageExtras(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Overtime" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Rental Income (£)</label><input type="number" value={rentalIncome} onChange={(e) => setRentalIncome(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Property" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-blue-700 dark:text-sky-400 uppercase tracking-wider">Take-Home (Yearly)</span><span className="block text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-sky-200 mt-1 break-all">{formatMoney(taxData.net)}</span></div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Take-Home (Monthly)</span><span className="block text-2xl md:text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 break-all">{formatMoney(taxData.net / 12)}</span></div>
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Deductions</span><span className="block text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-1 break-all">{formatMoney(taxData.deductions)}</span></div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                <th className="p-3 font-semibold">Breakdown Category</th>
                <th className="p-3 font-semibold">Yearly</th>
                <th className="p-3 font-semibold">Monthly</th>
                <th className="p-3 font-semibold">Weekly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Gross Income</td>
                <td className="p-3 text-slate-900 dark:text-slate-100">{formatMoney(taxData.gross)}</td><td className="p-3 text-slate-900 dark:text-slate-100">{formatMoney(taxData.gross / 12)}</td><td className="p-3 text-slate-900 dark:text-slate-100">{formatMoney(taxData.gross / 52)}</td>
              </tr>
              <tr className="text-slate-500 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                <td className="p-2 font-sans pl-4 border-l-2 border-slate-300 dark:border-slate-600">Tax-Free Allowance</td>
                <td className="p-2">{formatMoney(taxData.allowance)}</td><td className="p-2">{formatMoney(taxData.allowance / 12)}</td><td className="p-2">{formatMoney(taxData.allowance / 52)}</td>
              </tr>
              {taxData.preTax > 0 && (
                <tr className="text-slate-600 dark:text-slate-400">
                  <td className="p-3 font-sans">Pre-Tax Deductions (Pension/401k)</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.preTax)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.preTax / 12)}</td><td className="p-3 text-amber-600 dark:text-amber-400">-{formatMoney(taxData.preTax / 52)}</td>
                </tr>
              )}
              {taxData.tax1 > 0 && (
                <tr className="text-slate-600 dark:text-slate-400">
                  <td className="p-3 font-sans">{taxData.tax1Name}</td>
                  <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax1 / 52)}</td>
                </tr>
              )}
              {taxData.tax2 > 0 && (
                <tr className="text-slate-600 dark:text-slate-400">
                  <td className="p-3 font-sans">{taxData.tax2Name}</td>
                  <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax2 / 52)}</td>
                </tr>
              )}
              {taxData.tax3 > 0 && (
                <tr className="text-slate-600 dark:text-slate-400">
                  <td className="p-3 font-sans">{taxData.tax3Name}</td>
                  <td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3 / 12)}</td><td className="p-3 text-red-600 dark:text-red-400">-{formatMoney(taxData.tax3 / 52)}</td>
                </tr>
              )}
              <tr className="bg-blue-50 dark:bg-blue-950/40 font-bold text-slate-900 dark:text-white border-t-2 border-blue-200 dark:border-blue-900">
                <td className="p-3 font-sans text-blue-900 dark:text-sky-300">Net Take-Home Pay</td>
                <td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net / 12)}</td><td className="p-3 text-blue-700 dark:text-sky-400">{formatMoney(taxData.net / 52)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}