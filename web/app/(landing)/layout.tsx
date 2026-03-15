import type { Metadata } from "next";
import "../globals.css";

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
            className="antialiased flex flex-col min-h-0 overflow-hidden bg-background"
            style={{
                height: "calc(100vh - var(--navbar-height, 4.5rem))",
            }}
        >
            {children}
        </div>
    );
}
