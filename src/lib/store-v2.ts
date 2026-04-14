// ── v2 Waitlist Store ────────────────────────────────────────
// Isolated module-level singleton — no state bleed from v1 store.
// Redis namespace: orbly:v2:*

import type {
  SignupState,
  V2ApiSuccessResponse,
  V2CountResponse,
  WAITLIST_SEED,
} from "@/app/v2/types";

// Silence unused import lint — WAITLIST_SEED is used as fallback value
const SEED = 847 as typeof WAITLIST_SEED;

type Listener = () => void;

interface V2StoreState {
  signup: SignupState;
  email: string;
  count: number;
}

let state: V2StoreState = {
  signup: { status: "idle" },
  email: "",
  count: SEED,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getV2State(): Readonly<V2StoreState> {
  return state;
}

export function subscribeV2(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setV2Email(email: string) {
  state = { ...state, email };
  emit();
}

// Deduplication — only one in-flight fetch
let fetchDone = false;
let fetchInProgress = false;

export async function fetchV2Count() {
  if (fetchDone || fetchInProgress) return;
  fetchInProgress = true;
  try {
    const res = await fetch("/api/v2/signup");
    if (res.ok) {
      const data = (await res.json()) as V2CountResponse;
      state = { ...state, count: data.count };
      emit();
      fetchDone = true;
    }
  } catch {
    // Keep seed count on error
  } finally {
    fetchInProgress = false;
  }
}

export async function submitV2Email(
  email: string,
  refCode?: string
): Promise<boolean> {
  const currentState = state.signup;
  if (
    !email ||
    currentState.status === "loading" ||
    currentState.status === "success"
  )
    return false;

  state = { ...state, signup: { status: "loading" } };
  emit();

  try {
    const url = refCode
      ? `/api/v2/signup?ref=${encodeURIComponent(refCode)}`
      : "/api/v2/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await res.json()) as
      | V2ApiSuccessResponse
      | { error: string };

    if (!res.ok || "error" in data) {
      const errMsg =
        "error" in data ? data.error : "Something went wrong. Please try again.";
      state = { ...state, signup: { status: "error", message: errMsg } };
      emit();
      return false;
    }

    const success = data as V2ApiSuccessResponse;
    state = {
      ...state,
      signup: {
        status: "success",
        position: success.position,
        referralCode: success.referralCode,
        referralCount: success.referralCount,
        tier: success.tier,
        count: success.count,
      },
      count: success.count,
    };
    emit();
    return true;
  } catch {
    state = {
      ...state,
      signup: { status: "error", message: "Network error. Please try again." },
    };
    emit();
    return false;
  }
}
