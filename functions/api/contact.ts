interface Env {
  LEADS?: KVNamespace;
}

interface LeadPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  source?: unknown;
  company?: unknown;
}

const CONTACT_TTL_SECONDS = 60 * 60 * 24 * 180;
const MAX_BODY_BYTES = 7_500;
const ALLOWED_ORIGINS = new Set([
  "https://ironlog.co",
  "https://www.ironlog.co",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
]);

const BASE_JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Allow": "POST, OPTIONS",
  "Vary": "Origin",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAllowedOrigin(origin: string | null): boolean {
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function responseHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  return {
    ...BASE_JSON_HEADERS,
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) && origin ? origin : "https://ironlog.co",
  };
}

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(request) });
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
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return json(request, { error: "Origin not allowed" }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json(request, { error: "Request body too large" }, 413);
  }

  if (!env.LEADS) {
    return json(request, { error: "Lead storage unavailable" }, 503);
  }

  let payload: LeadPayload;
  try {
    payload = await readPayload(request);
  } catch {
    return json(request, { error: "Invalid request body" }, 400);
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 254).toLowerCase();
  const message = clean(payload.message, 5000);
  const source = clean(payload.source, 120) || "ironlog.co-contact";
  const honeypot = clean(payload.company, 120);

  if (!name || !EMAIL_RE.test(email) || !message) {
    return json(request, { error: "Missing or invalid required fields" }, 400);
  }

  if (honeypot) {
    return json(request, { success: true });
  }

  const createdAt = new Date().toISOString();
  const key = `ironlog/${createdAt.slice(0, 10)}/${crypto.randomUUID()}`;

  try {
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
      { expirationTtl: CONTACT_TTL_SECONDS },
    );
  } catch {
    return json(request, { error: "Lead storage unavailable" }, 503);
  }

  return json(request, { success: true });
}

export const onRequestOptions: PagesFunction<Env> = ({ request }) =>
  new Response(null, { status: 204, headers: responseHeaders(request) });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) =>
  handleContact(request, env);

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const method = request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: responseHeaders(request) });
  }
  if (method === "POST") {
    return handleContact(request, env);
  }
  return json(request, { error: "Method not allowed", allow: ["POST", "OPTIONS"] }, 405);
};
