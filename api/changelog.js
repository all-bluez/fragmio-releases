// The release notes for the Changelog page, from GitHub's public releases (newest first).
// Cached at the edge for 10 minutes, so GitHub is asked rarely.
const REPO = "all-bluez/fragmio-releases";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "fragmio-site" },
    });
    if (!r.ok) throw new Error("GitHub said " + r.status);
    const list = await r.json();
    const releases = list
      .filter((x) => !x.draft)
      .map((x) => ({
        version: String(x.tag_name || "").replace(/^v/i, ""),
        name: x.name || "",
        date: x.published_at || x.created_at,
        pre: !!x.prerelease,
        // Drop download tables and checksums that the build adds; keep the words.
        notes: String(x.body || "")
          .replace(/\r/g, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .split("\n")
          .filter((l) => !/^\s*\|/.test(l) && !/sha-?256|checksum/i.test(l))
          .join("\n")
          .trim(),
        url: x.html_url,
      }));
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json({ ok: true, releases });
  } catch (e) {
    console.error("changelog failed:", e.message);
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(502).json({ ok: false });
  }
};
