import { FallingTags } from "./FallingTags";
import { HeroSection } from "./HeroSection";

export default function LandingPage() {
    return (
        <>
            <main className="flex flex-1 min-h-0 flex-col items-center px-6 pt-6 sm:pt-8 pb-4 gap-6 sm:gap-8">
                <HeroSection />
                <FallingTags />
            </main>
            <div
                className="h-px w-full bg-gray-200 shrink-0"
                role="presentation"
                aria-hidden
            />
        </>
    );
}
