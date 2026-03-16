import path from "path";
import fs from "fs";

/** Path to the WordPress mirror (posts + pages dirs, or legacy wp-json) */
function resolveMirrorDir(): string {
    if (process.env.WP_MIRROR_DIR) return process.env.WP_MIRROR_DIR;
    const cwd = process.cwd();
    const hasMirror = (dir: string) =>
        fs.existsSync(path.join(dir, "posts")) ||
        fs.existsSync(path.join(dir, "pages")) ||
        fs.existsSync(path.join(dir, "wp-json"));
    // Run from web/ -> mirror at ../uusikielemme.fi
    const fromWeb = path.join(cwd, "..", "uusikielemme.fi");
    if (hasMirror(fromWeb)) return fromWeb;
    // Run from repo root -> mirror at ./uusikielemme.fi
    const fromRoot = path.join(cwd, "uusikielemme.fi");
    if (hasMirror(fromRoot)) return fromRoot;
    return fromWeb;
}

export const WP_MIRROR_DIR = resolveMirrorDir();

export const WP_ORIGIN = "https://uusikielemme.fi";
/** Static base for uploads in the built site (must match public copy) */
export const UPLOADS_BASE = "/wp-content/uploads";
