import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Richer SEO metadata lands in Milestone 5. Keeping baseline here so the
// scaffolded "Create Next App" strings are gone.
export const metadata: Metadata = {
  title: {
    default: "CrispCalc — The air fryer conversion calculator, done right.",
    template: "%s | CrispCalc",
  },
  description:
    "Convert any oven recipe to perfect air fryer settings in seconds — backed by the science of how air fryers actually cook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
