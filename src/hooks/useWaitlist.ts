"use client";
// Skills: /react-expert (useSyncExternalStore), /typescript-pro (type inference)

import { useSyncExternalStore, useCallback } from "react";
import {
  getWaitlistState,
  subscribe,
  setEmail,
  submitEmail,
} from "@/lib/store";

export function useWaitlist() {
  const state = useSyncExternalStore(subscribe, getWaitlistState, getWaitlistState);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (state.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        submitEmail();
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
