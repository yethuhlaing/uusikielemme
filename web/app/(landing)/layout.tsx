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
  title: "LexieLingua – Speak, not just study",
  description:
    "Master real-life conversations through personalized challenges, speech practice, and AI-driven feedback.",
};

export default function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${nunito.variable} landing-page min-h-screen antialiased`}>
      {children}
    </div>
  );
}
