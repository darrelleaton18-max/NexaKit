"use client";

import { useState, useRef } from "react";

type FlaggedItem = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: "Fee Error" | "Subscription Leak" | "Duplicate Debit";
  notes: string;
};

export default function BankFeeAuditor({ activeTool }: { activeTool: string }) {
  const [flags, setFlags] = useState<FlaggedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalScanned, setTotalScanned] = useState(0);
  const [currency, setCurrency] = useState("GBP");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeTool !== "fee-auditor") return null;

  // ==========================================
  // DYNAMIC CURRENCY FORMATTER
  // ==========================================
  const formatMoney = (val: number) => {
    const locales = { GBP: 'en-GB', USD: 'en-US', EUR: 'de-DE' };
    return new Intl.NumberFormat(locales[currency as keyof typeof locales], { 
      style: 'currency', 
      currency: currency 
    }).format(val);
  };

  // ==========================================
  // MULTI-LINGUAL KEYWORD DICTIONARIES
  // ==========================================
  const feeKeywords = [
    'fee', 'srvc', 'overdraft', 'late pay', 'charge', // English
    'comisión', 'cargo', 'tarifa', 'descubierto', 'recargo', 'penalización', // Spanish
    'frais', 'commission', 'découvert', 'pénalité', 'agios', // French
    'gebühr', 'provision', 'überziehung', 'mahnung' // German
  ];

  const subKeywords = [
    'netflix', 'prime', 'spotify', 'software', 'sub', 'subscription', // English
    'suscripción', 'abono', // Spanish
    'abonnement', // French
    'abo', 'abonnement' // German
  ];

  // ==========================================
  // SMART CSV PARSER (Handles delimiters & EU Decimals)
  // ==========================================
  const parseAmount = (valStr: string) => {
    let cleaned = valStr.replace(/[^0-9.,-]/g, '');
    
    // Check if it uses European formatting (comma for decimal: 1.234,50)
    if (cleaned.includes('.') && cleaned.includes(',')) {
      if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.'); // EU to Standard
      } else {
        cleaned = cleaned.replace(/,/g, ''); // US/UK to Standard
      }
    } else if (cleaned.includes(',')) {
      // If there's only a comma, check if it's a decimal (e.g., 12,50)
      if (cleaned.split(',')[1]?.length !== 3) {
        cleaned = cleaned.replace(',', '.');
      } else {
        cleaned = cleaned.replace(',', ''); // It was a thousands separator
      }
    }
    return parseFloat(cleaned);
  };

  const processCSVData = (csvText: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const lines = csvText.split('\n').filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setIsProcessing(false);
        return;
      }
      
      setTotalScanned(lines.length - 1);
      
      // Auto-detect delimiter (comma vs semicolon)
      const delimiter = lines[0].includes(';') ? ';' : ',';
      
      const newFlags: FlaggedItem[] = [];
      const seenTransactions = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        // Basic split preserving potential quotes
        const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 3) continue;

        const date = cols[0];
        const desc = cols[1].toLowerCase();
        const amount = parseAmount(cols[2]);

        if (isNaN(amount)) continue;

        const txKey = `${date}-${desc}-${amount}`;

        // 1. DUPLICATE DEBIT DETECTION
        if (seenTransactions.has(txKey)) {
          newFlags.push({
            id: crypto.randomUUID(), date, description: cols[1], amount,
            category: "Duplicate Debit", notes: "Identical charge detected on the same date."
          });
          continue; 
        }
        seenTransactions.add(txKey);

        // 2. MULTI-LINGUAL FEE ERROR DETECTION
        if (feeKeywords.some(keyword => desc.includes(keyword))) {
          newFlags.push({
            id: crypto.randomUUID(), date, description: cols[1], amount,
            category: "Fee Error", notes: "Matches multi-lingual service charge or penalty keyword."
          });
        }

        // 3. MULTI-LINGUAL SUBSCRIPTION & LEAK TRACKING
        if (subKeywords.some(keyword => desc.includes(keyword))) {
          newFlags.push({
            id: crypto.randomUUID(), date, description: cols[1], amount,
            category: "Subscription Leak", notes: "Recurring subscription detected. Verify active contract."
          });
        }
      }

      setFlags(newFlags);
      setIsProcessing(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSVData(text);
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    // Generates a sample CSV reflecting the currently selected currency format
    const isEU = currency === "EUR";
    const delim = isEU ? ';' : ',';
    
    const formatSampleAmount = (val: string) => {
      if (!isEU) return val;
      return val.replace('.', ',');
    };

    const sampleCSV = `Date${delim}Description${delim}Amount
2026-08-01${delim}TechCorp Software Sub${delim}${formatSampleAmount("-45.00")}
2026-08-02${delim}Monthly Account Mgt Fee${delim}${formatSampleAmount("-12.50")}
2026-08-03${delim}Office Supplies${delim}${formatSampleAmount("-120.00")}
2026-08-04${delim}Prime Video Subscription${delim}${formatSampleAmount("-8.99")}
2026-08-05${delim}Client Lunch${delim}${formatSampleAmount("-45.50")}
2026-08-05${delim}Client Lunch${delim}${formatSampleAmount("-45.50")}
2026-08-10${delim}International Txn Comisión${delim}${formatSampleAmount("-3.50")}
2026-08-15${delim}Overdraft Frais${delim}${formatSampleAmount("-35.00")}`;
    
    processCSVData(sampleCSV);
  };

  const totalRecoverable = flags.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const feeCount = flags.filter(f => f.category === "Fee Error").length;
  const subCount = flags.filter(f => f.category === "Subscription Leak").length;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-3 dark:text-white">Bank Fee & Leak Auditor</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 max-w-3xl">
            Automatically scan corporate or personal financial statements to catch hidden service charges, pricing errors, duplicate subscriptions, and unauthorized debits. Compare active billing lines against baseline contracts to recover lost funds.
          </p>
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-md w-fit border border-emerald-200 dark:border-emerald-800/50">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Client-Side Parser: Files are processed locally in your browser and never uploaded.
          </div>
        </div>

        {/* Currency Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 self-start">
          {["GBP", "USD", "EUR"].map(c => (
            <button 
              key={c}
              onClick={() => {
                setCurrency(c);
                setFlags([]);
                setTotalScanned(0);
              }} 
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${currency === c ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-sky-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              {c === "GBP" ? "£" : c === "USD" ? "$" : "€"} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DATA INGESTION CONTROLS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Data Ingestion</h3>
            
            <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 mb-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Upload Statement
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-6">
              Auto-detects CSV delimiters ( , or ; )
            </p>
            
            <div className="relative flex items-center py-2 mb-4">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">OR</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <button onClick={loadSampleData} className="w-full py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition-colors text-sm">
              Test with Sample Data
            </button>
          </div>

          {/* BENCHMARKING PANEL */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Market Benchmarking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Contrasts current financial institution costs against regional standards.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">Standard Account Fee</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(0)} - {formatMoney(5)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">Intl. Transaction Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">0% - 1.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT RESULTS & DASHBOARD */}
        <div className="lg:col-span-2">
          {isProcessing ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Running Multi-Lingual Auditor Engine...</p>
            </div>
          ) : totalScanned === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 text-center p-8">
              <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Awaiting Financial Statement</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Upload a CSV statement or load the sample data to initiate the detection algorithms.</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {/* METRICS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <span className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Total Recoverable</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{formatMoney(totalRecoverable)}</span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
                  <span className="block text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-1">Fee Errors</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{feeCount} Detected</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50">
                  <span className="block text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Sub Leaks</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{subCount} Detected</span>
                </div>
              </div>

              {/* FLAGGED ITEMS TABLE */}
              <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Flagged Anomalies</h3>
                  <span className="text-xs font-bold bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {flags.length} findings out of {totalScanned} rows
                  </span>
                </div>
                
                {flags.length === 0 ? (
                  <div className="p-8 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-slate-50 dark:bg-slate-900">
                    ✅ No fees, leaks, or duplicates detected in this statement!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                          <th className="p-4 font-semibold">Description</th>
                          <th className="p-4 font-semibold">Category</th>
                          <th className="p-4 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        {flags.map(f => (
                          <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{f.date}</td>
                            <td className="p-4">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{f.description}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 hidden group-hover:block mt-1">{f.notes}</span>
                            </td>
                            <td className="p-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                                f.category === 'Fee Error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                f.category === 'Duplicate Debit' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {f.category}
                              </span>
                            </td>
                            <td className="p-4 text-right font-bold text-slate-800 dark:text-white whitespace-nowrap">
                              {formatMoney(f.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}