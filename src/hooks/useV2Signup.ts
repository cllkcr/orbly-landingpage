"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import {
  subscribeV2,
  getV2State,
  setV2Email,
  fetchV2Count,
  submitV2Email,
} from "@/lib/store-v2";

export interface UseV2SignupReturn {
  state: ReturnType<typeof getV2State>["signup"];
  email: string;
  count: number;
  setEmail: (v: string) => void;
  handleSubmit: (
    e: React.FormEvent,
    initialRef?: string
  ) => Promise<void>;
}

export function useV2Signup(): UseV2SignupReturn {
  const store = useSyncExternalStore(subscribeV2, getV2State, getV2State);

  // Fetch live count once on mount (deduplicated in store)
  useEffect(() => {
    fetchV2Count();
  }, []);

  const setEmail = useCallback((v: string) => setV2Email(v), []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, initialRef?: string) => {
      e.preventDefault();
      const { email } = getV2State();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      await submitV2Email(email, initialRef);
    },
    []
  );

  return {
    state: store.signup,
    email: store.email,
    count: store.count,
    setEmail,
    handleSubmit,
  };
}
