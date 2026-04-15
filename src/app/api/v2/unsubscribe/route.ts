import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const KEYS = {
  unsub: (token: string) => `orbly:v2:unsub:${token}`,
  unsubscribed: "orbly:v2:unsubscribed",
};

function getRedis() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis not configured");
  return new Redis({ url, token });
}

function html(title: string, message: string, sub: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} · Orbly</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0A0A0F;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{max-width:420px;width:100%;text-align:center}
    h1{font-size:22px;font-weight:700;color:#fff;margin-bottom:12px}
    p{font-size:15px;line-height:1.6;color:#999;margin-bottom:8px}
    a{color:#00D9E6;text-decoration:none}
    a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <div class="card">
    <p style="font-size:28px;margin-bottom:16px;">✓</p>
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:20px;font-size:13px;">${sub}</p>
  </div>
</body>
</html>`;
}

// GET /api/v2/unsubscribe?token=XXX
// One-click unsubscribe — marks the email as unsubscribed in Redis so future
// emails are skipped. Does NOT remove from the waitlist.
export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!token) {
    return new NextResponse(
      html(
        "Invalid link",
        "This unsubscribe link is missing a token.",
        '<a href="https://orblyapp.com">← orblyapp.com</a>'
      ),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const kv = getRedis();
    const email = await kv.get<string>(KEYS.unsub(token));

    if (!email) {
      // Token not found — either already unsubscribed or invalid link
      return new NextResponse(
        html(
          "Already unsubscribed",
          "You're not receiving emails from us.",
          '<a href="https://orblyapp.com">← orblyapp.com</a>'
        ),
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Add to unsubscribed set + delete the token (one-use)
    await Promise.all([
      kv.sadd(KEYS.unsubscribed, email),
      kv.del(KEYS.unsub(token)),
    ]);

    return new NextResponse(
      html(
        "You're unsubscribed",
        "You won't receive any more emails from us. Your spot on the waitlist is still reserved.",
        'Changed your mind? Email <a href="mailto:celal@orblyapp.com">celal@orblyapp.com</a>'
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch {
    return new NextResponse(
      html(
        "Something went wrong",
        "Please try again or email us directly.",
        '<a href="mailto:celal@orblyapp.com">celal@orblyapp.com</a>'
      ),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

// POST — supports one-click List-Unsubscribe-Post (RFC 8058)
// Gmail/Apple Mail hit this automatically when user clicks "Unsubscribe" in the header.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const kv = getRedis();
    const email = await kv.get<string>(KEYS.unsub(token));
    if (!email) return NextResponse.json({ ok: true }); // idempotent

    await Promise.all([
      kv.sadd(KEYS.unsubscribed, email),
      kv.del(KEYS.unsub(token)),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
