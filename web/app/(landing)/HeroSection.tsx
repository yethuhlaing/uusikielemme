"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
    return (
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
            <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                Learn Finnish without any b
                <span
                    className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-blue-500 text-blue-500 text-xl sm:text-2xl align-middle mx-0.5"
                    aria-hidden
                >
                    *
                </span>
                r
                <span
                    className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-400 text-amber-500 text-lg sm:text-xl align-middle mx-0.5"
                    aria-hidden
                >
                    ✦
                </span>
                ders
            </motion.h1>

            {/* Small squiggle above "without" - positioned with span */}
            <motion.span
                className="absolute left-1/2 -translate-x-[4.2rem] sm:-translate-x-24 -top-1 sm:-top-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                aria-hidden
            >
                <svg
                    width="32"
                    height="20"
                    viewBox="0 0 32 20"
                    fill="none"
                    className="text-black"
                >
                    <path
                        d="M2 12c4-4 8 2 12-2s6-6 10-2c2 2 4 6 8 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </motion.span>

            <motion.p
                className="mt-8 text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                Get clear grammar and vocabulary at your own pace. Modern
                explanations and a calm place to learn—so you can talk.
            </motion.p>

            <motion.div
                className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                <Link
                    href="/finnish-grammar"
                    className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#fafaf8]"
                >
                    Get started
                </Link>
                <span className="text-gray-400 px-1" aria-hidden>
                    /
                </span>
                <Link
                    href="/finnish-vocabulary"
                    className="inline-flex items-center justify-center text-black font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
                >
                    Try for free
                </Link>
            </motion.div>

            {/* Left decorative squiggle with arrow */}
            <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block w-32 xl:w-40 pointer-events-none"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                aria-hidden
            >
                <svg
                    viewBox="0 0 140 120"
                    fill="none"
                    className="w-full h-auto text-black"
                >
                    <path
                        d="M10 100 Q40 100 50 80 T90 60 T120 40 L135 35"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M125 28 L135 35 L127 42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>
        </div>
    );
}
