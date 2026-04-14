import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const SEED_COUNT = 0;
const KEYS = {
  emails: "orbly:waitlist:emails",
  count: "orbly:waitlist:count",
  entries: "orbly:waitlist:entries",
};

// GET — return current waitlist count
export async function GET() {
  try {
    let count = await kv.get<number>(KEYS.count);
    if (count === null) {
      // Seed on first request
      await kv.set(KEYS.count, SEED_COUNT);
      count = SEED_COUNT;
    }
    return NextResponse.json({ count });
  } catch {
    // Fallback if KV not configured (local dev)
    return NextResponse.json({ count: SEED_COUNT });
  }
}

// POST — add email to waitlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Rate limit: 5 submissions per IP per minute
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const rateKey = `orbly:rate:${ip}`;
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
      const position = await kv.zscore(KEYS.entries, email);
      const count = (await kv.get<number>(KEYS.count)) || SEED_COUNT;
      return NextResponse.json({ position: Number(position), count, duplicate: true });
    }

    // Add to set + sorted set + increment counter
    await kv.sadd(KEYS.emails, email);

    // Ensure count is seeded
    let count = await kv.get<number>(KEYS.count);
    if (count === null) {
      await kv.set(KEYS.count, SEED_COUNT);
    }

    const newCount = await kv.incr(KEYS.count);
    await kv.zadd(KEYS.entries, { score: newCount, member: email });

    return NextResponse.json({ position: newCount, count: newCount });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
