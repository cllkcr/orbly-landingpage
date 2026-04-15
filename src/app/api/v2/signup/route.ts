import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import type {
  V2ApiSuccessResponse,
  V2CountResponse,
  ReferralTier,
} from "@/app/v2/types";

const KEYS = {
  count: "orbly:v2:count",
  v1count: "orbly:waitlist:count",
  emails: "orbly:v2:emails",
  entries: "orbly:v2:entries",
  ref: (code: string) => `orbly:v2:ref:${code}`,
  user: (email: string) => `orbly:v2:user:${email}`,
  rate: (ip: string) => `orbly:v2:rate:${ip}`,
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

function computeTier(count: number): ReferralTier {
  if (count >= 10) return "call";
  if (count >= 5) return "badge";
  return "none";
}

// Shared Resend delivery. Silently no-ops when env vars missing, so the
// signup flow still works without email configured. Returns void — callers
// should either await (reliable delivery) or fire-and-forget.
async function sendFounderEmail(params: {
  subject: string;
  html: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.FOUNDER_EMAIL;
  if (!key || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Orbly <notifications@orbly.app>",
      to: [to],
      subject: params.subject,
      html: params.html,
    }),
  }).catch(() => {
    // non-blocking — don't fail signup if email fails
  });
}

// Fires on every fresh reservation — NOT on duplicates, so re-submits don't
// spam the inbox. Called fire-and-forget via void so signup latency is not
// tied to Resend response time.
async function notifyNewSignup(params: {
  email: string;
  position: number;
  totalCount: number;
  referredBy: string | null;
}): Promise<void> {
  const { email, position, totalCount, referredBy } = params;
  const sourceLine = referredBy
    ? `<p><strong>Source:</strong> referral — code <code>${referredBy}</code></p>`
    : `<p><strong>Source:</strong> direct</p>`;
  await sendFounderEmail({
    subject: `Orbly — new signup #${position}: ${email}`,
    html: `
      <p><strong>${email}</strong> just reserved a spot on the waitlist.</p>
      <p><strong>Position:</strong> #${position}</p>
      <p><strong>Total waitlist:</strong> ${totalCount.toLocaleString()}</p>
      ${sourceLine}
      <p style="color:#888;font-size:12px;margin-top:16px">${new Date().toISOString()}</p>
    `,
  });
}

// Sends a personal welcome email to the person who just joined.
// Plain-text-style HTML so it reads like a real founder email, not a
// marketing blast. Includes referral link + one-click unsubscribe.
async function sendWelcomeEmail(params: {
  email: string;
  position: number;
  referralCode: string;
  unsubToken: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const { email, position, referralCode, unsubToken } = params;
  const referralUrl = `https://orbly.app/?ref=${referralCode}`;
  const unsubUrl = `https://orbly.app/api/v2/unsubscribe?token=${unsubToken}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:32px;">
          <span style="font-size:22px;font-weight:700;color:#0A0A0F;letter-spacing:-0.5px;">Orbly</span>
        </td></tr>
        <tr><td style="color:#1a1a1a;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 16px;">Hey,</p>
          <p style="margin:0 0 16px;">You made it. You're <strong style="color:#0A0A0F;">#${position}</strong> on the Orbly waitlist.</p>
          <p style="margin:0 0 16px;">I'm still very early in this, but that's exactly why having you here means a lot to me.</p>
          <p style="margin:0 0 8px;font-weight:600;color:#0A0A0F;">Here's what you've locked in:</p>
          <p style="margin:0 0 16px;">Free during beta. When Orbly launches publicly, your founding price is yours forever. No matter what we charge everyone else, no matter how long it takes.</p>
          <p style="margin:0 0 12px;">Want to move up the list? Share your link with people you think would genuinely find this useful:</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%;">
            <tr><td style="padding:12px 16px;background:#f5f5f7;border-radius:8px;font-size:15px;line-height:1.8;">
              Refer 2 friends → Jump 50 spots<br>
              Refer 5 friends → 3 extra months free on top of beta<br>
              Refer 10 friends → Your subscription stays at founding price forever
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-weight:600;color:#0A0A0F;">Your referral link:</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
            <tr><td style="padding:10px 18px;background:#0A0A0F;border-radius:8px;">
              <a href="${referralUrl}" style="color:#00D9E6;font-family:monospace;font-size:14px;text-decoration:none;word-break:break-all;">${referralUrl}</a>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;">Every friend you refer also gets founding pricing, so you're not just helping yourself.</p>
          <p style="margin:0 0 16px;">I'll be dropping into your inbox every now and then to share what's going on behind the scenes. What's working, what's not, what's coming next. You'll hear it before anyone else.</p>
          <p style="margin:0 0 24px;">Not a bad deal, right? :)</p>
          <p style="margin:0 0 4px;">Love,</p>
          <p style="margin:0 0 40px;font-weight:600;">Celal</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:0 0 20px;">
          <p style="margin:0;font-size:12px;color:#999;line-height:1.6;">
            No spam. <a href="${unsubUrl}" style="color:#999;text-decoration:underline;">Unsubscribe anytime.</a><br>
            Orbly · orbly.app
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Hey,

You made it. You're #${position} on the Orbly waitlist.

I'm still very early in this, but that's exactly why having you here means a lot to me.

Here's what you've locked in:
Free during beta. When Orbly launches publicly, your founding price is yours forever. No matter what we charge everyone else, no matter how long it takes.

Want to move up the list? Share your link with people you think would genuinely find this useful:

Refer 2 friends → Jump 50 spots
Refer 5 friends → 3 extra months free on top of beta
Refer 10 friends → Your subscription stays at founding price forever

Your referral link: ${referralUrl}

Every friend you refer also gets founding pricing, so you're not just helping yourself.

I'll be dropping into your inbox every now and then to share what's going on behind the scenes. What's working, what's not, what's coming next. You'll hear it before anyone else.

Not a bad deal, right? :)

Love,
Celal

---
No spam. Unsubscribe anytime: ${unsubUrl}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Celal from Orbly <celal@orblyapp.com>",
      to: [email],
      reply_to: ["celal@orblyapp.com"],
      subject: `You're #${position} on the Orbly waitlist`,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  }).catch(() => {
    // non-blocking — don't fail signup if welcome email fails
  });
}

// Fires when a referrer first hits the 10-friend tier. Separate from
// notifyNewSignup because this is a rarer, higher-signal event.
async function notifyFounderTier(referrerEmail: string): Promise<void> {
  await sendFounderEmail({
    subject: "Orbly — new founding member (10 referrals)",
    html: `<p><strong>${referrerEmail}</strong> just reached 10 referrals and earned a one-on-one onboarding call.</p>`,
  });
}

// GET — return combined v1 + v2 real waitlist count
export async function GET(): Promise<NextResponse<V2CountResponse>> {
  try {
    const kv = getRedis();
    const [v1, v2] = await Promise.all([
      kv.get<number>(KEYS.v1count),
      kv.get<number>(KEYS.count),
    ]);
    return NextResponse.json({ count: (v1 ?? 0) + (v2 ?? 0) });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

// POST — add email to v2 waitlist with optional referral
export async function POST(
  req: NextRequest
): Promise<NextResponse<V2ApiSuccessResponse | { error: string }>> {
  try {
    const kv = getRedis();
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Rate limit: 5 per IP per minute
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateKey = KEYS.rate(ip);
    const attempts = await kv.incr(rateKey);
    if (attempts === 1) await kv.expire(rateKey, 60);
    if (attempts > 5) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429 }
      );
    }

    // Check duplicate
    const exists = await kv.sismember(KEYS.emails, email);
    if (exists) {
      const userData = await kv.hgetall<{
        code: string;
        count: string;
        tier: ReferralTier;
        position: string;
      }>(KEYS.user(email));
      const [v1, v2] = await Promise.all([
        kv.get<number>(KEYS.v1count),
        kv.get<number>(KEYS.count),
      ]);
      return NextResponse.json({
        position: userData?.position ? Number(userData.position) : 1,
        referralCode: userData?.code ?? "",
        referralCount: userData?.count ? Number(userData.count) : 0,
        tier: userData?.tier ?? "none",
        count: (v1 ?? 0) + (v2 ?? 0),
        duplicate: true,
      });
    }

    // Add email + generate position
    await kv.sadd(KEYS.emails, email);
    const position = await kv.incr(KEYS.count);
    const referralCode = nanoid(8);

    // Store in sorted set (score = position)
    await kv.zadd(KEYS.entries, { score: position, member: email });
    // Map code → email
    await kv.set(KEYS.ref(referralCode), email);
    // User hash — full schema
    const refCode = req.nextUrl.searchParams.get("ref");
    const unsubToken = nanoid(16);
    await kv.hset(KEYS.user(email), {
      id: nanoid(12),
      code: referralCode,
      referred_by: refCode ?? "",
      count: 0,
      tier: "none" as ReferralTier,
      position: String(position),
      created_at: new Date().toISOString(),
      unsub_token: unsubToken,
    });
    // Map token → email for one-click unsubscribe lookups
    await kv.set(KEYS.unsub(unsubToken), email);

    // Handle referral bonus
    if (refCode) {
      const referrerEmail = await kv.get<string>(KEYS.ref(refCode));
      if (referrerEmail && referrerEmail !== email) {
        // Increment referrer count and update tier
        const newRefCount = await kv.hincrby(KEYS.user(referrerEmail), "count", 1);
        const newTier = computeTier(newRefCount);
        const prevTier = computeTier(newRefCount - 1);
        await kv.hset(KEYS.user(referrerEmail), { tier: newTier });
        // Move referrer up 50 spots (lower score = higher position)
        await kv.zincrby(KEYS.entries, -50, referrerEmail);
        // Double-sided reward: new user gets -10 bonus
        await kv.zincrby(KEYS.entries, -10, email);
        // Notify founder when referrer first reaches 'call' tier. Fire-and-
        // forget — signup latency should not depend on Resend.
        if (newTier === "call" && prevTier !== "call") {
          void notifyFounderTier(referrerEmail);
        }
      }
    }

    // Fresh combined count after all ops
    const [v1Final, v2Final] = await Promise.all([
      kv.get<number>(KEYS.v1count),
      kv.get<number>(KEYS.count),
    ]);
    const totalCount = (v1Final ?? 0) + (v2Final ?? 0);

    // Fire both emails concurrently. Both are fire-and-forget so signup
    // response latency is not tied to Resend. Welcome email goes to the user,
    // notify email goes to the founder.
    void notifyNewSignup({
      email,
      position,
      totalCount,
      referredBy: refCode,
    });
    void sendWelcomeEmail({
      email,
      position,
      referralCode,
      unsubToken,
    });

    return NextResponse.json({
      position,
      referralCode,
      referralCount: 0,
      tier: "none",
      count: totalCount,
    });
  } catch (err) {
    console.error("[v2/signup] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
