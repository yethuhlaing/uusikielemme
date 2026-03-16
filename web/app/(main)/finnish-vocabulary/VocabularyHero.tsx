"use client";

import { motion } from "framer-motion";
import { Mascot } from "./VocabularyMascots";

const DEFAULT_EXCERPT =
    "The Finnish vocabulary on this page is roughly divided in three different levels. However, my own point of view is that as a foreign language learner you should pick the subjects you want to talk about rather than blindly following someone's suggestion. Good luck to everyone trying to broaden their vocabulary!";

type Props = {
    title: string;
    excerptHtml: string | null;
};

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
}

export function VocabularyHero({ title, excerptHtml }: Props) {
    const plainTitle = stripHtml(title);
    const excerpt = excerptHtml ? stripHtml(excerptHtml) : DEFAULT_EXCERPT;

    return (
        <motion.div
            className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-card p-8 sm:p-10 rounded-3xl shadow-sm border border-border overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-accent/30 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="flex-1 relative z-10">
                <motion.h1
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {plainTitle.includes("Vocabulary") ? (
                        <>
                            Finnish{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                                Vocabulary
                            </span>
                        </>
                    ) : (
                        plainTitle
                    )}
                </motion.h1>
                <motion.p
                    className="text-lg text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {excerpt}
                </motion.p>
            </div>
            <div className="hidden md:flex shrink-0 relative z-10 items-center justify-center w-48 h-48">
                <Mascot />
            </div>
        </motion.div>
    );
}
