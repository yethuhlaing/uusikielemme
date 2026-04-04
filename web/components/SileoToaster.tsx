"use client";

import { Toaster } from "sileo";

const EDGE_INSET_PX = 16;

export function SileoToaster() {
    return (
        <div className="relative z-[100]" aria-hidden>
            <Toaster
                position="bottom-right"
                offset={{ bottom: EDGE_INSET_PX, right: EDGE_INSET_PX }}
            />
        </div>
    );
}
