import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SileoToaster } from "@/components/SileoToaster";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://uusikielemme.fi"),
    title: { default: "Uusi kielemme", template: "%s | Uusi kielemme" },
    description: "Finnish for Busy People",
};

// Inline script runs before paint to prevent theme flash
const themeScript = `
(function() {
  var key = 'uusikielemme-theme';
  var stored = localStorage.getItem(key);
  var dark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
` as const;

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fi" translate="no" suppressHydrationWarning className={plusJakartaSans.variable}>
            <head>
                <meta name="google" content="notranslate" />
                <script
                    dangerouslySetInnerHTML={{ __html: themeScript }}
                    suppressHydrationWarning
                />
            </head>
            <body
                className="font-sans flex flex-col min-h-screen"
                style={{ fontFamily: "var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif" }}
                suppressHydrationWarning
            >
                <NextTopLoader
                    color="var(--color-primary)"
                    height={3}
                    showSpinner={false}
                />
                <ThemeProvider>
                    <SileoToaster />
                    <Navbar />
                    <div className="flex-1 flex flex-col">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
