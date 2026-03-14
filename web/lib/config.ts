import path from "path";

/** Path to the WordPress mirror (wp-json + wp-content) relative to project root */
export const WP_MIRROR_DIR =
  process.env.WP_MIRROR_DIR ||
  path.join(process.cwd(), "..", "uusikielemme.fi");

export const WP_ORIGIN = "https://uusikielemme.fi";
/** Static base for uploads in the built site (must match public copy) */
export const UPLOADS_BASE = "/wp-content/uploads";
