// Sends email. Two ways, set in Vercel settings:
//   • Resend (after you have your domain):  RESEND_API_KEY and MAIL_FROM (e.g. "Fragmio <fragmio@allbluez.com>")
//   • Gmail (for now):                      GMAIL_USER and GMAIL_APP_PASSWORD
// If RESEND_API_KEY is set it is used; otherwise Gmail.
const nodemailer = require("nodemailer");

function gmail() {
  const user = (process.env.GMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  return user && pass ? { user, pass } : null;
}

function ready() {
  return !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM) || !!gmail();
}

/** The inbox where notices for you arrive (your AllBlueZ address). */
function ownerInbox() {
  return (process.env.OWNER_EMAIL || process.env.GMAIL_USER || "").trim();
}

async function send({ to, subject, text, html, replyTo, fromName }) {
  if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, text, html, reply_to: replyTo }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return;
  }
  const g = gmail();
  if (!g) throw new Error("Email is not set up");
  const t = nodemailer.createTransport({ service: "gmail", auth: { user: g.user, pass: g.pass } });
  await t.sendMail({ from: `${fromName || "AllBlueZ"} <${g.user}>`, to, subject, text, html, replyTo });
}

module.exports = { ready, send, ownerInbox };
