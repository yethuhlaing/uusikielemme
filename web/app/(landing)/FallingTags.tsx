"use client";

import { motion } from "framer-motion";

const TAGS = [
  { label: "Fluency Boost", color: "bg-[#c8e6c9]" },
  { label: "Voice Practice", color: "bg-[#b2dfdb]" },
  { label: "AI Companion", color: "bg-[#e1bee7]" },
  { label: "Context learning", color: "bg-[#bbdefb]" },
  { label: "Pronunciation Coach", color: "bg-[#c5e1a5]" },
  { label: "Speech Feedback", color: "bg-[#b3e5fc]" },
  { label: "Voice Recognition", color: "bg-[#d1c4e9]" },
  { label: "Speaking Confidence", color: "bg-[#a5d6a7]" },
  { label: "Real-Time AI", color: "bg-[#90caf9]" },
  { label: "Progress Tracker", color: "bg-[#ce93d8]" },
  { label: "Smart Challenges", color: "bg-[#80deea]" },
  { label: "Real Conversations", color: "bg-[#b39ddb]" },
  { label: "Daily Tasks", color: "bg-[#81c784]" },
  { label: "Progress", color: "bg-[#b2ebf2]" },
];

const POSITIONS = [
  { left: "5%", top: "72%", rotate: -4 },
  { left: "12%", top: "78%", rotate: 3 },
  { left: "22%", top: "75%", rotate: -2 },
  { left: "35%", top: "82%", rotate: 5 },
  { left: "48%", top: "76%", rotate: -3 },
  { left: "58%", top: "80%", rotate: 2 },
  { left: "68%", top: "74%", rotate: -5 },
  { left: "78%", top: "79%", rotate: 1 },
  { left: "88%", top: "77%", rotate: -2 },
  { left: "8%", top: "85%", rotate: 2 },
  { left: "28%", top: "88%", rotate: -3 },
  { left: "42%", top: "86%", rotate: 4 },
  { left: "62%", top: "84%", rotate: -1 },
  { left: "82%", top: "87%", rotate: 3 },
];

export function FallingTags() {
  return (
    <section
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {TAGS.map((tag, i) => (
        <motion.span
          key={tag.label}
          className={`absolute px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-sm ${tag.color}`}
          style={{
            left: POSITIONS[i].left,
            top: POSITIONS[i].top,
            rotate: POSITIONS[i].rotate,
          }}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.4 + i * 0.04,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {tag.label}
        </motion.span>
      ))}
    </section>
  );
}
