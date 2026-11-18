/**
 * Prints ADMIN_* values from .env.local for pasting into the Vercel dashboard.
 * Does not print AUTH_SECRET or other secrets unless --all is passed.
 *
 * Usage: node scripts/print-admin-vercel-env.mjs
 */
import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local — run from PETZ/ after configuring admin env.");
  process.exit(1);
}

const text = fs.readFileSync(envPath, "utf8");
const wanted = ["ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "AUTH_SECRET"];
const values = Object.fromEntries(
  text
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

console.log("Add these in Vercel → Project → Settings → Environment Variables");
console.log("(Production + Preview), then Redeploy.\n");
for (const key of wanted) {
  let value = values[key];
  if (!value) {
    console.log(`${key}=(missing in .env.local)`);
    continue;
  }
  // Strip local dotenv quotes / \$ escapes — paste the raw hash into Vercel.
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }
  value = value.replaceAll("\\$", "$");
  console.log(`${key}=${value}`);
}
