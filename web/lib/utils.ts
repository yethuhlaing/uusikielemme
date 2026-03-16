import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Decode HTML entities in text (e.g. &#8211; → –, &amp; → &). Use for content from WordPress/API. */
export function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&#(\d+);?/g, (_, code) =>
            String.fromCharCode(parseInt(code, 10))
        )
        .replace(/&#x([0-9a-fA-F]+);?/g, (_, code) =>
            String.fromCharCode(parseInt(code, 16))
        )
        .replace(/&nbsp;/g, "\u00A0")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'");
}
