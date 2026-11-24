// "Get access": makes a beta invite code and emails it straight away. Runs on Vercel, never in the browser.
// The same email asking again gets the same code again (a new one only if the old one has expired).
//
// Vercel → Project → Settings → Environment Variables:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY   where users are saved, with their plan (the hub shows them)
//   INVITE_PRIVATE_KEY                   the text of ~/.fragmio-keys/invite-ed25519-private.pem
//   GMAIL_USER, GMAIL_APP_PASSWORD       email for now (or RESEND_API_KEY + MAIL_FROM later)
//   optional: BETA_DAYS (how long codes work, default 180), NOTIFY_NEW_BETA=1 (email you about each new user),
//             SITE_URL (default https://fragmio.vercel.app)
// Until Supabase and the invite key are set, it falls back to emailing the request to you (the old way).
const db = require("./_lib/db");
const mail = require("./_lib/mail");
const invite = require("./_lib/invite");
const tpl = require("./_lib/email");

// The plan new people get: the release channel while testing (alpha / beta), free once a stable version is out.
// version.json is written by the release automation, so this follows the newest release by itself.
function newPlan() {
  let channel = "beta";
  try {
    channel = String(require("../version.json").channel || "beta").toLowerCase();
  } catch {
    // no version file: beta
  }
  return channel === "stable" ? "free" : channel === "alpha" ? "alpha" : "beta";
}

const MAKES = ["Gaming", "Podcasts", "Education", "Other"];
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const RESEND_GAP = 10 * 60 * 1000; // don't email the same person more than once in 10 minutes
const recent = new Map(); // fallback mode only: email → last request (best effort)

const site = tpl.site;

function codeEmail(code, expires) {
  const download = `${site()}/download?get=1`; // the download page, which starts the newest installer
  const github = "https://github.com/all-bluez/fragmio-releases/releases/latest"; // the last resort
  const until = expires ? `Your code works until ${new Date(expires + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.` : "";
  const text = [
    "Welcome to the Fragmio beta!",
    "",
    "Your invite code:",
    code,
    "",
    "1. Download Fragmio: " + download,
    "2. Install it and open it.",
    "3. Paste the code when Fragmio asks for it. You only do this once.",
    "",
    "Download not starting? Get it from GitHub: " + github,
    until,
    "",
    "Found a bug or have an idea? Just reply to this email.",
    "",
    "Thanks for testing,",
    "ZAK, allbluez.",
  ].join("\n");
  const { colors: c } = tpl;
  const step = (n, html) => `<tr><td valign="top" style="padding:0 12px 12px 0"><span style="display:inline-block;width:26px;height:26px;line-height:26px;border-radius:99px;background:${c.SOFT};color:${c.BERRY};font-weight:800;font-size:13px;text-align:center">${n}</span></td><td class="ink" style="padding:2px 0 12px;color:${c.INK}">${html}</td></tr>`;
  const html = tpl.layout({
    title: "Your Fragmio beta invite code",
    preheader: "Your invite code is inside. Download Fragmio, paste the code, and start clipping.",
    body: `${tpl.h1("Welcome to the Fragmio beta!")}
${tpl.p("Thanks for joining. Here is your invite code: Fragmio asks for it once, the first time it opens.")}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 24px"><tr>
<td class="box" style="background:${c.SOFT};border:1px dashed ${c.BERRY};border-radius:12px;padding:16px 18px">
<div class="muted" style="font-size:11.5px;font-weight:700;letter-spacing:.6px;color:${c.BERRY};margin-bottom:6px">YOUR INVITE CODE</div>
<div class="ink" style="font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.5;color:${c.INK};word-break:break-all">${tpl.esc(code)}</div>
</td></tr></table>
<div style="margin:0 0 26px;text-align:center">${tpl.button("Download Fragmio", download)}
<div class="muted" style="margin-top:10px;font-size:12.5px;color:${c.MUTED}">Free for Windows 10 and 11 · 64-bit</div></div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px">
${step(1, "<b>Download</b> and run the installer. If Windows says &ldquo;Windows protected your PC&rdquo;, click <b>More info → Run anyway</b>.")}
${step(2, "<b>Open Fragmio.</b>")}
${step(3, "<b>Paste your code</b> when it asks. You only do this once.")}
</table>
<hr style="border:0;border-top:1px solid ${c.LINE};margin:8px 0 18px">
${tpl.p(`Download not starting? <a href="${tpl.esc(github)}" style="color:${c.BERRY}">Get it from GitHub</a>.${until ? " " + tpl.esc(until) : ""}`, "font-size:13.5px")}
${tpl.p("Found a bug or have an idea? Just reply to this email: it comes straight to me.", "font-size:13.5px")}
<p class="ink" style="margin:18px 0 0;color:${c.INK}">Thanks for testing,<br><b>ZAK</b>, allbluez.</p>`,
  });
  return { subject: "Your Fragmio beta invite code", text, html };
}

async function fallback(email, makes, res) {
  // No database or invite key yet: forward the request to you, as before.
  const owner = mail.ownerInbox();
  if (!mail.ready() || !owner) return res.status(503).json({ ok: false, error: "Requests aren't open yet. Please try again later." });
  const last = recent.get(email);
  if (last && Date.now() - last < 86400000) return res.status(200).json({ ok: true, manual: true });
  await mail.send({
    to: owner,
    replyTo: email,
    fromName: "Fragmio website",
    subject: `Fragmio access request: ${email}`,
    text: [`Email: ${email}`, `Makes: ${makes || "(not given)"}`, "", "Automatic codes are off (Supabase or INVITE_PRIVATE_KEY not set).", "To invite them, run in the Fragmio folder:", `  npm run invite -- "Name" ${email}`, "then reply to this email with the code."].join("\n"),
  });
  recent.set(email, Date.now());
  return res.status(200).json({ ok: true, manual: true });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Use the form on the website." });
  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  // A hidden field people never see: bots fill it in. Pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });

  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const makes = MAKES.includes(body.makes) ? body.makes : "";
  if (!EMAIL.test(email)) return res.status(400).json({ ok: false, error: "Please enter a valid email address." });

  let step = "starting";
  try {
    if (!db.ready() || !invite.ready() || !mail.ready()) {
      step = "emailing you the request (no database or invite key yet)";
      return await fallback(email, makes, res);
    }

    const days = Number(process.env.BETA_DAYS || 180);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    step = "reading the users table (has supabase-setup.sql been run?)";
    let [row] = await db.select("users", `app=eq.fragmio&email=${db.eq(email)}&select=*`);
    let isNew = false;

    if (!row) {
      const name = email.split("@")[0];
      const { code, expires } = invite.makeCode(email, name, days);
      step = "saving the new user";
      row = await db.insert("users", { app: "fragmio", email, plan: newPlan(), makes, code, expires });
      isNew = true;
    } else {
      if (row.last_sent_at && now - new Date(row.last_sent_at) < RESEND_GAP) return res.status(200).json({ ok: true });
      const patch = {};
      if (makes && makes !== row.makes) patch.makes = makes;
      // No code yet (e.g. they bought Pro first) or the old one expired: a fresh one.
      if (!row.code || (row.expires && row.expires < today)) Object.assign(patch, invite.makeCode(email, email.split("@")[0], days));
      if (Object.keys(patch).length) row = await db.update("users", `id=eq.${row.id}`, patch);
    }

    step = "sending the email (check GMAIL_USER and GMAIL_APP_PASSWORD)";
    const m = codeEmail(row.code, row.expires);
    await mail.send({ to: email, subject: m.subject, text: m.text, html: m.html, fromName: "Fragmio", replyTo: mail.ownerInbox() || undefined });
    await db.update("users", `id=eq.${row.id}`, { last_sent_at: now.toISOString(), sent_count: (row.sent_count || 0) + 1 });

    if (isNew && process.env.NOTIFY_NEW_BETA === "1" && mail.ownerInbox()) {
      await mail
        .send({ to: mail.ownerInbox(), fromName: "Fragmio website", subject: `New Fragmio beta user: ${email}`, text: `Email: ${email}\nMakes: ${makes || "(not given)"}\nTheir code was emailed to them automatically.` })
        .catch(() => undefined);
    }
    return res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.error(`request-access failed while ${step}:`, err && err.message);
    return res.status(500).json({ ok: false, error: "Couldn't send right now. Please try again in a minute." });
  }
};
