import path from "path";
import fs from "fs";

/** Path to the WordPress mirror (wp-json + wp-content) */
function resolveMirrorDir(): string {
  if (process.env.WP_MIRROR_DIR) return process.env.WP_MIRROR_DIR;
  const cwd = process.cwd();
  // Run from web/ -> mirror at ../uusikielemme.fi
  const fromWeb = path.join(cwd, "..", "uusikielemme.fi");
  if (fs.existsSync(path.join(fromWeb, "wp-json"))) return fromWeb;
  // Run from repo root -> mirror at ./uusikielemme.fi
  const fromRoot = path.join(cwd, "uusikielemme.fi");
  if (fs.existsSync(path.join(fromRoot, "wp-json"))) return fromRoot;
  return fromWeb;
}

export const WP_MIRROR_DIR = resolveMirrorDir();

export const WP_ORIGIN = "https://uusikielemme.fi";
/** Static base for uploads in the built site (must match public copy) */
export const UPLOADS_BASE = "/wp-content/uploads";
