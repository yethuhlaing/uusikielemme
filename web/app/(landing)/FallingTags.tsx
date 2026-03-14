"use client";

import React from "react";
import { motion } from "framer-motion";

/* All positions in % so the pile scales and stays centered on any viewport */
const PILLS = [
    // Bottom layer – on or just above the ground line
    {
        text: "Motivation",
        color: "bg-[#5479F2]",
        top: "58%",
        left: "4%",
        rotate: 0,
        delay: 0.1,
    },
    {
        text: "Communicate",
        color: "bg-[#50A478]",
        top: "58%",
        left: "78%",
        rotate: 0,
        delay: 0.2,
    },
    {
        text: "Advantures",
        color: "bg-[#0A0E45]",
        top: "56%",
        left: "38%",
        rotate: 0,
        delay: 0.3,
        px: "px-12",
    },

    // Middle / vertical layer
    {
        text: "Talk",
        color: "bg-[#F06543]",
        top: "28%",
        left: "9%",
        rotate: -90,
        delay: 0.4,
        h: "h-32",
    },
    {
        text: "Easy",
        color: "bg-[#0A0E45]",
        top: "44%",
        left: "18%",
        rotate: 90,
        delay: 0.5,
        h: "h-32",
    },
    {
        text: "Effectively",
        color: "bg-[#F4A7D3]",
        top: "26%",
        left: "62%",
        rotate: 90,
        delay: 0.6,
        h: "h-48",
    },

    // Angled items
    {
        text: "Studies",
        color: "bg-[#F4A7D3]",
        top: "44%",
        left: "24%",
        rotate: -50,
        delay: 0.7,
    },
    {
        text: "Support",
        color: "bg-[#F06543]",
        top: "38%",
        left: "34%",
        rotate: -85,
        delay: 0.8,
        h: "h-40",
    },
    {
        text: "Fun",
        color: "bg-[#50A478]",
        top: "34%",
        left: "40%",
        rotate: -10,
        delay: 0.9,
    },
    {
        text: "Exams",
        color: "bg-[#FFD25E]",
        top: "36%",
        left: "50%",
        rotate: 25,
        delay: 1.0,
        textColor: "text-black",
    },
    {
        text: "Speaking",
        color: "bg-[#FFD25E]",
        top: "38%",
        left: "68%",
        rotate: -55,
        delay: 1.1,
        textColor: "text-black",
        px: "px-10",
    },

    // Icons / circles
    {
        text: "#",
        color: "bg-[#50A478]",
        top: "26%",
        left: "14%",
        rotate: 15,
        delay: 1.2,
        isCircle: true,
    },
    {
        text: "😊",
        color: "bg-[#F4A7D3]",
        top: "20%",
        left: "40%",
        rotate: 0,
        delay: 1.3,
        isCircle: true,
    },
    {
        text: "💬",
        color: "bg-[#F06543]",
        top: "44%",
        left: "82%",
        rotate: 0,
        delay: 1.4,
        isCircle: true,
    },
];

const WaveformPill = () => (
    <motion.div
        initial={{ y: -800, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: -12 }}
        transition={{
            type: "spring",
            stiffness: 60,
            damping: 12,
            delay: 0.8,
            mass: 1.5,
        }}
        className="absolute bg-[#FFD25E] rounded-full p-4 sm:p-6 flex items-center gap-3 sm:gap-4 shadow-xl border-b-4 border-black/10 w-[85%] max-w-[340px] left-1/2 -translate-x-1/2 sm:left-[22%] sm:translate-x-0"
        style={{ top: "18%", zIndex: 30 }}
    >
        <span className="text-xl sm:text-2xl shrink-0" aria-hidden>
            🎙️
        </span>
        <div
            className="flex items-center gap-0.5 sm:gap-1 h-6 sm:h-8 flex-1 min-w-0"
            aria-hidden
        >
            {[40, 70, 45, 90, 65, 30, 80, 50, 95, 40, 60].map((h, i) => (
                <div
                    key={i}
                    className="flex-1 bg-black/30 rounded-full min-w-[3px]"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    </motion.div>
);

export function FallingTags() {
    return (
        <section
            className="absolute inset-0 overflow-hidden select-none pointer-events-none"
            aria-hidden
        >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[480px] sm:h-[340px] lg:h-[400px] px-4 sm:px-10 lg:px-20 flex items-end justify-center">
                {/* Background strip so pills sit on a subtle band */}
                <div className="absolute inset-0 bg-[#FAF9F6]/80 rounded-t-2xl" />

                {/* Wavy baseline from left border – bigger, with arrow */}
                <svg
                    className="absolute bottom-16 left-0 w-full h-10 sm:h-12 text-black"
                    viewBox="0 0 1000 40"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    <path
                        d="M0 24 Q150 6 280 22 T520 10 T760 24 T900 12"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    <path
                        d="M868 18 L900 6 L888 24 Z"
                        fill="currentColor"
                        stroke="none"
                    />
                </svg>

                {/* Waveform pill */}
                <WaveformPill />

                {/* Pills – pointer-events-auto so only this part is draggable */}
                <div className="absolute inset-0 pointer-events-auto">
                    {PILLS.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                y: -400,
                                opacity: 0,
                                rotate: p.rotate + (Math.random() * 40 - 20),
                            }}
                            animate={{ y: 0, opacity: 1, rotate: p.rotate }}
                            transition={{
                                type: "spring",
                                stiffness: 70,
                                damping: 15,
                                mass: 1.2,
                                delay: p.delay,
                            }}
                            drag
                            dragConstraints={{
                                top: -80,
                                left: -20,
                                right: 20,
                                bottom: 20,
                            }}
                            className={`
                                absolute flex items-center justify-center font-bold shadow-lg cursor-grab active:cursor-grabbing
                                text-sm sm:text-base
                                ${p.color} ${p.textColor ?? "text-white"}
                                ${p.isCircle ? "w-11 h-11 sm:w-14 sm:h-14 rounded-full text-xl sm:text-2xl" : `rounded-full py-2.5 sm:py-3 ${p.px ?? "px-4 sm:px-7"} ${p.h ?? ""}`}
                            `}
                            style={{
                                top: p.top,
                                left: p.left,
                                zIndex: i + 10,
                            }}
                        >
                            {p.text}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
