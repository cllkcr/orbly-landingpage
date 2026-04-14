"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import {
  getWaitlistState,
  subscribe,
  setEmail,
  submitEmail,
  fetchCount,
} from "@/lib/store";

interface UseWaitlistReturn {
  count: number;
  email: string;
  submitted: boolean;
  loading: boolean;
  error: string | null;
  position: number | null;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useWaitlist(): UseWaitlistReturn {
  const state = useSyncExternalStore(subscribe, getWaitlistState, getWaitlistState);

  // fetchCount is deduplicated in the store — safe to call from every consumer
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
