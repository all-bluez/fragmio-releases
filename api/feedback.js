// "Send feedback" / "Report a problem": saves the message in Supabase (table feedback) and emails it to you.
// Runs on Vercel, never in the browser. Uses the same settings as Get access (Vercel → Settings → Environment Variables):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY   where the messages are saved
//   GMAIL_USER, GMAIL_APP_PASSWORD       the email to you (or RESEND_API_KEY + MAIL_FROM later)
//   OWNER_EMAIL                          your inbox (default: GMAIL_USER)
// Works with only one of the two set up: then the message is only saved, or only emailed.
const db = require("./_lib/db");
const mail = require("./_lib/mail");

const KINDS = { idea: "Idea", problem: "Problem", like: "Something I like" };
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const PER_HOUR = 5; // messages one email can send in an hour
const recent = new Map(); // email → send times, when Supabase isn't set up (best effort)

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const short = (v, n) => String(v || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, n);

async function tooMany(email) {
  const since = new Date(Date.now() - 3600000).toISOString();
  if (db.ready()) {
    const rows = await db.select("feedback", `email=${db.eq(email)}&created_at=gte.${encodeURIComponent(since)}&select=id`);
    return rows.length >= PER_HOUR;
  }
  const times = (recent.get(email) || []).filter((t) => t > Date.now() - 3600000);
  recent.set(email, [...times, Date.now()]);
  return times.length >= PER_HOUR;
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

  const kind = KINDS[body.kind] ? body.kind : "";
  const message = String(body.message || "").trim().slice(0, 5000);
  const name = short(body.name, 80);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const version = short(body.version, 30);
  const channel = short(body.channel, 20);
  const os = short(body.os, 60);
  if (!kind) return res.status(400).json({ ok: false, error: "Please choose what kind of message this is." });
  if (message.length < 5) return res.status(400).json({ ok: false, error: "Please write a little more." });
  if (name.length < 2) return res.status(400).json({ ok: false, error: "Please enter your name." });
  if (!EMAIL.test(email)) return res.status(400).json({ ok: false, error: "Please enter a valid email address." });

  const owner = mail.ownerInbox();
  const canMail = mail.ready() && !!owner;
  if (!db.ready() && !canMail) return res.status(503).json({ ok: false, error: "Feedback isn't open yet. Please try again later." });

  try {
    if (await tooMany(email)) return res.status(429).json({ ok: false, error: "Thanks, that's a lot of messages for one hour. Please send the rest a little later." });
  } catch (err) {
    console.error("feedback rate check failed:", err && err.message); // carry on: better a message too many than one lost
  }

  let saved = false;
  let mailed = false;
  if (db.ready()) {
    try {
      await db.insert("feedback", { app: "fragmio", kind, message, name, email, version, channel, os });
      saved = true;
    } catch (err) {
      console.error("feedback save failed:", err && err.message);
    }
  }
  if (canMail) {
    const about = [version && `Fragmio ${version}${channel ? ` ${channel}` : ""}`, os].filter(Boolean).join(" · ");
    const first = message.replace(/\s+/g, " ").slice(0, 60);
    try {
      await mail.send({
        to: owner,
        replyTo: `${name.replace(/["<>]/g, "")} <${email}>`,
        fromName: "Fragmio feedback",
        subject: `[Fragmio ${KINDS[kind]}] ${first}${message.length > 60 ? "…" : ""}`,
        text: [`${KINDS[kind]} from ${name} <${email}>`, about, "", message, "", "Reply to this email to answer them."].filter((l) => l !== undefined).join("\n"),
        html: `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c2126;max-width:600px">
<p style="margin:0 0 4px"><b>${esc(KINDS[kind])}</b> from ${esc(name)} &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;</p>
${about ? `<p style="margin:0 0 14px;color:#6b7280;font-size:13px">${esc(about)}</p>` : ""}
<div style="white-space:pre-wrap;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:14px">${esc(message)}</div>
<p style="color:#6b7280;font-size:13px;margin:14px 0 0">Reply to this email to answer them.${saved ? " It is also saved in Supabase (table feedback)." : ""}</p></div>`,
      });
      mailed = true;
    } catch (err) {
      console.error("feedback email failed:", err && err.message);
    }
  }
  if (!saved && !mailed) return res.status(500).json({ ok: false, error: "Couldn't send right now. Please try again in a minute." });
  return res.status(200).json({ ok: true });
};
