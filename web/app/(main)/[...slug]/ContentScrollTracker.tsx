"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { setProgressForPath, THROTTLE_MS } from "../finnish-vocabulary/card-progress";

function getScrollPercent(): number {
    if (typeof window === "undefined") return 0;
    const { scrollY, innerHeight } = window;
    const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
    );
    const maxScroll = scrollHeight - innerHeight;
    if (maxScroll <= 0) return 100;
    // 100% when viewport has reached/passed the document bottom
    const bottomEdge = scrollY + innerHeight;
    if (bottomEdge >= scrollHeight - 1) return 100;
    const distanceFromBottom = scrollHeight - bottomEdge;
    // 100% when within 5% of scroll range from bottom (over-reported height, sticky footers)
    if (distanceFromBottom <= Math.max(50, innerHeight * 0.05, maxScroll * 0.05))
        return 100;
    return Math.min(100, (scrollY / maxScroll) * 100);
}

/**
 * Tracks scroll on this page and saves progress to localStorage so the
 * vocabulary page can show per-card progress (how far the user scrolled each topic).
 */
export function ContentScrollTracker() {
    const pathname = usePathname();
    const lastWrite = useRef(0);
    const raf = useRef<number | null>(null);

    const update = useCallback(() => {
        if (!pathname) return;
        const next = getScrollPercent();
        const now = Date.now();
        if (now - lastWrite.current >= THROTTLE_MS) {
            lastWrite.current = now;
            setProgressForPath(pathname, next);
        }
    }, [pathname]);

    useEffect(() => {
        if (!pathname) return;
        const onScrollOrResize = () => {
            if (raf.current != null) return;
            raf.current = requestAnimationFrame(() => {
                raf.current = null;
                update();
            });
        };
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        update();
        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            if (raf.current != null) cancelAnimationFrame(raf.current);
        };
    }, [pathname, update]);

    return null;
}
