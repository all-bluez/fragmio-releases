// Makes Fragmio invite codes on the server, exactly like `npm run invite` does on your PC.
//   INVITE_PRIVATE_KEY  the whole text of ~/.fragmio-keys/invite-ed25519-private.pem (Vercel setting, secret)
const { createPrivateKey, sign } = require("crypto");

const b64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function key() {
  let pem = (process.env.INVITE_PRIVATE_KEY || "").trim();
  if (!pem) return null;
  // However it was pasted (with its lines, as one line, with \n, or only the middle part): keep just the key itself.
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----(BEGIN|END) [A-Z ]*PRIVATE KEY-----/g, "")
    .replace(/[^A-Za-z0-9+/=]/g, "");
  if (!body) return null;
  pem = `-----BEGIN PRIVATE KEY-----\n${body.match(/.{1,64}/g).join("\n")}\n-----END PRIVATE KEY-----\n`;
  try {
    return createPrivateKey(pem);
  } catch {
    return null;
  }
}

function ready() {
  return !!key();
}

/** A beta code for this email. days = how long it works (0 = no expiry). */
function makeCode(email, name, days) {
  const k = key();
  if (!k) throw new Error("INVITE_PRIVATE_KEY is missing or wrong");
  const expires = days > 0 ? new Date(Date.now() + days * 86400000).toISOString().slice(0, 10) : null;
  const payload = { k: "beta", n: String(name).slice(0, 60), e: email, i: new Date().toISOString().slice(0, 10), x: expires };
  const data = b64url(Buffer.from(JSON.stringify(payload)));
  return { code: `FRAGMIO-${data}.${b64url(sign(null, Buffer.from(data), k))}`, expires };
}

module.exports = { ready, makeCode };
