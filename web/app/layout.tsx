import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
    display: "swap",
    weight: ["400", "500", "600", "700"],
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
        <html lang="fi" suppressHydrationWarning className={nunito.variable}>
            <body
                className="font-sans flex flex-col min-h-screen"
                style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
                suppressHydrationWarning
            >
                <Navbar />
                <div className="flex-1 flex flex-col min-h-0">{children}</div>
            </body>
        </html>
    );
}
