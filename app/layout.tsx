import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* ─────────────────────────────────────────────────────────────────────────
 * Root metadata
 * All pages inherit these defaults. Pages that export their own `metadata`
 * (or `generateMetadata`) override individual fields; the title template
 * applies automatically so every page gets "Page Name | StackHub".
 * ───────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  /* Base URL used to resolve relative paths in openGraph.images, icons, etc.
   * Change to your production domain before deploying. */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackhub.dev",
  ),

  /* Title template — child pages set `title: "My Page"` and get
   * "My Page | StackHub" automatically. The root (home) page uses `default`. */
  title: {
    default: "StackHub — Web3 Developer Tools & Documentation",
    template: "%s | StackHub",
  },

  description:
    "The central hub for Web3 developer tools and documentation. Discover, compare, and learn the best libraries, frameworks, and infrastructure for building on-chain.",

  /* Canonical / alternate */
  alternates: {
    canonical: "/",
  },

  /* Favicon + app icons */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  /* Open Graph defaults — individual pages override title/description/url */
  openGraph: {
    type: "website",
    siteName: "StackHub",
    title: "StackHub — Web3 Developer Tools & Documentation",
    description:
      "The central hub for Web3 developer tools and documentation. Discover, compare, and learn the best libraries, frameworks, and infrastructure for building on-chain.",
    url: "/",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "StackHub — Web3 Developer Tools",
      },
    ],
  },

  /* Twitter / X card */
  twitter: {
    card: "summary_large_image",
    site: "@stackhub",
    creator: "@stackhub",
    title: "StackHub — Web3 Developer Tools & Documentation",
    description:
      "The central hub for Web3 developer tools and documentation.",
    images: ["/og-default.svg"],
  },

  /* Robots — allow everything by default; individual pages override as needed */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* Miscellaneous */
  keywords: [
    "Web3",
    "blockchain",
    "developer tools",
    "Ethereum",
    "Solana",
    "smart contracts",
    "DeFi",
    "wagmi",
    "viem",
    "ethers.js",
    "Hardhat",
    "Foundry",
  ],
  authors: [{ name: "StackHub" }],
  creator: "StackHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
