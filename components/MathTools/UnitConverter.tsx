"use client";

import { useState } from "react";

const conversionRates: Record<string, Record<string, number>> = {
  Length: { Meters: 1, Kilometers: 0.001, Centimeters: 100, Millimeters: 1000, Miles: 0.000621371, Yards: 1.09361, Feet: 3.28084, Inches: 39.3701 },
  Weight: { Kilograms: 1, Grams: 1000, Milligrams: 1000000, MetricTons: 0.001, Pounds: 2.20462, Ounces: 35.274 },
  Area: { SqMeters: 1, SqKilometers: 0.000001, Hectares: 0.0001, Acres: 0.000247105, SqMiles: 0.0000003861, SqFeet: 10.7639 },
};

export default function UnitConverter({ activeTool }: { activeTool: string }) {
  if (activeTool !== "unit-converter") return null;

  const [category, setCategory] = useState("Length");
  const [valFrom, setValFrom] = useState<number | "">(1);
  const [unitFrom, setUnitFrom] = useState("Meters");
  const [unitTo, setUnitTo] = useState("Feet");

  const units = Object.keys(conversionRates[category]);

  // If category changes, reset units safely
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const newUnits = Object.keys(conversionRates[cat]);
    setUnitFrom(newUnits[0]);
    setUnitTo(newUnits[1]);
  };

  const convert = () => {
    if (valFrom === "") return "0.00";
    const baseValue = Number(valFrom) / conversionRates[category][unitFrom];
    const result = baseValue * conversionRates[category][unitTo];
    return parseFloat(result.toFixed(6)).toString(); // Remove trailing zeros
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold mb-1 dark:text-white">Metric & Unit Converter</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Convert length, weight, and area with high precision.</p>

      <div className="mb-6">
        <label className="block text-xs font-bold mb-2 dark:text-slate-300">Measurement Category</label>
        <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full md:w-64 p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
          {Object.keys(conversionRates).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex flex-col md:flex-row items-end gap-3 mb-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">Amount</label>
          <input type="number" value={valFrom} onChange={(e) => setValFrom(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">From</label>
          <select value={unitFrom} onChange={(e) => setUnitFrom(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
            {units.map(u => <option key={`from-${u}`} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold mb-2 dark:text-slate-300">To</label>
          <select value={unitTo} onChange={(e) => setUnitTo(e.target.value)} className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg dark:text-white font-medium">
            {units.map(u => <option key={`to-${u}`} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Converted Value:</span>
        <span className="text-2xl md:text-3xl font-mono font-bold text-blue-600 dark:text-sky-400 break-all text-right">{convert()} <span className="text-lg text-slate-500">{unitTo}</span></span>
      </div>
    </div>
  );
}