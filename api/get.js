// fragmio.vercel.app/get: starts the newest installer straight away. The installers stay on GitHub Releases;
// visitors only see this site's address and the download starting.
//   • Until the first stable release: the newest beta (or alpha).
//   • After it: the newest stable release (betas aren't offered here any more).
// If GitHub can't be reached, it sends people to the releases page on GitHub instead.
// Optional Vercel setting: GITHUB_TOKEN (any read-only token) if GitHub ever limits how often it is asked.
const REPO = "all-bluez/fragmio-releases";
const FALLBACK = `https://github.com/${REPO}/releases`;
const KEEP = 5 * 60 * 1000; // ask GitHub at most every 5 minutes (per server)
let cache = { at: 0, url: "" };

/** A release's channel: the hidden <!-- channel: beta --> line the release automation writes, else GitHub's prerelease mark. */
function channelOf(r) {
  const m = /<!--\s*channel:\s*([a-z]+)\s*-->/i.exec(r.body || "");
  return m ? m[1].toLowerCase() : r.prerelease ? "beta" : "stable";
}

async function newestInstaller() {
  if (cache.url && Date.now() - cache.at < KEEP) return cache.url;
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=40`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "fragmio-website",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const all = (await res.json())
    .filter((r) => !r.draft && r.tag_name !== "speech-engine")
    .map((r) => ({ r, channel: channelOf(r), exe: (r.assets || []).find((a) => /setup\.exe$/i.test(a.name)) }))
    .filter((x) => x.exe)
    .sort((a, b) => new Date(b.r.published_at) - new Date(a.r.published_at));
  const stable = all.filter((x) => x.channel === "stable");
  const pick = (stable.length ? stable : all)[0];
  if (!pick) throw new Error("No installer found");
  cache = { at: Date.now(), url: pick.exe.browser_download_url };
  return cache.url;
}

module.exports = async function handler(req, res) {
  try {
    const url = await newestInstaller();
    // Vercel's edge may keep this answer for 5 minutes, so GitHub is asked rarely even with many visitors.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=3600");
    res.writeHead(302, { Location: url });
  } catch (err) {
    console.error("get: falling back to GitHub:", err && err.message);
    res.setHeader("Cache-Control", "no-store");
    res.writeHead(302, { Location: FALLBACK });
  }
  res.end();
};
