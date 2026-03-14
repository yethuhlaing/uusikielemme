"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
    return (
        <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.p
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <span aria-hidden>✨</span> Finally
            </motion.p>

            <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                A platform that helps you{" "}
                <span className="text-[#2563eb]">speak</span>, not just{" "}
                <span className="text-[#2563eb]">study</span>.
            </motion.h1>

            <motion.p
                className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    delay: 0.18,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                Master real-life conversations through personalized challenges,
                speech practice, and AI-driven feedback.
            </motion.p>

            <motion.div
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.45,
                    delay: 0.28,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-[#2563eb] bg-white px-6 py-3 text-[#2563eb] font-semibold hover:bg-[#eff6ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                >
                    How it works
                </Link>
                <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-6 py-3 text-white font-semibold hover:bg-[#1d4ed8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                >
                    Start Practicing
                </Link>
            </motion.div>
        </div>
    );
}
