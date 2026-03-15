"use client";

import { useCallback, useEffect, useState } from "react";
import { getProgressForHref } from "./card-progress";

/** Returns stored scroll progress (0–100) for the card’s href; refreshes on mount and when returning to the tab */
export function useCardProgress(href: string): number {
    const [progress, setProgress] = useState(0);

    const refresh = useCallback(() => {
        setProgress(getProgressForHref(href));
    }, [href]);

    useEffect(() => {
        refresh();
        const onFocusOrVisible = () => refresh();
        window.addEventListener("focus", onFocusOrVisible);
        document.addEventListener("visibilitychange", onFocusOrVisible);
        return () => {
            window.removeEventListener("focus", onFocusOrVisible);
            document.removeEventListener("visibilitychange", onFocusOrVisible);
        };
    }, [refresh]);

    return progress;
}
