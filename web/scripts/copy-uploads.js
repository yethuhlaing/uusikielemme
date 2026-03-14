const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const mirrorDir = process.env.WP_MIRROR_DIR || path.join(projectRoot, "..", "uusikielemme.fi");
const uploadsSrc = path.join(mirrorDir, "wp-content", "uploads");
const uploadsDest = path.join(projectRoot, "public", "wp-content", "uploads");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn("Uploads source not found:", uploadsSrc);
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log("Copying wp-content/uploads to public/wp-content/uploads...");
copyRecursive(uploadsSrc, uploadsDest);
console.log("Done.");
