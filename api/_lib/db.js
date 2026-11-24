// Talks to Supabase from the server only, with the secret service key (Vercel settings, never in files).
//   SUPABASE_URL          e.g. https://abcd.supabase.co
//   SUPABASE_SERVICE_KEY  Project Settings → API → service_role (secret)
function cfg() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_KEY || "";
  return url && key ? { url, key } : null;
}

async function rest(path, { method = "GET", body, prefer } = {}) {
  const c = cfg();
  if (!c) throw new Error("Supabase is not set up");
  const res = await fetch(`${c.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: c.key,
      Authorization: `Bearer ${c.key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

const q = encodeURIComponent;
module.exports = {
  ready: () => !!cfg(),
  rest,
  select: (table, query) => rest(`${table}?${query}`),
  insert: (table, row) => rest(table, { method: "POST", body: row, prefer: "return=representation" }).then((r) => r && r[0]),
  update: (table, query, patch) => rest(`${table}?${query}`, { method: "PATCH", body: patch, prefer: "return=representation" }).then((r) => r && r[0]),
  eq: (v) => `eq.${q(v)}`,
};
