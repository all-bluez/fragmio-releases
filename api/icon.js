// The browser tab icon, phone icon and share picture: the ones uploaded in Admin → Apps → Fragmio →
// Logos and icons, or this site's own files (public/) when nothing is uploaded.
//   /api/icon?kind=favicon | apple | og
const HUB = "https://allbluez-hub.vercel.app";
const OWN = { favicon: "/favicon.svg", apple: "/apple-touch-icon.png", og: "/logo.png" };
const ok = (u) => (typeof u === "string" && /^https:\/\//i.test(u) ? u : "");

module.exports = async function handler(req, res) {
  const kind = String((req.query && req.query.kind) || "favicon");
  if (!OWN[kind]) return res.status(400).end();
  let url = "";
  try {
    const r = await fetch(`${HUB}/api/app?slug=fragmio`);
    const d = await r.json();
    const a = (d && d.ok && d.app && d.app.assets) || {};
    url = kind === "favicon" ? ok(a.favicon) || ok(a.mark) : kind === "apple" ? ok(a.apple) : ok(a.og);
  } catch (e) {
    console.error("icon failed:", e.message);
  }
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=3600");
  res.writeHead(302, { Location: url || OWN[kind] });
  return res.end();
};
