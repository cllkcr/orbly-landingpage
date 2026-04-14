// Simple reactive store for waitlist state
// Skills: /typescript-pro (discriminated union types), /javascript-pro (event emitter pattern)

type Listener = () => void;

interface WaitlistState {
  count: number;
  email: string;
  submitted: boolean;
  position: number | null;
}

let state: WaitlistState = {
  count: 847,
  email: "",
  submitted: false,
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
  state = { ...state, email };
  emit();
}

export function submitEmail() {
  if (!state.email || state.submitted) return;
  const newCount = state.count + 1;
  state = {
    ...state,
    submitted: true,
    count: newCount,
    position: newCount,
  };
  emit();
}
