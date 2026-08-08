import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalShell from "../components/GlobalShell"; // <-- Added Import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexaKit Suite", // <-- Updated Title
  description: "30 premium web utilities to format data, calculate finances, and track time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Wrap children with GlobalShell */}
        <GlobalShell>
          {children}
        </GlobalShell>
      </body>
    </html>
  );
}