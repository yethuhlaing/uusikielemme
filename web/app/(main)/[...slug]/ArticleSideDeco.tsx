"use client";

/**
 * Decorative SVG sidebar for article pages – Finnish/language themed.
 * Fills the right column on large screens so the layout feels balanced.
 */
export function ArticleSideDeco() {
    return (
        <aside
            className="hidden lg:block relative w-full min-h-128 pointer-events-none border-l border-border/50 pl-8"
            aria-hidden
        >
            {/* Soft gradient so the right column isn’t flat */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.15]"
                style={{
                    background:
                        "linear-gradient(160deg, transparent 0%, var(--color-accent) 70%)",
                }}
            />
            <div className="sticky top-24 flex flex-col items-center justify-start gap-8">
                {/* Large decorative Ä – Finnish character */}
                <div
                    className="text-[clamp(6rem,12vw,10rem)] font-bold leading-none select-none opacity-[0.07]"
                    style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
                >
                    Ä
                </div>
                {/* Soft gradient blob */}
                <svg
                    className="w-48 h-48 opacity-30"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="url(#article-deco-blob)"
                    />
                    <defs>
                        <radialGradient
                            id="article-deco-blob"
                            cx="0.35"
                            cy="0.35"
                            r="0.65"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--color-primary)"
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--color-primary)"
                                stopOpacity="0"
                            />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Decorative Ö */}
                <div
                    className="text-[clamp(4rem,8vw,6rem)] font-bold leading-none select-none opacity-[0.06]"
                    style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
                >
                    Ö
                </div>
                {/* Minimal book/lines icon – language/reading */}
                <svg
                    className="w-24 h-24 opacity-20"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 12v40c0 2 2 4 4 4h40c2 0 4-2 4-4V12c0-2-2-4-4-4H12c-2 0-4 2-4 4z"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        d="M20 24h24M20 32h18M20 40h14"
                        stroke="var(--color-muted-foreground)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </aside>
    );
}
