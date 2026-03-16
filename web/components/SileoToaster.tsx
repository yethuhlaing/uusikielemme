"use client";

import { Toaster } from "sileo";

/** Navbar is z-50 and ~4.5rem tall; toasts need to sit below it and above other content. */
const NAVBAR_OFFSET_PX = 80;

export function SileoToaster() {
    return (
        <div className="relative z-[100]" aria-hidden>
            <Toaster
                position="top-right"
                offset={{ top: NAVBAR_OFFSET_PX, right: 16 }}
            />
        </div>
    );
}
