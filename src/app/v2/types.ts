// ── v2 Type System ─────────────────────────────────────────
// Discriminated unions for all v2 state. No runtime code.

export type ReferralTier = "none" | "badge" | "call";

export const WAITLIST_SEED = 847;

// Discriminated union — exhaustive narrowing, no boolean flags
export type SignupState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      position: number;
      referralCode: string;
      referralCount: number;
      tier: ReferralTier;
      count: number;
    }
  | { status: "error"; message: string };

// API response contracts
export interface V2ApiSuccessResponse {
  position: number;
  referralCode: string;
  referralCount: number;
  tier: ReferralTier;
  count: number;
  duplicate?: boolean;
}

export interface V2ApiErrorResponse {
  error: string;
}

export interface V2CountResponse {
  count: number;
}

export interface V2PositionResponse {
  position: number;
  referralCount: number;
  tier: ReferralTier;
  referralCode: string;
}
