"use client";

import { motion } from "framer-motion";

const float = { y: [0, -4, 0] };
const duration = (d: number, delay = 0) => ({
    repeat: Infinity,
    duration: d,
    delay,
});

export function MiniOwl({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                <path d="M20 50 C20 15, 80 15, 80 50 C80 85, 70 95, 50 95 C30 95, 20 85, 20 50 Z" fill="#3B82F6" />
                <path d="M30 55 C30 30, 70 30, 70 55 C70 80, 60 90, 50 90 C40 90, 30 80, 30 55 Z" fill="#EFF6FF" />
                <circle cx="40" cy="45" r="7" fill="white" />
                <circle cx="60" cy="45" r="7" fill="white" />
                <circle cx="40" cy="45" r="3" fill="#1E3A8A" />
                <circle cx="60" cy="45" r="3" fill="#1E3A8A" />
                <path d="M46 52 L54 52 L50 58 Z" fill="#F59E0B" />
            </motion.g>
        </svg>
    );
}

export function MiniFox({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3.2, delay: 0.5 }}>
                <path d="M25 50 L20 20 L45 40 Z" fill="#EA580C" />
                <path d="M75 50 L80 20 L55 40 Z" fill="#EA580C" />
                <path d="M20 50 C20 90, 50 95, 50 95 C50 95, 80 90, 80 50 C80 30, 20 30, 20 50 Z" fill="#F97316" />
                <path d="M20 50 C20 70, 50 95, 50 95 L50 60 C30 60, 20 50, 20 50 Z" fill="#FFF7ED" />
                <path d="M80 50 C80 70, 50 95, 50 95 L50 60 C70 60, 80 50, 80 50 Z" fill="#FFF7ED" />
                <circle cx="35" cy="55" r="4" fill="#431407" />
                <circle cx="65" cy="55" r="4" fill="#431407" />
                <circle cx="50" cy="65" r="5" fill="#431407" />
            </motion.g>
        </svg>
    );
}

export function MiniBear({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}>
                <circle cx="25" cy="35" r="12" fill="#78350F" />
                <circle cx="75" cy="35" r="12" fill="#78350F" />
                <circle cx="25" cy="35" r="6" fill="#D97706" />
                <circle cx="75" cy="35" r="6" fill="#D97706" />
                <circle cx="50" cy="60" r="35" fill="#92400E" />
                <ellipse cx="50" cy="70" rx="18" ry="14" fill="#FDE68A" />
                <circle cx="38" cy="55" r="4" fill="#431407" />
                <circle cx="62" cy="55" r="4" fill="#431407" />
                <ellipse cx="50" cy="66" rx="6" ry="4" fill="#431407" />
            </motion.g>
        </svg>
    );
}

export function MiniMoose({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3.1, delay: 0.2 }}>
                <path d="M40 35 L20 15 L15 25 L25 30 L10 40 L30 45 Z" fill="#D97706" />
                <path d="M60 35 L80 15 L85 25 L75 30 L90 40 L70 45 Z" fill="#D97706" />
                <ellipse cx="50" cy="65" rx="25" ry="30" fill="#78350F" />
                <ellipse cx="50" cy="75" rx="20" ry="15" fill="#B45309" />
                <circle cx="40" cy="55" r="3" fill="#FEF3C7" />
                <circle cx="60" cy="55" r="3" fill="#FEF3C7" />
                <circle cx="40" cy="55" r="1.5" fill="#431407" />
                <circle cx="60" cy="55" r="1.5" fill="#431407" />
                <circle cx="43" cy="75" r="2" fill="#431407" />
                <circle cx="57" cy="75" r="2" fill="#431407" />
            </motion.g>
        </svg>
    );
}

export function MiniSeal({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden>
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.8, delay: 0.7 }}>
                <ellipse cx="50" cy="65" rx="35" ry="30" fill="#94A3B8" />
                <ellipse cx="50" cy="70" rx="25" ry="20" fill="#E2E8F0" />
                <circle cx="35" cy="55" r="5" fill="#0F172A" />
                <circle cx="65" cy="55" r="5" fill="#0F172A" />
                <circle cx="36" cy="54" r="1.5" fill="white" />
                <circle cx="66" cy="54" r="1.5" fill="white" />
                <path d="M46 65 L54 65 L50 70 Z" fill="#0F172A" />
                <line x1="15" y1="65" x2="30" y2="68" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="72" x2="30" y2="70" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="85" y1="65" x2="70" y2="68" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="85" y1="72" x2="70" y2="70" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
        </svg>
    );
}

const MINI_MASCOTS = [MiniOwl, MiniFox, MiniBear, MiniMoose, MiniSeal] as const;

export function getMiniMascot(index: number) {
    return MINI_MASCOTS[index % MINI_MASCOTS.length];
}

export function Mascot() {
    return (
        <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl" aria-hidden>
            <motion.g
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <path d="M40 100 C40 30, 160 30, 160 100 C160 170, 140 190, 100 190 C60 190, 40 170, 40 100 Z" fill="#3B82F6" />
                <path d="M60 110 C60 60, 140 60, 140 110 C140 160, 120 180, 100 180 C80 180, 60 160, 60 110 Z" fill="#EFF6FF" />
                <circle cx="80" cy="85" r="14" fill="white" />
                <circle cx="120" cy="85" r="14" fill="white" />
                <motion.circle
                    cx="80"
                    cy="85"
                    r="6"
                    fill="#1E3A8A"
                    animate={{ x: [0, 3, -3, 0], y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="120"
                    cy="85"
                    r="6"
                    fill="#1E3A8A"
                    animate={{ x: [0, 3, -3, 0], y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                />
                <path d="M92 100 L108 100 L100 112 Z" fill="#F59E0B" />
                <motion.path
                    d="M40 100 C20 100, 20 140, 40 140"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="12"
                    strokeLinecap="round"
                    animate={{ rotate: [0, 15, 0] }}
                    style={{ transformOrigin: "40px 100px" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                    d="M160 100 C180 100, 180 140, 160 140"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="12"
                    strokeLinecap="round"
                    animate={{ rotate: [0, -15, 0] }}
                    style={{ transformOrigin: "160px 100px" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
            </motion.g>
        </svg>
    );
}
