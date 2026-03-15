"use client";

import {
    List,
    Calendar,
    BookOpen,
    GraduationCap,
    Library,
    BookMarked,
    LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { IndexSection } from "@/lib/vocabulary-parse";
import { TopicCard } from "./TopicCard";

const ICON_MAP: Record<string, LucideIcon> = {
    List,
    Calendar,
    BookOpen,
    GraduationCap,
    Library,
    BookMarked,
};

type Props = {
    section: IndexSection;
    iconName: string;
    linkStartIndex: number;
    sectionIndex: number;
};

export function VocabularySectionBlock({ section, iconName, linkStartIndex, sectionIndex }: Props) {
    const Icon = ICON_MAP[iconName] ?? List;
    const isFirst = sectionIndex === 0;

    return (
        <motion.section
            id={section.id}
            className="scroll-mt-24 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl shadow-sm bg-accent text-primary">
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {section.title}
                </h2>
            </div>

            {section.links.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.links.map((link, i) => (
                        <TopicCard
                            key={`${section.id}-${link.href}-${i}`}
                            href={link.href}
                            title={link.text}
                            index={linkStartIndex + i}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground italic ml-16">No links in this section.</p>
            )}
        </motion.section>
    );
}
