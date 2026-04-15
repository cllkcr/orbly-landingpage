import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import type { V2PositionResponse, ReferralTier } from "@/app/v2/types";

function getRedis() {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis not configured");
  return new Redis({ url, token });
}

// GET /api/v2/position?code=ABC12345
export async function GET(
  req: NextRequest
): Promise<NextResponse<V2PositionResponse | { error: string }>> {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const kv = getRedis();

    // Look up email from referral code
    const email = await kv.get<string>(`orbly:v2:ref:${code}`);
    if (!email) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }

    // True list rank (0-indexed ascending), convert to 1-indexed position
    const [rank, userData] = await Promise.all([
      kv.zrank("orbly:v2:entries", email),
      kv.hgetall<{
        code: string;
        count: string;
        tier: ReferralTier;
        position: string;
      }>(`orbly:v2:user:${email}`),
    ]);

    return NextResponse.json({
      position: rank !== null ? rank + 1 : Number(userData?.position ?? 0),
      referralCount: userData?.count ? Number(userData.count) : 0,
      tier: userData?.tier ?? "none",
      referralCode: code,
    });
  } catch (err) {
    console.error("[v2/position] error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
