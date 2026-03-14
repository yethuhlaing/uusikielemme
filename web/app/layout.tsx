import type { Metadata } from "next";
import Link from "next/link";
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
        <div className="layout">
          <header className="site-header">
            <Link href="/" className="site-title">
              Uusi kielemme
            </Link>
            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/finnish-grammar">Finnish Grammar</Link>
              <Link href="/finnish-vocabulary">Finnish Vocabulary</Link>
            </nav>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <p>Uusi kielemme – Finnish for Busy People</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
