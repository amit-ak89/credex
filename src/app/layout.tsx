import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://credex.ai"),
  title: { default: "Credex AI Spend Auditor", template: "%s | Credex" },
  description: "Audit your company's AI tooling spend and get personalized cost optimization recommendations.",
  keywords: ["AI spend", "AI cost optimization", "SaaS audit", "Cursor", "GitHub Copilot", "ChatGPT"],
  authors: [{ name: "Credex AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://credex.ai",
    siteName: "Credex AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@credexai" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}
