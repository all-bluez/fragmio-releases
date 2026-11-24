// "Send feedback" / "Report a problem": saves the message in Supabase (table feedback) and emails it to you.
// Runs on Vercel, never in the browser. Uses the same settings as Get access (Vercel → Settings → Environment Variables):
//   SUPABASE_URL, SUPABASE_SERVICE_KEY   where the messages are saved
//   GMAIL_USER, GMAIL_APP_PASSWORD       the email to you (or RESEND_API_KEY + MAIL_FROM later)
//   OWNER_EMAIL                          your inbox (default: GMAIL_USER)
// Works with only one of the two set up: then the message is only saved, or only emailed.
const db = require("./_lib/db");
const mail = require("./_lib/mail");
const tpl = require("./_lib/email");

const KINDS = { idea: "Idea", problem: "Problem", like: "Something I like" };
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const PER_HOUR = 5; // messages one email can send in an hour
const recent = new Map(); // email → send times, when Supabase isn't set up (best effort)

const esc = tpl.esc;
const KIND_COLOR = { idea: "#7048e8", problem: "#e03131", like: "#2b8a3e" };

/** The email you get: what kind, who, their message, and their version. */
function feedbackHtml({ kind, name, email, message, version, channel, os, saved }) {
  const c = tpl.colors;
  const row = (label, value) =>
    value ? `<tr><td class="muted" style="padding:3px 14px 3px 0;color:${c.MUTED};font-size:13px;white-space:nowrap">${label}</td><td class="ink" style="padding:3px 0;color:${c.INK};font-size:13.5px">${value}</td></tr>` : "";
  return tpl.layout({
    title: `${KINDS[kind]} from ${name}`,
    preheader: message.replace(/\s+/g, " ").slice(0, 110),
    body: `<div style="margin:0 0 14px">${tpl.pill(KINDS[kind], KIND_COLOR[kind])}</div>
<h1 class="ink h1" style="margin:0 0 4px;font-size:22px;line-height:1.3;font-weight:800;color:${c.INK}">${esc(name)}</h1>
<p style="margin:0 0 20px"><a href="mailto:${esc(email)}" style="color:${c.BERRY};text-decoration:none;font-weight:600">${esc(email)}</a></p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr>
<td class="box ink" style="background:${c.SOFT};border-left:4px solid ${KIND_COLOR[kind]};border-radius:0 12px 12px 0;padding:16px 18px;color:${c.INK};font-size:15.5px;line-height:1.6;white-space:pre-wrap">${esc(message)}</td>
</tr></table>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px">
${row("App", version ? esc(`Fragmio ${version}${channel ? " " + channel : ""}`) : "")}
${row("Windows", esc(os))}
${row("Sent", esc(new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })) + " IST")}
</table>
<div style="text-align:center">${tpl.button(`Reply to ${name.split(" ")[0]}`, `mailto:${email}?subject=${encodeURIComponent("Re: your Fragmio " + KINDS[kind].toLowerCase())}`)}</div>`,
    footer: `Or just press Reply: it goes to ${esc(email)}.${saved ? "<br>Also saved in Supabase → Table Editor → feedback." : ""}`,
  });
}
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
        html: feedbackHtml({ kind, name, email, message, version, channel, os, saved }),
      });
      mailed = true;
    } catch (err) {
      console.error("feedback email failed:", err && err.message);
    }
  }
  if (!saved && !mailed) return res.status(500).json({ ok: false, error: "Couldn't send right now. Please try again in a minute." });
  return res.status(200).json({ ok: true });
};
