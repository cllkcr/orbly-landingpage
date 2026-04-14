import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import type {
  V2ApiSuccessResponse,
  V2CountResponse,
  ReferralTier,
} from "@/app/v2/types";

const SEED = 847;

const KEYS = {
  count: "orbly:v2:count",
  emails: "orbly:v2:emails",
  entries: "orbly:v2:entries",
  ref: (code: string) => `orbly:v2:ref:${code}`,
  user: (email: string) => `orbly:v2:user:${email}`,
  rate: (ip: string) => `orbly:v2:rate:${ip}`,
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

// GET — return current v2 waitlist count
export async function GET(): Promise<NextResponse<V2CountResponse>> {
  try {
    const kv = getRedis();
    const raw = await kv.get<number>(KEYS.count);
    const count = raw ?? SEED;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: SEED });
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
      const currentCount = await kv.get<number>(KEYS.count);
      const position = userData?.position
        ? Number(userData.position)
        : SEED + 1;
      return NextResponse.json({
        position,
        referralCode: userData?.code ?? "",
        referralCount: userData?.count ? Number(userData.count) : 0,
        tier: userData?.tier ?? "none",
        count: currentCount ?? SEED,
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
    // User hash
    await kv.hset(KEYS.user(email), {
      code: referralCode,
      count: 0,
      tier: "none" as ReferralTier,
      position: String(position),
    });

    // Handle referral bonus
    const refCode = req.nextUrl.searchParams.get("ref");
    if (refCode) {
      const referrerEmail = await kv.get<string>(KEYS.ref(refCode));
      if (referrerEmail && referrerEmail !== email) {
        // Increment referrer count
        const newRefCount = await kv.hincrby(KEYS.user(referrerEmail), "count", 1);
        const newTier = computeTier(newRefCount);
        await kv.hset(KEYS.user(referrerEmail), { tier: newTier });
        // Move referrer up 50 spots (lower score = higher position)
        await kv.zincrby(KEYS.entries, -50, referrerEmail);
        // Double-sided reward: new user gets -10 bonus
        await kv.zincrby(KEYS.entries, -10, email);
      }
    }

    // Fresh count after all ops
    const finalCount = await kv.get<number>(KEYS.count);

    return NextResponse.json({
      position,
      referralCode,
      referralCount: 0,
      tier: "none",
      count: finalCount ?? position,
    });
  } catch (err) {
    console.error("[v2/signup] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
