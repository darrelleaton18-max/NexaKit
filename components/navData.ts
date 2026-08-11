export type ToolItem = {
  id: string;
  label: string;
  description?: string; // The '?' makes it optional.
  regions?: string[]; // E.g., ["UK", "US", "EU"] - If undefined, it shows everywhere
};

export type NavGroup = {
  group: string;
  tools: ToolItem[];
};

export const navGroups: NavGroup[] = [
  {
    group: "Finance", // Merged Calculators & Trackers!
    tools: [
      { id: "tax-calculator", label: "Income Tax Calculator", description: "Calculate your take-home pay, tax brackets, and deductions." },
      { id: "currency-converter", label: "Currency Converter", description: "Convert between global currencies using live exchange rates." },
      { id: "loan-calc", label: "Mortgage & Loan", regions: ["UK"], description: "Estimate monthly repayments and interest on loans or mortgages." }, 
      { id: "compound-calc", label: "Compound Interest", description: "Project your future wealth and investment growth over time." },
      { id: "comp-calc", label: "Total Comp Calculator", description: "Evaluate the true value of your salary, stock, and benefits." },
      { id: "time-to-buy", label: "Time-to-Buy Planner", description: "Calculate exactly how long it will take to save for a big purchase." },
      { id: "fee-auditor", label: "Bank Fee Auditor", description: "Analyze your accounts to uncover hidden banking and overdraft fees." },
      { id: "net-worth", label: "Net Worth Tracker", description: "Log your assets and liabilities to calculate your true net worth." },
      { id: "budget-planner", label: "Zero-Based Budget", description: "Assign every penny a job with a comprehensive monthly budget." },
      { id: "sub-tracker", label: "Subscription Audit", description: "Track recurring software and streaming costs to find hidden drains." },
      { id: "debt-dash", label: "Debt Snowball Simulator", description: "Build a roadmap to become debt-free using the snowball method." },
      { id: "savings-goal", label: "Emergency Fund Goal", description: "Set targets and track milestones for your rainy day savings." },
      { id: "envelope-budget", label: "Envelope Budget", description: "Manage monthly spending limits with a digital envelope system." },
      { id: "freelance-log", label: "Freelance Expense Log", description: "Log and categorize tax-deductible expenses for your business." },
    ],
  },
  {
    group: "Math",
    tools: [
      { id: "pct-calc", label: "Percentage Calculator", description: "Quickly calculate percentages, markup, increases, and decreases." },
      { id: "unit-converter", label: "Metric / Unit Converter", description: "Convert between various metric, imperial, and scientific units." },
      { id: "stats-calc", label: "Statistics Calculator", description: "Find the mean, median, mode, and standard deviation of a dataset." },
      { id: "prime-gen", label: "Prime Number Generator", description: "Generate and verify prime numbers within a specific range." },
      { id: "base-converter", label: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hex." },
    ],
  },
  {
    group: "Time",
    tools: [
      { id: "stopwatch", label: "Precision Stopwatch", description: "Track elapsed time accurately with lap and split functionality." },
      { id: "countdown", label: "Countdown Timer", description: "Set a custom countdown timer for productivity or upcoming events." },
      { id: "date-diff", label: "Date Difference Calc", description: "Calculate the exact days, months, or years between two dates." },
      { id: "age-calc", label: "Age Calculator", description: "Determine an exact age from a birthdate down to the minute." },
      { id: "timezone", label: "World Clock / Timezones", description: "Compare current times and coordinate meetings across the globe." },
    ],
  },
  {
    group: "Text",
    tools: [
      { id: "word-counter", label: "Word & Character Counter", description: "Count words, characters, and estimate reading time instantly." },
      { id: "case-converter", label: "Text Case Converter", description: "Change text to uppercase, lowercase, camelCase, or Title Case." },
      { id: "list-tools", label: "List Sorter & Deduplicator", description: "Alphabetize, shuffle, and strip duplicate lines from bulk lists." },
      { id: "find-replace", label: "Find & Replace Text", description: "Search and swap specific text strings across large documents." },
      { id: "lorem-gen", label: "Dummy Lorem Generator", description: "Generate placeholder Lorem Ipsum text for UI and web layouts." },
      { id: "lang-converter", label: "Text Encoder (Morse/NATO)", description: "Translate standard text into Morse code or the NATO phonetic alphabet." },
      { id: "translator", label: "Live Language Translator", description: "Translate text between multiple global languages in real-time." },
      { id: "language-learning", label: "Language Phrasebook", description: "Practice common phrases and listen to native audio pronunciations." },
    ],
  },
  {
    group: "Documents",
    tools: [
      { id: "pdf-studio", label: "PDF Studio (Merge & Edit)", description: "Securely merge, split, rotate, and watermark PDF documents." },
    ],
  },
  {
    group: "Dev",
    tools: [
      { id: "json-format", label: "JSON Formatter / Minify", description: "Format, validate, and minify JSON code strings for production." },
      { id: "base64", label: "Base64 Encoder / Decoder", description: "Safely encode and decode text or files using Base64 formatting." },
      { id: "url-encode", label: "URL Encoder & Decoder", description: "Encode and decode URLs and query parameters for safe web transit." },
      { id: "url-inspector", label: "URL & Domain Inspector", description: "Analyze URL syntax and check server reachability." }, // <--- Added here!
      { id: "hash-gen", label: "Secure Hash Generator", description: "Generate MD5, SHA-1, and SHA-256 cryptographic text hashes." },
      { id: "color-conv", label: "Color Space Converter", description: "Convert design colors between HEX, RGB, HSL, and CMYK formats." },
      { id: "qr-maker", label: "QR Code Generator", description: "Create scannable, customized QR codes for links and text." },
    ],
  },
  {
    group: "Random",
    tools: [
      { id: "password-gen", label: "Secure Password Generator", description: "Generate highly secure, randomized passwords with custom rules." },
      { id: "num-gen", label: "Random Number Gen", description: "Generate purely random numbers within a specific custom range." },
      { id: "uuid-gen", label: "UUID / GUID Generator", description: "Generate cryptographically secure version 4 UUIDs and GUIDs." },
      { id: "dice-coin", label: "Dice Roller & Coin Flip", description: "Simulate rolling virtual dice or flipping a coin for quick decisions." },
      { id: "username-gen", label: "Random Username Gen", description: "Generate creative, available random usernames for online accounts." },
      { id: "wheel-gen", label: "Spinning Decision Wheel", description: "Input custom options and spin a virtual wheel to make a decision." },
    ],
  },
  {
    group: "Media",
    tools: [
      { id: "image-compressor", label: "Image Compressor", description: "Reduce image file size quickly without losing quality." },
      { id: "image-resizer", label: "Image Resizer", description: "Resize dimensions of PNG, JPG, or WEBP images." },
      { id: "image-converter", label: "Image Converter", description: "Convert images between JPG, PNG, WEBP, and GIF formats." },
      { id: "background-remover", label: "Background Remover", description: "Automatically isolate subjects and remove backgrounds from images." },
      { id: "image-cropper", label: "Crop & Rotate", description: "Crop, flip, and rotate your photos precisely in your browser." },
      { id: "watermark-image", label: "Watermark Image", description: "Add protective text or logo watermarks to your pictures." },
      { id: "color-picker", label: "Image Color Picker", description: "Extract specific HEX and RGB color codes from any uploaded image." }
    ],
  },
  {
    group: "Audio & Video",
    tools: [
      { id: "audio-extractor", label: "Audio Extractor", description: "Extract MP3 or WAV audio tracks directly from any video file." },
      { id: "video-to-gif", label: "Video to GIF", description: "Convert MP4 and WebM videos into optimized, looping GIFs." },
      { id: "media-trimmer", label: "Media Trimmer", description: "Cut and crop audio or video files down to exact timestamps." },
      { id: "format-converter", label: "Format Converter", description: "Convert media files effortlessly between MP4, MP3, WAV, and WebM." },
      { id: "volume-booster", label: "Volume Booster", description: "Increase the decibel volume of quiet audio or video files." }
    ],
  },
];