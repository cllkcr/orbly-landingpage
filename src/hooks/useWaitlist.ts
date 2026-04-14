"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import {
  getWaitlistState,
  subscribe,
  setEmail,
  submitEmail,
  fetchCount,
} from "@/lib/store";

export function useWaitlist() {
  const state = useSyncExternalStore(subscribe, getWaitlistState, getWaitlistState);

  // Fetch live count on mount
  useEffect(() => {
    fetchCount();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (state.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        await submitEmail();
      }
    },
    [state.email]
  );

  return {
    ...state,
    setEmail,
    handleSubmit,
  };
}
