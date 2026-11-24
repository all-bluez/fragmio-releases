// The Fragmio email look, shared by every email the website sends (invite code, feedback).
// Built the way email apps need it: tables and inline styles, no web fonts, a solid colour behind every gradient
// (Outlook and Gmail drop some styles), and readable in dark mode apps that recolour emails.
const BERRY = "#d6336c";
const VIOLET = "#7048e8";
const INK = "#1c2126";
const MUTED = "#5f6b76";
const LINE = "#e7e3ea";
const SOFT = "#fbf3f7";

const site = () => (process.env.SITE_URL || "https://fragmio.vercel.app").replace(/\/+$/, "");
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** A big, rounded button (works in Outlook too). */
function button(text, href, color = BERRY) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
<tr><td align="center" bgcolor="${color}" style="border-radius:12px;background:${color};background-image:linear-gradient(135deg,${BERRY},${VIOLET})">
<a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:12px">${esc(text)}</a>
</td></tr></table>`;
}

/** A label in a coloured pill (e.g. "Idea"). */
function pill(text, color) {
  return `<span style="display:inline-block;padding:5px 12px;border-radius:99px;background:${color};color:#ffffff;font-size:12px;font-weight:700;letter-spacing:.3px">${esc(text)}</span>`;
}

/**
 * The whole email: header with the logo, a white card with the content, and a small footer.
 *   preheader  the grey line email apps show next to the subject
 *   body       HTML for inside the card
 */
function layout({ title, preheader, body, footer }) {
  const logo = `${site()}/logo.png`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(title)}</title>
<style>
  @media (max-width:600px){ .card{padding:28px 22px!important} .h1{font-size:22px!important} }
  @media (prefers-color-scheme:dark){
    .bg{background:#111417!important} .card{background:#1b1f24!important;border-color:#2a3038!important}
    .ink{color:#eef1f4!important} .muted{color:#a4afba!important} .box{background:#24292f!important;border-color:#343b44!important}
  }
</style></head>
<body style="margin:0;padding:0;background:#f4f1f5">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader || "")}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg" style="background:#f4f1f5">
<tr><td align="center" style="padding:28px 14px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px">
    <tr><td style="padding:0 4px 18px">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
        <td style="padding-right:10px"><img src="${logo}" width="34" height="34" alt="" style="display:block;border:0;border-radius:8px"></td>
        <td class="ink" style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:19px;font-weight:800;color:${INK};letter-spacing:-.2px">Fragmio</td>
      </tr></table>
    </td></tr>
    <tr><td height="4" bgcolor="${BERRY}" style="height:4px;line-height:4px;font-size:0;border-radius:12px 12px 0 0;background:${BERRY};background-image:linear-gradient(90deg,${BERRY},${VIOLET})">&nbsp;</td></tr>
    <tr><td class="card" style="background:#ffffff;border:1px solid ${LINE};border-top:0;border-radius:0 0 16px 16px;padding:36px 36px 32px;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:15.5px;line-height:1.6;color:${INK}">
      ${body}
    </td></tr>
    <tr><td class="muted" style="padding:20px 8px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12.5px;line-height:1.6;color:${MUTED};text-align:center">
      ${footer || `Fragmio turns one long video into many short clips, on your own PC.<br><a href="${site()}" style="color:${MUTED}">${esc(site().replace(/^https?:\/\//, ""))}</a> · made by ZAK, allbluez.`}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const h1 = (text) => `<h1 class="ink h1" style="margin:0 0 10px;font-size:25px;line-height:1.25;font-weight:800;color:${INK}">${esc(text)}</h1>`;
const p = (html, extra = "") => `<p class="muted" style="margin:0 0 16px;color:${MUTED};${extra}">${html}</p>`;

module.exports = { layout, button, pill, h1, p, esc, site, colors: { BERRY, VIOLET, INK, MUTED, LINE, SOFT } };
