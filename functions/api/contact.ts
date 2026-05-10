interface Env {
  LEADS?: KVNamespace;
}

interface LeadPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
}

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Allow": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function readPayload(request: Request): Promise<LeadPayload> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as LeadPayload;
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries()) as LeadPayload;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (!env.LEADS) {
    return json({ error: "Lead storage unavailable" }, 503);
  }

  let payload: LeadPayload;
  try {
    payload = await readPayload(request);
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 254).toLowerCase();
  const message = clean(payload.message, 5000);
  const source = clean(payload.source, 120) || "ironlog.co-contact";

  if (!name || !EMAIL_RE.test(email) || !message) {
    return json({ error: "Missing or invalid required fields" }, 400);
  }

  const createdAt = new Date().toISOString();
  const key = `ironlog/${createdAt.slice(0, 10)}/${crypto.randomUUID()}`;

  await env.LEADS.put(
    key,
    JSON.stringify({
      site: "ironlog.co",
      app: "IronLog",
      type: "contact",
      name,
      email,
      message,
      source,
      created_at: createdAt,
      ua: request.headers.get("user-agent") || null,
    }),
  );

  return json({ success: true, key });
}

export const onRequestOptions: PagesFunction<Env> = () =>
  new Response(null, { status: 204, headers: JSON_HEADERS });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) =>
  handleContact(request, env);

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const method = request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }
  if (method === "POST") {
    return handleContact(request, env);
  }
  return json({ error: "Method not allowed", allow: ["POST", "OPTIONS"] }, 405);
};
