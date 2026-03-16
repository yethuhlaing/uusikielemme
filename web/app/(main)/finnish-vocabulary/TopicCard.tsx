"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Activity } from "lucide-react";
import { getMiniMascot } from "./VocabularyMascots";
import { useCardProgress } from "./useCardProgress";

type TopicCardProps = {
    href: string;
    title: string;
    index: number;
};

export function TopicCard({ href, title, index }: TopicCardProps) {
    const Icon = getMiniMascot(index);
    const progress = Math.round(useCardProgress(href));
    const isCompleted = progress > 80;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
        >
            <Link
                href={href}
                className="group relative overflow-hidden flex flex-col p-6 bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
                <div className="absolute -right-6 -bottom-6 opacity-[0.1] grayscale group-hover:opacity-[0.28] group-hover:grayscale-0 group-hover:brightness-125 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                    <Icon className="w-40 h-40" />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="rounded-2xl bg-transparent group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-10 h-10 drop-shadow-sm" />
                    </div>

                    <div
                        className="relative w-12 h-12 flex items-center justify-center  rounded-full shadow-inner"
                        title={`${progress}% completed`}
                    >
                        <svg
                            className="w-10 h-10 transform -rotate-90 absolute"
                            viewBox="0 0 36 36"
                        >
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                className="stroke-border"
                                strokeWidth="3"
                            />
                            <motion.circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                className={
                                    isCompleted
                                        ? "text-success stroke-current"
                                        : "text-primary stroke-current"
                                }
                                strokeWidth="3"
                                strokeDasharray="100"
                                strokeDashoffset={100 - progress}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - progress }}
                                transition={{
                                    duration: 1,
                                    delay: 0.2 + index * 0.05,
                                }}
                            />
                        </svg>
                        <span
                            className="absolute text-[10px] font-bold text-foreground"
                            suppressHydrationWarning
                        >
                            {progress}%
                        </span>
                    </div>
                </div>

                <div className="relative z-10 mt-auto">
                    <h3 className="font-bold text-card-foreground text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>

                <div
                    className={`absolute bottom-0 left-0 h-1.5 w-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                        isCompleted ? "bg-success" : "bg-primary"
                    }`}
                />
            </Link>
        </motion.div>
    );
}
