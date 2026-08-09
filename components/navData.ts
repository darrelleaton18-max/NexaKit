export type ToolItem = {
  id: string;
  label: string;
  regions?: string[]; // E.g., ["UK", "US", "EU"] - If undefined, it shows everywhere
};

export type NavGroup = {
  group: string;
  tools: ToolItem[];
};

export const navGroups: NavGroup[] = [
  {
    group: "💰 Finance Calculators", // Renamed!
    tools: [
      { id: "tax-calculator", label: "Income Tax Calculator" }, // Global (Has toggle)
      { id: "currency-converter", label: "Currency Converter" },
      { id: "loan-calc", label: "Mortgage & Loan", regions: ["UK"] }, // Restricting as a test!
      { id: "compound-calc", label: "Compound Interest" },
      { id: "comp-calc", label: "Total Comp Calculator" },
      { id: "time-to-buy", label: "Time-to-Buy Planner" },
      { id: "fee-auditor", label: "Bank Fee Auditor" },
    ],
  },
  {
    group: "📊 Finance Trackers", // Renamed!
    tools: [
      { id: "net-worth", label: "Net Worth Tracker" },
      { id: "budget-planner", label: "Zero-Based Budget" },
      { id: "sub-tracker", label: "Subscription Audit" },
      { id: "debt-dash", label: "Debt Snowball Simulator" },
      { id: "savings-goal", label: "Emergency Fund Goal" },
      { id: "envelope-budget", label: "Envelope Budget" },
      { id: "freelance-log", label: "Freelance Expense Log" },
    ],
  },
  {
    group: "🧮 Math",
    tools: [
      { id: "pct-calc", label: "Percentage Calculator" },
      { id: "unit-converter", label: "Metric / Unit Converter" },
      { id: "stats-calc", label: "Statistics Calculator" },
      { id: "prime-gen", label: "Prime Number Generator" },
      { id: "base-converter", label: "Number Base Converter" },
    ],
  },
  {
    group: "⏱️ Time",
    tools: [
      { id: "stopwatch", label: "Precision Stopwatch" },
      { id: "countdown", label: "Countdown Timer" },
      { id: "date-diff", label: "Date Difference Calc" },
      { id: "age-calc", label: "Age Calculator" },
      { id: "timezone", label: "World Clock / Timezones" },
    ],
  },
  {
    group: "📝 Text",
    tools: [
      { id: "word-counter", label: "Word & Character Counter" },
      { id: "case-converter", label: "Text Case Converter" },
      { id: "list-tools", label: "List Sorter & Deduplicator" },
      { id: "find-replace", label: "Find & Replace Text" },
      { id: "lorem-gen", label: "Dummy Lorem Generator" },
      { id: "lang-converter", label: "Text Encoder (Morse/NATO)" },
      { id: "translator", label: "Live Language Translator" },
    ],
  },
  {
    group: "📄 Documents",
    tools: [
      { id: "pdf-studio", label: "PDF Studio (Merge & Edit)" },
    ],
  },
  {
    group: "🛠️ Dev",
    tools: [
      { id: "json-format", label: "JSON Formatter / Minify" },
      { id: "base64", label: "Base64 Encoder / Decoder" },
      { id: "url-encode", label: "URL Encoder & Decoder" },
      { id: "hash-gen", label: "Secure Hash Generator" },
      { id: "color-conv", label: "Color Space Converter" },
      { id: "qr-maker", label: "QR Code Generator" },
    ],
  },
  {
    group: "🎲 Random",
    tools: [
      { id: "password-gen", label: "Secure Password Generator" },
      { id: "num-gen", label: "Random Number Gen" },
      { id: "uuid-gen", label: "UUID / GUID Generator" },
      { id: "dice-coin", label: "Dice Roller & Coin Flip" },
      { id: "username-gen", label: "Random Username Gen" },
      { id: "wheel-gen", label: "Spinning Decision Wheel" },
    ],
  },
  {
    group: "🖼️ Media",
    tools: [
      { id: "image-tools", label: "PNG & Image Studio" },
      { id: "jpg-tools", label: "JPEG Optimizer" },
      { id: "gif-tools", label: "GIF Converter" },
    ],
  },
];