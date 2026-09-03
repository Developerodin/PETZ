import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(__dirname, "../../petz.love");
const DEST = path.resolve(__dirname, "..");

const VOID_TAGS = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "embed", "track"]);

const ATTR_RENAMES = {
  class: "className",
  for: "htmlFor",
  autocomplete: "autoComplete",
  novalidate: "noValidate",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  srcset: "srcSet",
  fetchpriority: "fetchPriority",
  crossorigin: "crossOrigin",
  maxlength: "maxLength",
  minlength: "minLength",
  readonly: "readOnly",
  autofocus: "autoFocus",
  charset: "charSet",
  datetime: "dateTime",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "stroke-miterlimit": "strokeMiterlimit",
  "color-interpolation": "colorInterpolation",
};

const ROUTE_OVERRIDES = {
  "pages/assess-results.html": "app/assess/results/page.tsx",
};

function toAppPath(url) {
  if (!url || /^(https?:|mailto:|tel:|#)/i.test(url)) return url;
  const parts = [];
  for (const seg of url.replace(/\\/g, "/").split("/")) {
    if (seg === ".." || seg === ".") continue;
    parts.push(seg);
  }
  let rest = parts.join("/");
  if (rest.startsWith("assets/")) return `/${rest}`;
  if (rest.startsWith("pages/")) rest = rest.slice("pages/".length);
  if (rest === "index.html" || rest === "") return "/";
  if (rest === "assess-results.html") return "/assess/results";
  if (rest.endsWith(".html")) return `/${rest.slice(0, -5)}`;
  return `/${rest}`;
}

function rewriteUrls(html) {
  return html.replace(/\b(href|src)="([^"]*)"/g, (_, attr, url) => `${attr}="${toAppPath(url)}"`);
}

function cssToJsxObject(css) {
  const entries = css
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((rule) => {
      const idx = rule.indexOf(":");
      if (idx === -1) return null;
      const key = rule.slice(0, idx).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const value = rule.slice(idx + 1).trim();
      const isNum = /^-?\d+(\.\d+)?$/.test(value);
      return `${key}: ${isNum ? value : JSON.stringify(value)}`;
    })
    .filter(Boolean);
  return `{${entries.join(", ")}}`;
}

function renameAttr(name) {
  const lower = name.toLowerCase();
  if (ATTR_RENAMES[lower]) return ATTR_RENAMES[lower];
  if (ATTR_RENAMES[name]) return ATTR_RENAMES[name];
  return name;
}

function transformAttrs(attrs) {
  let out = attrs.replace(/\sstyle="([^"]*)"/g, (_m, css) => ` style={${cssToJsxObject(css)}}`);
  const names = Object.keys(ATTR_RENAMES).sort((a, b) => b.length - a.length);
  for (const from of names) {
    const to = ATTR_RENAMES[from];
    out = out.replace(new RegExp(`\\s${from}=`, "gi"), ` ${to}=`);
    out = out.replace(new RegExp(`\\s${from}(?=[\\s>/]|$)`, "gi"), ` ${to}`);
  }
  out = out.replace(/\s(rows|cols|maxLength|minLength|tabIndex)="(\d+)"/g, " $1={$2}");
  return out;
}

function htmlToJsx(html) {
  let out = html.replace(/<!--([\s\S]*?)-->/g, (_m, body) => `{/*${body.replace(/\*\//g, "* /")}*/}`);

  out = out.replace(/<([a-zA-Z][\w:-]*)(\s[^>]*?)?(\/)?>/g, (full, tag, attrs = "", selfClose) => {
    const transformed = transformAttrs(attrs || "");
    const lower = tag.toLowerCase();
    const isVoid = VOID_TAGS.has(lower) || Boolean(selfClose);
    return `<${tag}${transformed}${isVoid ? " />" : ">"}`;
  });

  return out;
}

function extractMain(html) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const bodyMatch = withoutScripts.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : withoutScripts;
  const footerIdx = body.search(/<footer\b/i);
  if (footerIdx !== -1) body = body.slice(0, footerIdx);
  body = body.replace(/<div class="page-wrapper">\s*/i, "");
  body = body.replace(/<div class="section-frame absolute-nav">[\s\S]*?<\/header>\s*<\/div>\s*/i, "");
  body = body.replace(/<header[\s\S]*?<\/header>\s*/i, "");
  return body.trim();
}

function extractMeta(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || "PETZ";
  const description =
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ||
    "PETZ uses AI and veterinary-informed health science to understand your pet's health.";
  const overlay = html.includes("absolute-nav");
  return { title: decode(title), description: decode(description), variant: overlay ? "overlay" : "inflow" };
}

function decode(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function indent(jsx, spaces = 6) {
  const pad = " ".repeat(spaces);
  return jsx
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

function toComponentName(routeFile) {
  if (routeFile === "app/page.tsx") return "HomePage";
  const slug = routeFile.replace(/^app\//, "").replace(/\/page\.tsx$/, "");
  return (
    slug
      .split(/[/\\-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Page"
  );
}

function writePage(relHtml) {
  const abs = path.join(SOURCE, relHtml);
  const html = fs.readFileSync(abs, "utf8");
  const meta = extractMeta(html);
  const main = rewriteUrls(extractMain(html));
  let jsx = htmlToJsx(main);
  if (relHtml.replace(/\\/g, "/").endsWith("how-it-works.html")) {
    const firstSectionClose = jsx.indexOf("</section>");
    if (firstSectionClose !== -1) {
      jsx = `${jsx.slice(0, firstSectionClose)}</div>\n          ${jsx.slice(firstSectionClose)}`;
    }
  }
  const outFile = ROUTE_OVERRIDES[relHtml] || (relHtml === "index.html" ? "app/page.tsx" : `app/${relHtml.replace(/^pages\//, "").replace(/\.html$/, "")}/page.tsx`);
  const destPath = path.join(DEST, outFile);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const name = toComponentName(outFile);
  const contents = `import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: ${JSON.stringify(meta.title)},
  description: ${JSON.stringify(meta.description)},
};

export default function ${name}() {
  return (
    <SiteShell variant="${meta.variant}">
${indent(jsx)}
    </SiteShell>
  );
}
`;
  fs.writeFileSync(destPath, contents);
  return outFile;
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

const files = walk(SOURCE)
  .map((abs) => path.relative(SOURCE, abs).replace(/\\/g, "/"))
  .filter((rel) => rel === "index.html" || rel.startsWith("pages/"));

const written = files.map(writePage);
console.log(`Converted ${written.length} pages:`);
written.forEach((file) => console.log(" -", file));
