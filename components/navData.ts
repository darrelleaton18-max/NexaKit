export type ToolItem = {
  id: string;
  label: string;
  description?: string; // <--- Add this exact line! The '?' makes it optional.
  regions?: string[]; // E.g., ["UK", "US", "EU"] - If undefined, it shows everywhere
};

export type NavGroup = {
  group: string;
  tools: ToolItem[];
};

export const navGroups: NavGroup[] = [
  {
    group: "Finance Calculators", // Renamed!
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
    group: "Finance Trackers", // Renamed!
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
    group: "Math",
    tools: [
      { id: "pct-calc", label: "Percentage Calculator" },
      { id: "unit-converter", label: "Metric / Unit Converter" },
      { id: "stats-calc", label: "Statistics Calculator" },
      { id: "prime-gen", label: "Prime Number Generator" },
      { id: "base-converter", label: "Number Base Converter" },
    ],
  },
  {
    group: "Time",
    tools: [
      { id: "stopwatch", label: "Precision Stopwatch" },
      { id: "countdown", label: "Countdown Timer" },
      { id: "date-diff", label: "Date Difference Calc" },
      { id: "age-calc", label: "Age Calculator" },
      { id: "timezone", label: "World Clock / Timezones" },
    ],
  },
  {
    group: "Text",
    tools: [
      { id: "word-counter", label: "Word & Character Counter" },
      { id: "case-converter", label: "Text Case Converter" },
      { id: "list-tools", label: "List Sorter & Deduplicator" },
      { id: "find-replace", label: "Find & Replace Text" },
      { id: "lorem-gen", label: "Dummy Lorem Generator" },
      { id: "lang-converter", label: "Text Encoder (Morse/NATO)" },
      { id: "translator", label: "Live Language Translator" },
      { id: "language-learning", label: "Language Phrasebook & Audio" },
    ],
  },
  {
    group: "Documents",
    tools: [
      { id: "pdf-studio", label: "PDF Studio (Merge & Edit)" },
    ],
  },
  {
    group: "Dev",
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
    group: "Random",
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
    group: "Media",
    tools: [
      { id: "image-compressor", label: "Image Compressor", description: "Reduce image file size quickly without losing quality." },
      { id: "image-resizer", label: "Image Resizer", description: "Resize dimensions of PNG, JPG, or WEBP images." },
      { id: "image-converter", label: "Image Converter", description: "Convert images between JPG, PNG, WEBP, and GIF." },
      { id: "background-remover", label: "Background Remover", description: "Automatically remove the background from images." },
      { id: "image-cropper", label: "Crop & Rotate", description: "Crop, flip, and rotate your photos instantly." },
      { id: "watermark-image", label: "Watermark Image", description: "Add text or logo watermarks to your pictures." },
      { id: "color-picker", label: "Image Color Picker", description: "Extract HEX and RGB color codes from any image." }
    ],
  },
  {
    group: "Audio & Video",
    tools: [
      { id: "audio-extractor", label: "Audio Extractor", description: "Extract MP3 or WAV audio tracks from any video file." },
      { id: "video-to-gif", label: "Video to GIF", description: "Convert MP4 and WebM videos into optimized looping GIFs." },
      { id: "media-trimmer", label: "Media Trimmer", description: "Cut and crop audio or video files to exact timestamps." },
      { id: "format-converter", label: "Format Converter", description: "Convert media files between MP4, MP3, WAV, and WebM." },
      { id: "volume-booster", label: "Volume Booster", description: "Increase the volume of quiet audio or video files." }
    ],
  },
];