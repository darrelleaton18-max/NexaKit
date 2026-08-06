"use client";

import { useState, useEffect, useRef } from "react";

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

// ==========================================
// 💵 LAZY LOADED DYNAMIC AD COMPONENTS
// ==========================================
type AdSize = "skyscraper" | "standard" | "banner";

const LazyAd = ({ index, type }: { index: number; type: AdSize }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } 
    );
    if (adRef.current) observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  if (type === "banner") {
    return (
      <div
        ref={adRef}
        className={`w-full max-w-[728px] h-[90px] mx-auto mt-8 mb-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-2 transition-all duration-700 shadow-sm ${
          isVisible 
            ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" 
            : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
        }`}
      >
        {isVisible ? (
          <>
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1">Advertisement</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-tight">728x90 Leaderboard</span>
          </>
        ) : (
          <span className="text-xs font-bold text-slate-300 dark:text-slate-600 animate-pulse">Lazy Loading Ad...</span>
        )}
      </div>
    );
  }

  const isSkyscraper = type === "skyscraper";
  const heightClass = isSkyscraper ? "h-[600px]" : "h-[250px]";
  const textLabel = isSkyscraper ? "160x600 Skyscraper" : "160x250 Standard";

  return (
    <div
      ref={adRef}
      className={`w-[160px] ${heightClass} rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-all duration-700 shadow-sm ${
        isVisible 
          ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-100" 
          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50"
      }`}
    >
      {isVisible ? (
        <>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2">Ad Slot {index + 1}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-tight" dangerouslySetInnerHTML={{ __html: textLabel.replace(" ", "<br/>") }} />
        </>
      ) : (
        <span className="text-xs font-bold text-slate-300 dark:text-slate-600 animate-pulse">Loading...</span>
      )}
    </div>
  );
};

const AdColumn = ({ side, layout }: { side: "left" | "right"; layout: AdSize[] }) => {
  return (
    <aside className="hidden xl:flex flex-col items-center gap-6 w-[160px] shrink-0 pt-6 pb-10 h-full relative">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-[-10px]">Advertisement</span>
      {layout.map((adSize, i) => (
        <LazyAd key={`${side}-${i}-${adSize}`} index={i} type={adSize} />
      ))}
    </aside>
  );
};


// ==========================================
// 🛠️ NAVIGATION & MENU CONFIGURATION
// ==========================================
const navGroups = [
  {
    group: "💰 Financial Tools",
    tools: [
      { id: "tax-calculator", label: "Income Tax Calculator" },
      { id: "currency-converter", label: "Live Currency Converter" },
      { id: "loan-calc", label: "Mortgage / Loan Calc" },
      { id: "compound-calc", label: "Compound Interest Calc" },
    ],
  },
  {
    group: "🧮 Math & Numbers",
    tools: [
      { id: "pct-calc", label: "Percentage Calculator" },
      { id: "unit-converter", label: "Metric / Unit Converter" },
      { id: "stats-calc", label: "Statistics Calculator" },
      { id: "prime-gen", label: "Prime Number Generator" },
      { id: "base-converter", label: "Number Base Converter" },
    ],
  },
  {
    group: "⏱️ Time & Date",
    tools: [
      { id: "stopwatch", label: "Precision Stopwatch" },
      { id: "countdown", label: "Countdown Timer" },
      { id: "date-diff", label: "Date Difference Calc" },
      { id: "age-calc", label: "Age Calculator" },
      { id: "timezone", label: "World Clock / Timezones" },
    ],
  },
  {
    group: "📝 Text & Lists",
    tools: [
      { id: "word-counter", label: "Word & Character Counter" },
      { id: "case-converter", label: "Text Case Converter" },
      { id: "list-tools", label: "List Sorter & Deduplicator" },
      { id: "find-replace", label: "Find & Replace Text" },
      { id: "lorem-gen", label: "Dummy Lorem Generator" },
      { id: "lang-converter", label: "Language Converter" },
    ],
  },
  {
    group: "🛠️ Dev & JSON Tools",
    tools: [
      { id: "json-formatter", label: "JSON Formatter / Minify" },
      { id: "base64", label: "Base64 Encoder / Decoder" },
      { id: "password-gen", label: "Key & Password Generator" },
      { id: "qr-maker", label: "QR Code Generator" },
      { id: "random-picker", label: "Unbiased Random Picker" },
    ],
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState("home"); 
  const [isDark, setIsDark] = useState(false);

  // System-aware initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Guarantee theme background switches globally
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc";
    }
  }, [isDark]);

  // ==========================================
  // 📏 PAGE SIZE AD OPTIMIZATION ALGORITHM
  // ==========================================
  const mainRef = useRef<HTMLElement>(null);
  const [adLayout, setAdLayout] = useState<AdSize[]>(["standard"]);

  useEffect(() => {
    if (!mainRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Stop measuring the layout if we are on legal pages
        if (activeTool === "privacy" || activeTool === "terms") {
            setAdLayout([]);
            continue;
        }

        const h = entry.contentRect.height;
        const TALL_H = 624; 
        const SHORT_H = 274; 
        
        let bestLayout: AdSize[] = [];
        let minWaste = h;

        const maxTall = Math.floor(h / TALL_H);
        for (let tallAds = 0; tallAds <= maxTall; tallAds++) {
          const remainder = h - (tallAds * TALL_H);
          const shortAds = Math.floor(remainder / SHORT_H);
          const waste = remainder - (shortAds * SHORT_H);

          if (waste < minWaste) {
            minWaste = waste;
            bestLayout = [
              ...Array(tallAds).fill("skyscraper"),
              ...Array(shortAds).fill("standard")
            ];
          }
        }
        
        if (bestLayout.length === 0) bestLayout = ["standard"];
        setAdLayout((prev) => JSON.stringify(prev) === JSON.stringify(bestLayout) ? prev : bestLayout);
      }
    });

    resizeObserver.observe(mainRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTool]); 

  // ==========================================
  // 1. FINANCIAL TOOLS STATE
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

  // 💱 Currency Converter State
  const [currAmount, setCurrAmount] = useState<number | "">(100);
  const [currFrom, setCurrFrom] = useState("GBP");
  const [currTo, setCurrTo] = useState("USD");
  const [currResult, setCurrResult] = useState<string | null>(null);
  const [currRate, setCurrRate] = useState<number | null>(null);
  const [currLoading, setCurrLoading] = useState(false);

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

  // 🏡 Loan / Mortgage Calc State
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

  // 📈 Compound Interest State
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

  // ==========================================
  // 2. MATH & NUMBERS TOOLS STATE
  // ==========================================
  
  const [pctValA, setPctValA] = useState<number | "">(20);
  const [pctValB, setPctValB] = useState<number | "">(150);
  const [pctMode, setPctMode] = useState<"pctOf" | "isWhatPct" | "pctDiff">("pctOf");

  const calculatePercentage = () => {
    const a = Number(pctValA) || 0;
    const b = Number(pctValB) || 0;
    if (pctMode === "pctOf") return (a / 100) * b;
    if (pctMode === "isWhatPct") return b ? (a / b) * 100 : 0;
    if (pctMode === "pctDiff") return a ? ((b - a) / a) * 100 : 0;
    return 0;
  };

  const [unitVal, setUnitVal] = useState<number | "">(1);
  const [unitFrom, setUnitFrom] = useState("kg");
  const [unitTo, setUnitTo] = useState("lbs");
  const convertUnits = () => {
    const val = Number(unitVal) || 0;
    const rates: Record<string, number> = { g: 1, kg: 1000, lbs: 453.592, oz: 28.3495 };
    return ((val * rates[unitFrom]) / rates[unitTo]).toFixed(4);
  };

  const [statsInput, setStatsInput] = useState("12, 15, 22, 29, 35, 42, 15");
  const calculateStats = () => {
    const nums = statsInput.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n !== 0 || n === 0);
    if (!nums.length) return { sum: 0, mean: 0, median: 0, min: 0, max: 0, count: 0 };
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return { sum, mean, median, min: sorted[0], max: sorted[sorted.length - 1], count: nums.length };
  };
  const statsData = calculateStats();

  const [primeLimit, setPrimeLimit] = useState<number | "">(100);
  const [primeResult, setPrimeResult] = useState("");
  const generatePrimes = () => {
    const limit = Number(primeLimit) || 100;
    if (limit > 100000) return setPrimeResult("Limit too high (max 100,000)");
    const isPrime = Array(limit + 1).fill(true);
    isPrime[0] = false; isPrime[1] = false;
    for (let p = 2; p * p <= limit; p++) {
      if (isPrime[p]) {
        for (let i = p * p; i <= limit; i += p) isPrime[i] = false;
      }
    }
    const primes = [];
    for (let p = 2; p <= limit; p++) if (isPrime[p]) primes.push(p);
    setPrimeResult(primes.join(", "));
  };

  const [baseInput, setBaseInput] = useState("255");
  const [baseFrom, setBaseFrom] = useState(10);
  const [baseTo, setBaseTo] = useState(16);
  const convertBase = () => {
    if (!baseInput) return "";
    try {
      const num = parseInt(baseInput, baseFrom);
      if (isNaN(num)) return "Invalid Input for chosen base";
      return num.toString(baseTo).toUpperCase();
    } catch {
      return "Error";
    }
  };

  // ==========================================
  // 3. TIME & DATE TOOLS STATE
  // ==========================================
  
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (swRunning) {
      const start = Date.now() - swTime;
      swRef.current = setInterval(() => setSwTime(Date.now() - start), 10);
    } else if (swRef.current) clearInterval(swRef.current);
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  const formatStopwatch = () => {
    const ms = Math.floor((swTime % 1000) / 10).toString().padStart(2, "0");
    const sec = Math.floor((swTime / 1000) % 60).toString().padStart(2, "0");
    const min = Math.floor((swTime / (1000 * 60)) % 60).toString().padStart(2, "0");
    return `${min}:${sec}.${ms}`;
  };

  const [cdInputMin, setCdInputMin] = useState<number | "">(5);
  const [cdTime, setCdTime] = useState(300);
  const [cdRunning, setCdRunning] = useState(false);
  const cdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cdRunning && cdTime > 0) {
      cdRef.current = setInterval(() => setCdTime((t) => t - 1), 1000);
    } else if (cdTime === 0 && cdRunning) {
      setCdRunning(false);
      alert("⏰ Countdown finished!");
    } else if (cdRef.current) clearInterval(cdRef.current);
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [cdRunning, cdTime]);

  const startCountdown = () => {
    setCdTime((Number(cdInputMin) || 1) * 60);
    setCdRunning(true);
  };

  const [dateA, setDateA] = useState("2026-01-01");
  const [dateB, setDateB] = useState("2026-12-31");
  const calculateDateDiff = () => {
    const d1 = new Date(dateA);
    const d2 = new Date(dateB);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days, weeks: (days / 7).toFixed(1), months: (days / 30.4375).toFixed(1) };
  };
  const dateDiffData = calculateDateDiff();

  const [dob, setDob] = useState("1995-06-15");
  const calculateAge = () => {
    if (!dob) return { years: 0, months: 0, days: 0 };
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }
    return { years, months, days };
  };
  const ageData = calculateAge();

  const [baseTime, setBaseTime] = useState("12:00");

  const convertTimezones = () => {
    const [hrs, mins] = baseTime.split(":").map(Number);
    const now = new Date();
    now.setHours(hrs || 0, mins || 0, 0, 0);

    const formatZone = (timeZone: string) => {
      try { return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: true }).format(now); } 
      catch { return "--:--"; }
    };

    return {
      London: formatZone("Europe/London"),
      NewYork: formatZone("America/New_York"),
      Tokyo: formatZone("Asia/Tokyo"),
      Sydney: formatZone("Australia/Sydney"),
    };
  };
  const tzData = convertTimezones();

  // ==========================================
  // 4. TEXT & LISTS TOOLS STATE
  // ==========================================
  
  const [text, setText] = useState("");
  const [caseText, setCaseText] = useState("");
  
  const [loremCount, setLoremCount] = useState<number | "">(3);
  const [loremLang, setLoremLang] = useState("latin");
  const [loremOutput, setLoremOutput] = useState("");

  const loremDictionary: Record<string, string> = {
    latin: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    english: "Synergy is the key to leveraging cross-platform deliverables and maximizing enterprise bandwidth. Moving forward, we need to drill down into core competencies.",
    spanish: "El texto alternativo es esencial para visualizar el diseño gráfico y la maquetación. Permite evaluar la distribution de los bloques de texto antes de redactar.",
    french: "Le texte factice est un outil indispensable pour la conception graphique et la mise en page. Il permet de tester la typographie et la structure visuelle.",
    german: "Blindtext ist ein Platzhaltertext, der in der Design- und Verlagsbranche verwendet wird. Er dient dazu, das visuelle Erscheinungsbild eines Dokuments zu demonstrieren."
  };

  const generateLorem = (countVal = loremCount, langVal = loremLang) => {
    const count = Math.max(1, Math.min(50, Number(countVal) || 1));
    const sample = loremDictionary[langVal] || loremDictionary.latin;
    const paragraphs = Array(count).fill(sample).join("\n\n");
    setLoremOutput(paragraphs);
  };

  const resetLorem = () => { setLoremCount(3); setLoremLang("latin"); generateLorem(3, "latin"); };
  useEffect(() => { generateLorem(); }, [loremCount, loremLang]);

  const [transInputText, setTransInputText] = useState("Hello world! Welcome to NexaKit.");
  const [transOutputText, setTransOutputText] = useState("");
  const [transFrom, setTransFrom] = useState("en");
  const [transTo, setTransTo] = useState("es");
  const [transLoading, setTransLoading] = useState(false);

  const translateText = async () => {
    if (!transInputText.trim()) { setTransOutputText(""); return; }
    setTransLoading(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(transInputText)}&langpair=${transFrom}|${transTo}`);
      const data = await res.json();
      setTransOutputText(data.responseData?.translatedText || "Translation failed.");
    } catch {
      setTransOutputText("Network error during translation request.");
    } finally { setTransLoading(false); }
  };

  const convertCase = (type: string) => {
    let str = caseText;
    if (type === "upper") str = str.toUpperCase();
    if (type === "lower") str = str.toLowerCase();
    if (type === "title") str = str.toLowerCase().replace(/(?:^|\s)\w/g, (m) => m.toUpperCase());
    if (type === "sentence") str = str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (m) => m.toUpperCase());
    setCaseText(str);
  };

  const [listInput, setListInput] = useState("Apple\nZebra\nBanana\nApple\nOrange");
  const [listOutput, setListOutput] = useState("");
  const processList = (action: string) => {
    let arr = listInput.split("\n").filter((i) => i.trim() !== "");
    if (action === "sort-asc") arr.sort((a, b) => a.localeCompare(b));
    if (action === "sort-desc") arr.sort((a, b) => b.localeCompare(a));
    if (action === "dedupe") arr = Array.from(new Set(arr));
    if (action === "reverse") arr.reverse();
    setListOutput(arr.join("\n"));
  };

  const [frInput, setFrInput] = useState("The quick brown fox jumps over the lazy fox.");
  const [frFind, setFrFind] = useState("fox");
  const [frReplace, setFrReplace] = useState("dog");
  const frOutput = frFind ? frInput.split(frFind).join(frReplace) : frInput;

  // ==========================================
  // 5. UTILITIES & JSON DEV STATE
  // ==========================================
  
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdUpper, setPwdUpper] = useState(true);
  const [pwdLower, setPwdLower] = useState(true);
  const [pwdNum, setPwdNum] = useState(true);
  const [pwdSym, setPwdSym] = useState(true);
  const [pwdOutput, setPwdOutput] = useState("");

  const generatePassword = () => {
    let charset = "";
    if (pwdUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (pwdNum) charset += "0123456789";
    if (pwdSym) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!charset) return setPwdOutput("Select at least 1 set");
    let res = "";
    for (let i = 0; i < pwdLength; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    setPwdOutput(res);
  };

  const [qrText, setQrText] = useState("https://example.com");
  const [qrSrc, setQrSrc] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com");

  const [pickerInput, setPickerInput] = useState("");
  const [pickerResult, setPickerResult] = useState("None");

  const [jsonInput, setJsonInput] = useState('{"name": "NexaKit", "status": "active", "tools": 25}');
  const [jsonOutput, setJsonOutput] = useState("");
  const formatJson = (space: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, space));
    } catch (e: any) {
      setJsonOutput("Invalid JSON: " + e.message);
    }
  };

  const [b64Input, setB64Input] = useState("Hello World");
  const [b64Output, setB64Output] = useState("");
  const processBase64 = (mode: "encode" | "decode") => {
    try {
      setB64Output(mode === "encode" ? btoa(b64Input) : atob(b64Input));
    } catch {
      setB64Output("Error: Invalid string for base64 operation.");
    }
  };

  const formatGBP = (val: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* ========================================== */}
      {/* TOP NAVIGATION HEADER WITH DROPDOWNS       */}
      {/* ========================================== */}
      <header className="bg-slate-900 text-white h-16 flex items-center border-b-4 border-blue-600 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center w-full px-4 md:px-8 max-w-[1600px] mx-auto justify-between">
          
          {/* Custom Unique Gradient Node Logo Badge */}
          <a href="#" onClick={() => setActiveTool("home")} className="text-xl font-extrabold flex items-center gap-2.5 pr-6 whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Nexa<span className="text-sky-400">Kit</span></span>
          </a>
          
          {/* Main Navbar Links */}
          <nav className="flex-1 flex justify-center items-center gap-4 md:gap-8 h-16 hidden md:flex">
            {navGroups.map((g, idx) => (
              <div key={idx} className="relative group h-full flex items-center cursor-pointer">
                {/* Navbar Tab */}
                <div className="text-sm font-semibold text-slate-300 group-hover:text-white transition flex items-center gap-1">
                  {g.group}
                  <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {/* Hover Dropdown Menu */}
                <div className="absolute top-[64px] left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-b-lg shadow-xl min-w-[260px] overflow-hidden z-[100] py-2">
                  {g.tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`text-left px-5 py-3 text-sm transition ${
                        activeTool === t.id ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 ml-auto lg:ml-6">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 dark:text-sky-300 transition-all flex items-center justify-center focus:outline-none"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            {/* KPI Badge */}
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap hidden lg:block">
              25 Utilities Suite
            </span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* PAGE LAYOUT WITH DYNAMIC AD COLUMNS        */}
      {/* ========================================== */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Left Ad Column */}
        <AdColumn side="left" layout={adLayout} />

        {/* Center Main Content Container */}
        <main ref={mainRef} className="flex-1 flex flex-col p-6 md:p-10 w-full max-w-5xl mx-auto min-w-0">
          
          <div className="flex-1">
            {/* TOOL 0: HOME DASHBOARD */}
            {activeTool === "home" && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                <div className="text-center py-6 md:py-10">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Welcome to <span className="text-blue-600 dark:text-sky-400">NexaKit</span></h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Select any of our 25 premium web utilities below to instantly format data, calculate finances, track time, or manage your everyday development needs.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {navGroups.map((group, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">{group.group}</h2>
                      <div className="flex flex-col gap-2">
                        {group.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className="text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-sky-300 font-semibold text-sm transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 flex items-center justify-between group"
                          >
                            {tool.label}
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEGAL: PRIVACY POLICY */}
            {activeTool === "privacy" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 dark:text-white">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Last updated: August 6, 2026</p>
                
                <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">1. Information We Collect</h2>
                    <p>NexaKit is designed as a client-side utility suite. The vast majority of our tools (such as the calculators, text formatters, and converters) process your data locally within your browser. We do not store or transmit your inputted text, files, or financial numbers to our servers.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">2. Google AdSense & Cookies</h2>
                    <p>To keep NexaKit free, we use Google AdSense to display advertisements. AdSense uses cookies to serve ads based on your prior visits to our website or other websites on the internet.</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                      <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
                      <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-sky-400 hover:underline">Google's Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-sky-400 hover:underline">www.aboutads.info</a>.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">3. Third-Party APIs</h2>
                    <p>Some tools, such as the Live Currency Converter or the Translation Tool, rely on external APIs (like Open Exchange Rates or MyMemory Translation). When you use these specific tools, your browser makes direct requests to these third-party services, which may log your IP address in accordance with their own respective privacy policies.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">4. Your Data Privacy Rights</h2>
                    <p>Depending on your location (such as under the GDPR or CCPA), you have the right to request access to, deletion of, or restriction of the processing of your personal data. Because we do not store your data on our servers, there is no account data to delete; however, you may clear your local browser cookies at any time to reset your advertising preferences.</p>
                  </section>
                </div>
              </div>
            )}

            {/* LEGAL: TERMS OF SERVICE */}
            {activeTool === "terms" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300 max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 dark:text-white">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Last updated: August 6, 2026</p>
                
                <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">1. Acceptance of Terms</h2>
                    <p>By accessing and using NexaKit, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our tools.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">2. Disclaimer of Warranties</h2>
                    <p>All utilities provided by NexaKit, including financial calculators and data converters, are provided "as is" without warranty of any kind. While we strive for accuracy, we do not guarantee that the results generated by our tools are 100% accurate, complete, or reliable. You should independently verify any critical financial or technical data before making decisions based upon it.</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-3 dark:text-white">3. Limitation of Liability</h2>
                    <p>In no event shall NexaKit or its creators be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our tools.</p>
                  </section>
                </div>
              </div>
            )}

            {/* TOOL 1: UK INCOME TAX CALCULATOR */}
            {activeTool === "tax-calculator" && (
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white">UK Income Tax & Take-Home Calculator</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Advanced salary tax breakdown with Region, Pension Type, Allowances & NI Letters.</p>
                    </div>
                    <button onClick={resetTaxCalculator} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg">Reset All</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold mb-2 dark:text-slate-300">Salary Amount</label>
                      <div className="flex gap-2">
                        <span className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-slate-300">£</span>
                        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))} className="flex-1 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" placeholder="0" />
                        <select value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value as any)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white">
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
                    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-blue-700 dark:text-sky-400 uppercase tracking-wider">Take-Home (Yearly)</span><span className="block text-3xl font-extrabold text-blue-900 dark:text-sky-200 mt-1">{formatGBP(taxData.net)}</span></div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Take-Home (Monthly)</span><span className="block text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">{formatGBP(taxData.net / 12)}</span></div>
                    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-center"><span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Deductions</span><span className="block text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">{formatGBP(taxData.deductions)}</span></div>
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

            {/* FINANCIAL: Live Currency Converter */}
            {activeTool === "currency-converter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
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

                  {/* Swap Button */}
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

                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Converted Value:</span>
                    {currRate && !currLoading && (
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        Rate: 1 {currFrom} = {currRate.toFixed(4)} {currTo}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400">
                    {currLoading ? "Fetching rate..." : `${currResult || "0.00"} ${currTo}`}
                  </span>
                </div>
              </div>
            )}

            {/* FINANCIAL: Loan / Mortgage Calculator */}
            {activeTool === "loan-calc" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Mortgage & Loan Repayment Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Calculate monthly repayments, total interest, and the true cost of your mortgage or loan.</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Loan Amount (£)</label><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Interest Rate (%)</label><input type="number" step="0.1" value={loanInterest} onChange={(e) => setLoanInterest(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Term (Years)</label><input type="number" value={loanYears} onChange={(e) => setLoanYears(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">MONTHLY PAYMENT</span><span className="block text-2xl font-black text-blue-900 dark:text-sky-200 mt-1">{formatGBP(loanData.monthly)}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs text-slate-600 dark:text-slate-400 font-bold">TOTAL REPAID</span><span className="block text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">{formatGBP(loanData.totalPay)}</span></div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-center"><span className="text-xs text-amber-600 dark:text-amber-400 font-bold">TOTAL INTEREST</span><span className="block text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">{formatGBP(loanData.interest)}</span></div>
                </div>
              </div>
            )}

            {/* FINANCIAL: Compound Interest Calculator */}
            {activeTool === "compound-calc" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Compound Interest Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Project future investment growth using compound interest formulas.</p>
                <div className="grid grid-cols-4 gap-4 mb-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">FUTURE BALANCE</span><span className="block text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">{formatGBP(ciData.total)}</span></div>
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs text-blue-600 dark:text-sky-400 font-bold">INTEREST EARNED</span><span className="block text-3xl font-black text-blue-900 dark:text-sky-200 mt-1">{formatGBP(ciData.interest)}</span></div>
                </div>
              </div>
            )}

            {/* MATH: Percentage Calculator */}
            {activeTool === "pct-calc" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Percentage Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Easily calculate percentages, ratios, and percentage differences.</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Calculation Type</label>
                    <select value={pctMode} onChange={(e) => setPctMode(e.target.value as any)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white">
                      <option value="pctOf">What is X% of Y?</option>
                      <option value="isWhatPct">X is what % of Y?</option>
                      <option value="pctDiff">% Increase/Decrease from X to Y</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value X</label><input type="number" value={pctValA} onChange={(e) => setPctValA(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value Y</label><input type="number" value={pctValB} onChange={(e) => setPctValB(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Calculated Output:</span>
                  <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400">{calculatePercentage().toFixed(2)}{pctMode !== "pctOf" ? "%" : ""}</span>
                </div>
              </div>
            )}

            {/* MATH: Unit Converter */}
            {activeTool === "unit-converter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Metric / Unit Converter</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert weights, measurements, and volumes between metric and imperial units.</p>
                <div className="mb-4"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Value</label><input type="number" value={unitVal} onChange={(e) => setUnitVal(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">From</label><select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="kg">Kilograms (kg)</option><option value="g">Grams (g)</option><option value="lbs">Pounds (lbs)</option><option value="oz">Ounces (oz)</option></select></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">To</label><select value={unitTo} onChange={(e) => setUnitTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="lbs">Pounds (lbs)</option><option value="kg">Kilograms (kg)</option><option value="g">Grams (g)</option><option value="oz">Ounces (oz)</option></select></div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-slate-200 dark:border-slate-700"><span className="text-sm font-semibold dark:text-slate-300">Result:</span><span className="text-xl font-mono font-bold dark:text-sky-400">{convertUnits()} {unitTo}</span></div>
              </div>
            )}

            {/* MATH: Statistics Calculator */}
            {activeTool === "stats-calc" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Statistics & Average Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly find the sum, mean, median, minimum, and maximum of any dataset.</p>
                <textarea value={statsInput} onChange={(e) => setStatsInput(e.target.value)} className="w-full h-24 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" placeholder="Enter numbers separated by spaces or commas" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">MEAN (AVERAGE)</span><span className="block text-2xl font-bold text-blue-600 dark:text-sky-400 mt-1">{statsData.mean.toFixed(2)}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">MEDIAN</span><span className="block text-2xl font-bold text-blue-600 dark:text-sky-400 mt-1">{statsData.median}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">SUM</span><span className="block text-2xl font-bold text-blue-600 dark:text-sky-400 mt-1">{statsData.sum}</span></div>
                </div>
              </div>
            )}

            {/* MATH: Prime Number Generator */}
            {activeTool === "prime-gen" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Prime Number Generator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate a list of prime numbers up to your specified limit.</p>
                <div className="flex gap-4 items-end mb-6">
                  <div className="flex-1">
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Upper Limit (Max 100,000)</label>
                    <input type="number" value={primeLimit} onChange={(e) => setPrimeLimit(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  </div>
                  <button onClick={generatePrimes} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg">Generate Primes</button>
                </div>
                <textarea readOnly value={primeResult} placeholder="Primes will appear here..." className="w-full h-48 p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 font-mono text-sm leading-relaxed dark:text-white" />
              </div>
            )}

            {/* MATH: Base Converter */}
            {activeTool === "base-converter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Number Base Converter</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert numbers between Binary, Octal, Decimal, and Hexadecimal bases.</p>
                <div className="mb-4">
                  <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input Value</label>
                  <input type="text" value={baseInput} onChange={(e) => setBaseInput(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-mono uppercase dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Convert From</label>
                    <select value={baseFrom} onChange={(e) => setBaseFrom(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white">
                      <option value={2}>Binary (Base 2)</option><option value={8}>Octal (Base 8)</option><option value={10}>Decimal (Base 10)</option><option value={16}>Hexadecimal (Base 16)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Convert To</label>
                    <select value={baseTo} onChange={(e) => setBaseTo(Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-medium dark:text-white">
                      <option value={2}>Binary (Base 2)</option><option value={8}>Octal (Base 8)</option><option value={10}>Decimal (Base 10)</option><option value={16}>Hexadecimal (Base 16)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Converted Result:</span>
                  <span className="text-2xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all">{convertBase()}</span>
                </div>
              </div>
            )}

            {/* TIME: Stopwatch */}
            {activeTool === "stopwatch" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Precision Stopwatch</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">A highly accurate digital stopwatch with millisecond precision.</p>
                <div className="text-5xl font-mono font-bold my-8 dark:text-white">{formatStopwatch()}</div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setSwRunning(true)} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">Start</button>
                  <button onClick={() => setSwRunning(false)} className="bg-slate-600 text-white font-semibold px-6 py-2 rounded-lg">Pause</button>
                  <button onClick={() => { setSwRunning(false); setSwTime(0); }} className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg">Reset</button>
                </div>
              </div>
            )}

            {/* TIME: Countdown Timer */}
            {activeTool === "countdown" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Countdown Timer</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Set a custom timer that counts down to zero in minutes and seconds.</p>
                <div className="flex justify-center items-center gap-3 my-4">
                  <input type="number" value={cdInputMin} onChange={(e) => setCdInputMin(e.target.value === "" ? "" : Number(e.target.value))} className="p-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded w-24 text-center font-bold dark:text-white" />
                  <span className="text-sm font-semibold dark:text-slate-300">Minutes</span>
                </div>
                <div className="text-5xl font-mono font-bold my-6 dark:text-white">{Math.floor(cdTime / 60).toString().padStart(2, "0")}:{(cdTime % 60).toString().padStart(2, "0")}</div>
                <div className="flex justify-center gap-3">
                  <button onClick={startCountdown} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">Start</button>
                  <button onClick={() => setCdRunning(false)} className="bg-slate-600 text-white font-semibold px-6 py-2 rounded-lg">Pause</button>
                </div>
              </div>
            )}

            {/* TIME: Date Difference Calc */}
            {activeTool === "date-diff" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Date Difference Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Find the exact number of days, weeks, and months between two dates.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Start Date</label><input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">End Date</label><input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-blue-600 dark:text-sky-400">DAYS</span><span className="block text-2xl font-bold text-blue-900 dark:text-sky-200 mt-1">{dateDiffData.days}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs font-bold text-slate-600 dark:text-slate-400">WEEKS</span><span className="block text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{dateDiffData.weeks}</span></div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">MONTHS</span><span className="block text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">{dateDiffData.months}</span></div>
                </div>
              </div>
            )}

            {/* TIME: Age Calculator */}
            {activeTool === "age-calc" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Age Calculator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Calculate precise age in years, months, and days from a birthdate.</p>
                <div className="mb-6"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Date of Birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-blue-600 dark:text-sky-400">YEARS</span><span className="block text-3xl font-black text-blue-900 dark:text-sky-200 mt-1">{ageData.years}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center"><span className="text-xs font-bold text-slate-600 dark:text-slate-400">MONTHS</span><span className="block text-3xl font-black text-slate-800 dark:text-slate-200 mt-1">{ageData.months}</span></div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center"><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">DAYS</span><span className="block text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-1">{ageData.days}</span></div>
                </div>
              </div>
            )}

            {/* TIME: Timezone Converter */}
            {activeTool === "timezone" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">World Clock & Timezone Converter</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Compare local time against major global timezones like London, New York, Tokyo, and Sydney.</p>
                <div className="mb-6"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Local Time</label><input type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-bold dark:text-white" /></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">LONDON (BST/GMT)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.London}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">NEW YORK (EST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.NewYork}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">TOKYO (JST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.Tokyo}</span></div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700"><span className="text-xs font-bold text-slate-500 dark:text-slate-400">SYDNEY (AEST)</span><span className="block text-xl font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{tzData.Sydney}</span></div>
                </div>
              </div>
            )}

            {/* TEXT: Word Counter */}
            {activeTool === "word-counter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Word & Character Counter</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Count the total number of characters and words in your text.</p>
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text..." className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" />
                <div className="grid grid-cols-2 gap-4"><div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold dark:text-slate-200">Characters <span className="block text-2xl text-blue-600 dark:text-sky-400">{text.length}</span></div><div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold dark:text-slate-200">Words <span className="block text-2xl text-blue-600 dark:text-sky-400">{text.trim() ? text.trim().split(/\s+/).length : 0}</span></div></div>
              </div>
            )}

            {/* TEXT: Case Converter */}
            {activeTool === "case-converter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Text Case Converter</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Quickly reformat text to uppercase, lowercase, or title case.</p>
                <textarea value={caseText} onChange={(e) => setCaseText(e.target.value)} placeholder="Enter text..." className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-6 dark:text-white" />
                <div className="flex gap-3"><button onClick={() => convertCase("upper")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">UPPERCASE</button><button onClick={() => convertCase("lower")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">lowercase</button><button onClick={() => convertCase("title")} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg">Title Case</button></div>
              </div>
            )}

            {/* TEXT: List Sorter & Deduplicator */}
            {activeTool === "list-tools" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">List Sorter & Deduplicator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Alphabetize, reverse, and remove duplicates from your lists instantly.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input List (One item per line)</label>
                    <textarea value={listInput} onChange={(e) => setListInput(e.target.value)} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white whitespace-pre-wrap" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Processed Output</label>
                    <textarea readOnly value={listOutput} placeholder="Action result..." className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white whitespace-pre-wrap" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <button onClick={() => processList("sort-asc")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Sort A-Z</button>
                  <button onClick={() => processList("sort-desc")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Sort Z-A</button>
                  <button onClick={() => processList("reverse")} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg">Reverse Order</button>
                  <button onClick={() => processList("dedupe")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg">Remove Duplicates</button>
                </div>
              </div>
            )}

            {/* TEXT: Find & Replace */}
            {activeTool === "find-replace" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Find & Replace Text</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Search for specific words or phrases and replace them across your text.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Find string</label>
                    <input type="text" value={frFind} onChange={(e) => setFrFind(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="e.g. apple" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Replace with</label>
                    <input type="text" value={frReplace} onChange={(e) => setFrReplace(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" placeholder="e.g. orange" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Original Text</label>
                    <textarea value={frInput} onChange={(e) => setFrInput(e.target.value)} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 dark:text-slate-300">Output Text</label>
                    <textarea readOnly value={frOutput} className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* TEXT: Dummy Lorem */}
            {activeTool === "lorem-gen" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 dark:text-white">Dummy Lorem Generator</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate dummy placeholder text for mockups and UI designs in multiple languages.</p>
                  </div>
                  <button onClick={resetLorem} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg">Reset</button>
                </div>
                <div className="flex gap-4 items-end mb-4"><input type="number" min="1" max="50" value={loremCount} onChange={(e) => setLoremCount(Number(e.target.value))} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg w-24 dark:text-white" />
                  <select value={loremLang} onChange={(e) => setLoremLang(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg flex-1 dark:text-white"><option value="latin">Latin</option><option value="english">English</option><option value="spanish">Spanish</option><option value="french">French</option><option value="german">German</option></select>
                  <button onClick={() => generateLorem()} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg">Generate</button>
                </div>
                <textarea readOnly value={loremOutput} className="w-full h-44 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white" />
              </div>
            )}

            {/* TEXT: Language Converter */}
            {activeTool === "lang-converter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Language Converter & Translator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Translate blocks of text between English, Spanish, French, and German.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Source</label><select value={transFrom} onChange={(e) => setTransFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option></select></div>
                  <div><label className="block text-xs font-bold mb-2 dark:text-slate-300">Target</label><select value={transTo} onChange={(e) => setTransTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white"><option value="es">Spanish</option><option value="en">English</option><option value="fr">French</option><option value="de">German</option></select></div>
                </div>
                <div className="mb-4"><textarea value={transInputText} onChange={(e) => setTransInputText(e.target.value)} className="w-full h-28 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white" /></div>
                <button onClick={translateText} disabled={transLoading} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-6 disabled:bg-slate-400">{transLoading ? "Translating..." : "Translate Text"}</button>
                <div className="w-full min-h-[100px] p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg dark:text-white">{transOutputText}</div>
              </div>
            )}

            {/* DEV: JSON Formatter & Minify */}
            {activeTool === "json-formatter" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">JSON Formatter & Minifier</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Format, prettify, or minify your raw JSON data.</p>
                
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Raw JSON Input</label>
                <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="w-full h-40 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg font-mono text-sm mb-4 dark:text-white" />
                
                <div className="flex gap-3 mb-6">
                  <button onClick={() => formatJson(2)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Prettify JSON</button>
                  <button onClick={() => formatJson(0)} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg">Minify JSON</button>
                </div>

                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Processed Output</label>
                <textarea readOnly value={jsonOutput} placeholder="Formatted JSON will appear here..." className="w-full h-48 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg font-mono text-sm dark:text-white" />
              </div>
            )}

            {/* DEV: Base64 Encoder / Decoder */}
            {activeTool === "base64" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Base64 Encoder / Decoder</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Encode raw strings into Base64 or decode Base64 back into readable text.</p>
                
                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Input String</label>
                <textarea value={b64Input} onChange={(e) => setB64Input(e.target.value)} className="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
                
                <div className="flex gap-3 mb-6">
                  <button onClick={() => processBase64("encode")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg">Encode to Base64</button>
                  <button onClick={() => processBase64("decode")} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-6 py-2 rounded-lg">Decode from Base64</button>
                </div>

                <label className="block text-xs font-bold mb-2 dark:text-slate-300">Output</label>
                <textarea readOnly value={b64Output} className="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg font-mono break-all dark:text-white" />
              </div>
            )}

            {/* DEV: Key Generator */}
            {activeTool === "password-gen" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Key & Password Generator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate secure, randomized passwords or API keys with custom requirements.</p>
                <div className="mb-4"><label className="block text-xs font-bold mb-2 dark:text-slate-300">Length: {pwdLength}</label><input type="range" min="6" max="64" value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))} className="w-full" /></div>
                <button onClick={generatePassword} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-4">Generate Key</button>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono break-all dark:text-white">{pwdOutput || "Click Generate"}</div>
              </div>
            )}

            {/* DEV: QR Maker */}
            {activeTool === "qr-maker" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">QR Code Generator</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Instantly generate a scannable QR code from any URL or text input.</p>
                <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
                <button onClick={() => setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`)} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-6">Generate QR Code</button>
                <div className="flex justify-center"><img src={qrSrc} alt="QR Code" className="p-3 border border-slate-200 dark:border-slate-700 bg-white rounded-lg" /></div>
              </div>
            )}

            {/* DEV: Random Picker */}
            {activeTool === "random-picker" && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-1 dark:text-white">Unbiased Random Picker</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Input a list of options and let the tool pick one at random.</p>
                <textarea value={pickerInput} onChange={(e) => setPickerInput(e.target.value)} placeholder={"Option 1\nOption 2"} className="w-full h-36 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg mb-4 dark:text-white" />
                <button onClick={() => { const opts = pickerInput.split("\n").filter(Boolean); setPickerResult(opts.length ? opts[Math.floor(Math.random() * opts.length)] : "No options!"); }} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg mb-6">Pick Option</button>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex justify-between font-bold"><span className="dark:text-slate-300">Selected:</span><span className="text-blue-600 dark:text-sky-400">{pickerResult}</span></div>
              </div>
            )}
          </div>
          
          {/* ========================================== */}
          {/* BOTTOM LAZY-LOADED AD BANNER               */}
          {/* ========================================== */}
          <LazyAd index={99} type="banner" />

        </main>

        {/* Right Ad Column */}
        <AdColumn side="right" layout={adLayout} />

      </div>

      {/* ========================================== */}
      {/* SITE FOOTER                                */}
      {/* ========================================== */}
      <footer className="w-full bg-slate-900 border-t-4 border-slate-800 text-slate-400 py-8 text-center text-sm mt-auto relative z-50">
        <div className="flex justify-center gap-8 mb-3">
          <button onClick={() => setActiveTool("home")} className="hover:text-white transition">Home Dashboard</button>
          <button onClick={() => setActiveTool("privacy")} className="hover:text-white transition">Privacy Policy</button>
          <button onClick={() => setActiveTool("terms")} className="hover:text-white transition">Terms of Service</button>
        </div>
        <p>&copy; {new Date().getFullYear()} NexaKit Suite. All rights reserved.</p>
      </footer>

    </div>
  );
}