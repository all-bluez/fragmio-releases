// Counts one page view for the hub's Analytics. No cookies, no IP address, nothing about the visitor:
// only the page, the website the visitor came from (its name only) and the country Vercel reports.
const db = require("./_lib/db");

const SITE = "fragmio";
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(JSON.parse(req.body || "{}"));
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();
  if (!db.ready() || BOT.test(req.headers["user-agent"] || "")) return res.status(204).end();
  try {
    const b = await readBody(req);
    const path = String(b.p || "/").replace(/[?#].*$/, "").replace(/\.html$/, "").slice(0, 120) || "/";
    let ref = "";
    try {
      const host = new URL(String(b.r || "")).hostname.replace(/^www\./, "");
      if (host && !host.endsWith("vercel.app") && !host.endsWith("allbluez.com") && !host.endsWith("allbluez.in")) ref = host.slice(0, 80);
    } catch {
      // no referrer
    }
    const country = String(req.headers["x-vercel-ip-country"] || "").slice(0, 2);
    await db.insert("page_views", { site: SITE, path, ref, country });
  } catch (err) {
    console.error("hit failed:", err && err.message);
  }
  return res.status(204).end();
};
