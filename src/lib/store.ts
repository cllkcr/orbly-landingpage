type Listener = () => void;

interface WaitlistState {
  count: number;
  email: string;
  submitted: boolean;
  loading: boolean;
  error: string | null;
  position: number | null;
}

let state: WaitlistState = {
  count: 0,
  email: "",
  submitted: false,
  loading: false,
  error: null,
  position: null,
};

const listeners = new Set<Listener>();

export function getWaitlistState(): Readonly<WaitlistState> {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function setEmail(email: string) {
  state = { ...state, email, error: null };
  emit();
}

// Fetch live count from API on page load
export async function fetchCount() {
  try {
    const res = await fetch("/api/waitlist");
    if (res.ok) {
      const data = await res.json();
      state = { ...state, count: data.count };
      emit();
    }
  } catch {
    // Silently keep default count
  }
}

// Submit email to API
export async function submitEmail(): Promise<boolean> {
  if (!state.email || state.submitted || state.loading) return false;

  state = { ...state, loading: true, error: null };
  emit();

  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: state.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      state = { ...state, loading: false, error: data.error || "Something went wrong." };
      emit();
      return false;
    }

    state = {
      ...state,
      submitted: true,
      loading: false,
      count: data.count,
      position: data.position,
      error: null,
    };
    emit();
    return true;
  } catch {
    state = { ...state, loading: false, error: "Network error. Please try again." };
    emit();
    return false;
  }
}
