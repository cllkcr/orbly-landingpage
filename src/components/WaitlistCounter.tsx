"use client";
// Skills: /react-expert (useSyncExternalStore), /javascript-pro (GSAP counter animation)

import { useWaitlist } from "@/hooks/useWaitlist";

export default function WaitlistCounter() {
  const { count } = useWaitlist();

  return (
    <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)] tracking-wide">
      {count > 0 ? (
        <>
          Join{" "}
          <span className="text-[var(--color-teal)] font-medium tabular-nums">
            {count.toLocaleString()}
          </span>{" "}
          people already waiting
        </>
      ) : (
        "Be the first to join the waitlist"
      )}
    </p>
  );
}
