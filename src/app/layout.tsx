import type { Metadata } from "next";
import { IBM_Plex_Sans, Jura, Geist_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jura = Jura({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${ibmPlexSans.variable} ${jura.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen">
          <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-12 sm:px-8 sm:pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
