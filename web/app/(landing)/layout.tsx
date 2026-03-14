import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "../globals.css";

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Uusi kielemme – Finnish for Busy People",
    description:
        "Clear Finnish grammar and vocabulary for adult learners. Self-paced, 650+ articles. Learn at your own pace.",
};

export default function LandingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div
            className={`${nunito.variable} landing-page min-h-screen antialiased`}
        >
            {children}
        </div>
    );
}
