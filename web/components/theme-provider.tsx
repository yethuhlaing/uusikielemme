"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "uusikielemme-theme";

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getStoredTheme(): Theme {
    if (typeof window === "undefined") return "system";
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system")
            return stored;
    } catch {
        // ignore
    }
    return "system";
}

function applyTheme(resolved: "light" | "dark") {
    const root = document.documentElement;
    if (resolved === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
        "light",
    );
    const [mounted, setMounted] = useState(false);

    const resolveTheme = useCallback((): "light" | "dark" => {
        if (theme === "system") return getSystemTheme();
        return theme;
    }, [theme]);

    useEffect(() => {
        setMounted(true);
        setThemeState(getStoredTheme());
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const resolved = resolveTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, [mounted, resolveTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            localStorage.setItem(STORAGE_KEY, newTheme);
        } catch {
            // ignore
        }
        const resolved =
            newTheme === "system" ? getSystemTheme() : newTheme;
        setResolvedTheme(resolved);
        applyTheme(resolved);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (theme !== "system") return;
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            applyTheme(resolved);
        };
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, [mounted, theme]);

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
