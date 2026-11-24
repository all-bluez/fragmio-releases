// "Get access": makes a beta invite code and emails it straight away. Runs on Vercel, never in the browser.
// The same email asking again gets the same code again (a new one only if the old one has expired).
//
// Vercel → Project → Settings → Environment Variables:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY   where beta users are saved (the hub shows them)
//   INVITE_PRIVATE_KEY                   the text of ~/.fragmio-keys/invite-ed25519-private.pem
//   GMAIL_USER, GMAIL_APP_PASSWORD       email for now (or RESEND_API_KEY + MAIL_FROM later)
//   optional: BETA_DAYS (how long codes work, default 180), NOTIFY_NEW_BETA=1 (email you about each new user),
//             SITE_URL (default https://fragmio.vercel.app)
// Until Supabase and the invite key are set, it falls back to emailing the request to you (the old way).
const db = require("./_lib/db");
const mail = require("./_lib/mail");
const invite = require("./_lib/invite");

const MAKES = ["Gaming", "Podcasts", "Education", "Other"];
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const RESEND_GAP = 10 * 60 * 1000; // don't email the same person more than once in 10 minutes
const recent = new Map(); // fallback mode only: email → last request (best effort)

const site = () => (process.env.SITE_URL || "https://fragmio.vercel.app").replace(/\/+$/, "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function codeEmail(code, expires) {
  const get = `${site()}/download?get=1`; // the download page starts the newest installer
  const github = "https://github.com/all-bluez/fragmio-releases/releases/latest"; // the last resort
  const until = expires ? `Your code works until ${expires}.` : "";
  const text = [
    "Welcome to the Fragmio beta!",
    "",
    "Your invite code:",
    code,
    "",
    "1. Download Fragmio: " + get,
    "   (Not working? Download the latest version here: " + github + ")",
    "2. Install it and open it.",
    "3. Paste the code when Fragmio asks for it. You only do this once.",
    "",
    until,
    "Found a bug or have an idea? Reply to this email or use Help → Send feedback in the app.",
    "",
    "Thanks for testing,",
    "ZAK, allbluez.",
  ].join("\n");
  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c2126;max-width:560px">
<p style="font-size:18px;font-weight:700;margin:0 0 12px">Welcome to the Fragmio beta!</p>
<p style="margin:0 0 6px">Your invite code:</p>
<p style="font-family:Consolas,monospace;font-size:13px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:12px;word-break:break-all;margin:0 0 18px">${esc(code)}</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 10px"><tr><td style="border-radius:10px;background:#c2185b">
<a href="${esc(get)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">Download Fragmio</a>
</td></tr></table>
<p style="font-size:13px;color:#6b7280;margin:0 0 18px">Button not working? <a href="${esc(github)}" style="color:#c2185b">Download the latest version here</a>.</p>
<ol style="padding-left:20px;margin:0 0 16px">
<li>Install it and open it.</li>
<li>Paste the code when Fragmio asks for it. You only do this once.</li>
</ol>
<p style="color:#6b7280;margin:0 0 16px">${esc(until)} Found a bug or have an idea? Reply to this email or use Help → Send feedback in the app.</p>
<p style="margin:0">Thanks for testing,<br>ZAK, allbluez.</p></div>`;
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

  try {
    if (!db.ready() || !invite.ready() || !mail.ready()) return await fallback(email, makes, res);

    const days = Number(process.env.BETA_DAYS || 180);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    let [row] = await db.select("beta_users", `app=eq.fragmio&email=${db.eq(email)}&select=*`);
    let isNew = false;

    if (!row) {
      const name = email.split("@")[0];
      const { code, expires } = invite.makeCode(email, name, days);
      row = await db.insert("beta_users", { app: "fragmio", email, makes, code, expires });
      isNew = true;
    } else {
      if (row.last_sent_at && now - new Date(row.last_sent_at) < RESEND_GAP) return res.status(200).json({ ok: true });
      const patch = {};
      if (makes && makes !== row.makes) patch.makes = makes;
      if (row.expires && row.expires < today) Object.assign(patch, invite.makeCode(email, email.split("@")[0], days)); // old code expired: a fresh one
      if (Object.keys(patch).length) row = await db.update("beta_users", `id=eq.${row.id}`, patch);
    }

    const m = codeEmail(row.code, row.expires);
    await mail.send({ to: email, subject: m.subject, text: m.text, html: m.html, fromName: "Fragmio", replyTo: mail.ownerInbox() || undefined });
    await db.update("beta_users", `id=eq.${row.id}`, { last_sent_at: now.toISOString(), sent_count: (row.sent_count || 0) + 1 });

    if (isNew && process.env.NOTIFY_NEW_BETA === "1" && mail.ownerInbox()) {
      await mail
        .send({ to: mail.ownerInbox(), fromName: "Fragmio website", subject: `New Fragmio beta user: ${email}`, text: `Email: ${email}\nMakes: ${makes || "(not given)"}\nTheir code was emailed to them automatically.` })
        .catch(() => undefined);
    }
    return res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.error("request-access failed:", err && err.message);
    return res.status(500).json({ ok: false, error: "Couldn't send right now. Please try again in a minute." });
  }
};
