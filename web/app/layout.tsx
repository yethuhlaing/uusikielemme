import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uusikielemme.fi"),
  title: { default: "Uusi kielemme", template: "%s | Uusi kielemme" },
  description: "Finnish for Busy People",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fi">
      <body className={`${dmSans.variable} ${sourceSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
