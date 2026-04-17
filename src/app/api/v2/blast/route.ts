// ── POST /api/v2/blast ───────────────────────────────────────────────────────
// Sends a bulk update email to all active (non-unsubscribed) v1 + v2 subscribers.
//
// Auth: requires `secret` in the request body matching BLAST_SECRET env var.
//
// Body:
//   { secret: string, dryRun?: boolean }
//
// dryRun = true  → returns recipient list + HTML preview, does NOT send.
// dryRun = false → sends via Resend batch API (max 100/call, loops if needed).
//
// Before sending:
//   1. Add BLAST_SECRET to .env.local and Vercel env vars.
//   2. Upload screenshots to /public/email/ (see template.ts for filenames).
//   3. Set VIDEO_URL in template.ts to the actual hosted video link.
//   4. Test with dryRun: true first.
//
// Trigger:
//   curl -X POST https://orblyapp.com/api/v2/blast \
//     -H "Content-Type: application/json" \
//     -d '{"secret":"YOUR_SECRET","dryRun":true}'

import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { buildBlastEmail, VIDEO_URL } from "./template";

// ── Redis setup ──────────────────────────────────────────────────────────────

const KEYS = {
  v2emails:      "orbly:v2:emails",
  v1emails:      "orbly:waitlist:emails",
  user:          (email: string) => `orbly:v2:user:${email}`,
  unsubscribed:  "orbly:v2:unsubscribed",
  unsub:         (token: string) => `orbly:v2:unsub:${token}`,
};

function getRedis(): Redis {
  const url   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis not configured");
  return new Redis({ url, token });
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ResendEmail {
  from:     string;
  to:       string[];
  reply_to: string[];
  subject:  string;
  html:     string;
  text:     string;
  headers:  Record<string, string>;
}

interface RecipientInfo {
  email:      string;
  unsubToken: string;
  source:     "v1" | "v2";
}

// ── Collect recipients ───────────────────────────────────────────────────────

async function collectRecipients(kv: Redis): Promise<RecipientInfo[]> {
  // Fetch email sets + unsubscribed set in parallel
  const [v2raw, v1raw, unsubRaw] = await Promise.all([
    kv.smembers(KEYS.v2emails),
    kv.smembers(KEYS.v1emails).catch(() => []), // v1 key may not exist
    kv.smembers(KEYS.unsubscribed),
  ]);

  const v2emails   = v2raw as string[];
  const v1emails   = (v1raw as string[]).filter((e): e is string => typeof e === "string");
  const unsubSet   = new Set((unsubRaw as string[]).map((e) => e.toLowerCase()));

  const active = [
    ...v2emails.filter((e) => !unsubSet.has(e.toLowerCase())).map((e) => ({ email: e, source: "v2" as const })),
    ...v1emails.filter((e) => !unsubSet.has(e.toLowerCase())).map((e) => ({ email: e, source: "v1" as const })),
  ];

  // Deduplicate (in case an email appears in both v1 and v2)
  const seen = new Set<string>();
  const deduped = active.filter(({ email }) => {
    const key = email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Fetch unsub tokens for each recipient (in parallel, batched)
  const withTokens: RecipientInfo[] = await Promise.all(
    deduped.map(async ({ email, source }) => {
      let unsubToken: string;

      if (source === "v2") {
        const user = await kv.hgetall<{ unsub_token?: string }>(KEYS.user(email));
        unsubToken = user?.unsub_token ?? "";
      } else {
        unsubToken = "";
      }

      // If token is missing (v1 subscribers or edge cases), generate + persist one
      if (!unsubToken) {
        unsubToken = nanoid(16);
        await kv.set(KEYS.unsub(unsubToken), email);
        // Best-effort: also write into user hash if it exists
        await kv.hset(KEYS.user(email), { unsub_token: unsubToken });
      }

      return { email, unsubToken, source };
    })
  );

  return withTokens;
}

// ── Build Resend payload ─────────────────────────────────────────────────────

const SUBJECT = "Orbly nerede şimdi / A progress update";
const FROM    = "Celal <celal@orblyapp.com>";
const REPLY   = "celal@orblyapp.com";
const UNSUB_BASE = "https://orblyapp.com/api/v2/unsubscribe";

function buildPayload(recipient: RecipientInfo): ResendEmail {
  const unsubUrl = `${UNSUB_BASE}?token=${recipient.unsubToken}`;
  const { html, text } = buildBlastEmail({ unsubUrl });

  return {
    from:     FROM,
    to:       [recipient.email],
    reply_to: [REPLY],
    subject:  SUBJECT,
    html,
    text:     text.replace("{UNSUB_URL}", unsubUrl),
    headers: {
      "List-Unsubscribe":      `<${unsubUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

// ── Resend batch send (max 100 per call) ─────────────────────────────────────

async function sendBatch(emails: ResendEmail[]): Promise<{ sent: number; errors: string[] }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");

  const BATCH_SIZE = 100;
  let sent = 0;
  const errors: string[] = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const chunk = emails.slice(i, i + BATCH_SIZE);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });

    if (!res.ok) {
      const err = await res.text();
      errors.push(`Batch ${i}–${i + chunk.length}: ${err}`);
    } else {
      sent += chunk.length;
    }
  }

  return { sent, errors };
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const secret = process.env.BLAST_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "BLAST_SECRET env var not set" }, { status: 500 });
  }
  if (body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun    = body.dryRun === true;
  const testEmail = typeof body.testEmail === "string" ? body.testEmail.trim() : null;

  try {
    // ── Test mode: send only to testEmail ──
    if (testEmail) {
      const { html, text } = buildBlastEmail({
        unsubUrl: "https://orblyapp.com/api/v2/unsubscribe?token=test",
      });
      const key = process.env.RESEND_API_KEY;
      if (!key) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:     FROM,
          to:       [testEmail],
          reply_to: [REPLY],
          subject:  `[TEST] ${SUBJECT}`,
          html,
          text:     text.replace("{UNSUB_URL}", "https://orblyapp.com/api/v2/unsubscribe?token=test"),
        }),
      });
      const result = await res.json();
      return NextResponse.json({ test: true, to: testEmail, result });
    }

    const kv = getRedis();
    const recipients = await collectRecipients(kv);

    if (recipients.length === 0) {
      return NextResponse.json({ message: "No active recipients found.", sent: 0 });
    }

    const payloads = recipients.map(buildPayload);

    // ── Dry run: return preview ──
    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        recipientCount: recipients.length,
        recipients: recipients.map((r) => ({ email: r.email, source: r.source })),
        subject: SUBJECT,
        videoUrl: VIDEO_URL,
        htmlPreview: payloads[0]?.html ?? "",
      });
    }

    // ── Real send ──
    const { sent, errors } = await sendBatch(payloads);

    return NextResponse.json({
      sent,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err) {
    console.error("[v2/blast]", err);
    return NextResponse.json(
      { error: "Internal error", detail: String(err) },
      { status: 500 }
    );
  }
}
