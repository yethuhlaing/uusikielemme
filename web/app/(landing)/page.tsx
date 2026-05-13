"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, NotebookPen, Sparkles, Zap } from "lucide-react";

const ROTATING_WORDS = [
    { fi: "kahvi", en: "coffee" },
    { fi: "sauna", en: "sauna" },
    { fi: "kiitos", en: "thanks" },
    { fi: "rakkaus", en: "love" },
    { fi: "sisu", en: "grit" },
];

const STICKER_PALETTE = ["#0015ff", "#ff5941", "#ffd726", "#e794da", "#1f464d", "#f97316"];

const FEATURES = [
    {
        href: "/finnish-grammar",
        title: "Grammar",
        sub: "Cases, conjugations, the works",
        icon: BookOpen,
        bg: "#ffd726",
        fg: "#1a1f2e",
    },
    {
        href: "/finnish-vocabulary",
        title: "Vocabulary",
        sub: "Real words people actually say",
        icon: Zap,
        bg: "#0015ff",
        fg: "#ffffff",
    },
    {
        href: "/notes",
        title: "Notes",
        sub: "Sketch, scribble, remember",
        icon: NotebookPen,
        bg: "#ff5941",
        fg: "#ffffff",
    },
];

const MARQUEE = [
    "moi", "kippis", "perkele", "hauska", "mökki", "talkoot",
    "kalsarikännit", "löyly", "pulla", "ruisleipä", "metsä", "yöunet",
];

export default function LandingPage() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING_WORDS.length), 1800);
        return () => clearInterval(t);
    }, []);

    const current = ROTATING_WORDS[idx];

    return (
        <main className="relative bg-background text-foreground">
            <section className="relative px-6 sm:px-24 pt-12 pb-24 md:pt-20 md:pb-32 max-w-9xl mx-auto h-screen">
                <FloatingSticker className="hidden md:block top-8 right-10" rotate={-8} bg="#e794da">
                    no duolingo guilt ✦
                </FloatingSticker>
                <FloatingSticker className="hidden md:block top-100 right-100" rotate={-20} bg="#1f464d" fg="#fff">
                    built for adults
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block bottom-50 right-24" rotate={-4} bg="#ffd726">
                    free · always
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-60 right-72" rotate={50} bg="#0015ff" fg="#fff">
                    15 cases? ez ✦
                </FloatingSticker>
                <FloatingSticker className="hidden md:block bottom-40 right-100" rotate={-6} bg="#ff5941" fg="#fff">
                    no signup needed
                </FloatingSticker>
                <FloatingSticker className="hidden xl:block top-30 right-60" rotate={5} bg="#f97316" fg="#fff">
                    🇫🇮 puhu suomea
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block bottom-90 right-40" rotate={-30} bg="#e794da">
                    grammar nerd 🫵
                </FloatingSticker>
                <FloatingSticker className="hidden md:block top-80 right-12" rotate={-7} bg="#1f464d" fg="#fff">
                    ei huolta ✦
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-8 right-60" rotate={12} bg="#f97316" fg="#fff">
                    ei sisu, ei mitään
                </FloatingSticker>
                <FloatingSticker className="hidden xl:block top-140 right-80" rotate={-5} bg="#0015ff" fg="#fff">
                    kielioppi 💪
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-40 right-72" rotate={8} bg="#ffd726">
                    puhekieli ftw
                </FloatingSticker>
                <FloatingSticker className="hidden md:block top-52 right-8" rotate={-10} bg="#e794da">
                    älä stressaa ✦
                </FloatingSticker>
                <FloatingSticker className="hidden xl:block top-60 right-96" rotate={15} bg="#ff5941" fg="#fff">
                    TYKKÄÄ TÄSTÄ
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-72 right-48" rotate={-6} bg="#1f464d" fg="#fff">
                    nönnönnöö
                </FloatingSticker>
                <FloatingSticker className="hidden xl:block top-90 right-20" rotate={9} bg="#0015ff" fg="#fff">
                    oikeesti ✦
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-96 right-64" rotate={-12} bg="#ffd726">
                    torille!
                </FloatingSticker>
                <FloatingSticker className="hidden xl:block top-200 right-100" rotate={7} bg="#f97316" fg="#fff">
                    perkele 🔥
                </FloatingSticker>
                <FloatingSticker className="hidden md:block top-[32rem] right-4" rotate={-4} bg="#e794da">
                    jaksaa jaksaa
                </FloatingSticker>
                <FloatingSticker className="hidden lg:block top-[38rem] right-80" rotate={11} bg="#ff5941" fg="#fff">
                    SISU 🦁
                </FloatingSticker>
                {/* <div className="flex items-center gap-2 mb-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-[3px_3px_0_0_#1a1f2e] dark:shadow-[3px_3px_0_0_#fff]">
                        <Sparkles className="size-3" /> Uusi kielemme · est. you
                    </span>
                </div> */}

                <h1 className="font-bold tracking-tight leading-[0.92] text-[clamp(3rem,9vw,8rem)]">
                    <span className="block">Speak Finnish</span>
                    <span className="block">like you mean</span>
                    <span className="block">
                        <span className="italic font-light mr-3">it&apos;s</span>
                        <span
                            className="inline-block align-baseline rounded-2xl px-4 md:px-6 py-1 md:py-2 -rotate-2 shadow-[6px_6px_0_0_#1a1f2e] dark:shadow-[6px_6px_0_0_#fff] border-2 border-foreground"
                            style={{ background: "#ffd726", color: "#1a1f2e" }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={current.fi}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block"
                                >
                                    {current.fi}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </span>
                </h1>

                <p className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Finnish for busy adults — clear grammar, real vocab, zero baby-talk owl shaming you at 11pm.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link
                        href="/finnish-grammar"
                        className="group inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-foreground text-background px-7 py-4 text-base font-semibold shadow-[6px_6px_0_0_#ff5941] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#ff5941] transition-all"
                    >
                        Start learning
                        <ArrowUpRight className="size-5 transition-transform group-hover:rotate-12" />
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-background px-7 py-4 text-base font-semibold hover:bg-foreground hover:text-background transition-colors"
                    >
                        How it works
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                    <Stat n="500+" label="grammar lessons" />
                    <Stat n="10k" label="vocab entries" />
                    <Stat n="A1—C1" label="every level" />
                    <Stat n="0€" label="ever" />
                </div>
            </section>

            <section className="px-6 sm:px-24 pb-24 max-w-9xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">
                    Pick your <span className="italic font-light">vibe</span>.
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => (
                        <FeatureCard key={f.href} {...f} delay={i * 0.08} />
                    ))}
                </div>
            </section>

            <section className="border-y-2 border-foreground bg-foreground text-background overflow-hidden py-6">
                <div className="flex gap-8 whitespace-nowrap animate-[marquee_40s_linear_infinite] will-change-transform">
                    {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
                        <span
                            key={i}
                            className="text-3xl md:text-5xl font-bold tracking-tight inline-flex items-center gap-8"
                        >
                            {w}
                            <span
                                className="inline-block size-3 rounded-full"
                                style={{ background: STICKER_PALETTE[i % STICKER_PALETTE.length] }}
                            />
                        </span>
                    ))}
                </div>
            </section>

            <section className="px-6 sm:px-24 py-24 max-w-9xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                            One word. <br />
                            <span className="italic font-light">A whole feeling.</span>
                        </h3>
                        <p className="mt-6 text-lg text-muted-foreground max-w-md">
                            Finnish doesn&apos;t translate — it lands. We teach the context, the texture, and yes, the 15 cases.
                        </p>
                        <Link
                            href="/finnish-vocabulary"
                            className="mt-8 inline-flex items-center gap-2 text-base font-semibold border-b-2 border-foreground hover:gap-3 transition-all"
                        >
                            Open vocabulary <ArrowUpRight className="size-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="rounded-3xl border-2 border-foreground bg-background p-8 shadow-[10px_10px_0_0_#1a1f2e] dark:shadow-[10px_10px_0_0_#fff]"
                        >
                            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                                today&apos;s word
                            </div>
                            <div className="text-6xl md:text-7xl font-bold tracking-tight">
                                {current.fi}
                            </div>
                            <div className="mt-2 text-xl text-muted-foreground italic">
                                — {current.en}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {["nominative", "genitive", "partitive"].map((c, i) => (
                                    <span
                                        key={c}
                                        className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-foreground"
                                        style={{ background: STICKER_PALETTE[i] }}
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <span className="absolute -top-4 -right-4 rotate-12 rounded-full border-2 border-foreground bg-[#e794da] px-4 py-2 text-sm font-bold shadow-[4px_4px_0_0_#1a1f2e]">
                            new daily
                        </span>
                    </div>
                </div>
            </section>

            <section className="px-6 sm:px-24 pb-28 max-w-9xl mx-auto">
                <div className="rounded-[2rem] border-2 border-foreground bg-[#0015ff] text-white p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 size-64 rounded-full bg-[#ffd726] opacity-90 blur-3xl" />
                    <div className="relative">
                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95]">
                            Ready? <span className="italic font-light">Mennään.</span>
                        </h3>
                        <p className="mt-4 text-lg text-white/80 max-w-lg">
                            Free, open, no signup. Pick a page and go.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/finnish-grammar" className="rounded-full bg-white text-foreground px-6 py-3 font-semibold hover:scale-105 transition-transform">Grammar</Link>
                            <Link href="/finnish-vocabulary" className="rounded-full bg-white text-foreground px-6 py-3 font-semibold hover:scale-105 transition-transform">Vocabulary</Link>
                            <Link href="/notes" className="rounded-full border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-foreground transition-colors">Notes</Link>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-33.333%); }
                }
            `}</style>
        </main>
    );
}

function Stat({ n, label }: { n: string; label: string }) {
    return (
        <div className="border-l-4 border-foreground pl-3">
            <div className="text-3xl md:text-4xl font-bold tracking-tight">{n}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        </div>
    );
}

function FeatureCard({
    href, title, sub, icon: Icon, bg, fg, delay,
}: {
    href: string; title: string; sub: string; icon: typeof BookOpen; bg: string; fg: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={href}
                className="group block rounded-3xl border-2 border-foreground p-8 h-full shadow-[8px_8px_0_0_#1a1f2e] dark:shadow-[8px_8px_0_0_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_0_#1a1f2e] dark:hover:shadow-[2px_2px_0_0_#fff] transition-all"
                style={{ background: bg, color: fg }}
            >
                <div className="flex items-start justify-between">
                    <Icon className="size-10" strokeWidth={2.25} />
                    <ArrowUpRight className="size-6 transition-transform group-hover:rotate-45" />
                </div>
                <div className="mt-16">
                    <div className="text-3xl font-bold tracking-tight">{title}</div>
                    <div className="mt-2 text-base opacity-80">{sub}</div>
                </div>
            </Link>
        </motion.div>
    );
}

function FloatingSticker({
    children, className = "", rotate = 0, bg, fg = "#1a1f2e",
}: {
    children: React.ReactNode; className?: string; rotate?: number; bg: string; fg?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-10 rounded-full border-2 border-foreground px-4 py-2 text-sm font-bold shadow-[4px_4px_0_0_#1a1f2e] select-none ${className}`}
            style={{ background: bg, color: fg }}
        >
            {children}
        </motion.div>
    );
}
