import type { Metadata } from "next";
import { Audiowide, Work_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const audiowide = Audiowide({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://murhakaverit.vercel.app"),
  title: {
    default: "Murhakaverit Vault",
    template: "%s | Murhakaverit Vault",
  },
  description:
    "Read the Murhakaverit world bible directly from the Obsidian vault.",
  openGraph: {
    title: "Murhakaverit Vault",
    description:
      "Read the Murhakaverit world bible directly from the Obsidian vault.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murhakaverit Vault",
    description:
      "Read the Murhakaverit world bible directly from the Obsidian vault.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${audiowide.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pb-20 pt-10 sm:gap-12 sm:px-8 sm:pb-24 sm:pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
