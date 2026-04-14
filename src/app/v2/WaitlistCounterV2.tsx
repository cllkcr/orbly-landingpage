"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useV2Signup } from "@/hooks/useV2Signup";

gsap.registerPlugin(ScrollTrigger);

export default function WaitlistCounterV2() {
  const { count } = useV2Signup();
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!numRef.current || hasAnimated.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const proxy = { val: 0 };
    ScrollTrigger.create({
      trigger: numRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(proxy, {
          val: count,
          duration: prefersReduced ? 0 : 2,
          ease: "power2.out",
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = Math.round(proxy.val).toLocaleString();
            }
          },
        });
      },
    });
  }, [count]);

  if (count === 0) {
    return (
      <p
        className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)]
          tracking-wide tabular-nums"
      >
        Be the first to join the waitlist
      </p>
    );
  }

  return (
    <p
      className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)]
        tracking-wide tabular-nums"
    >
      Join{" "}
      <span
        ref={numRef}
        aria-live="polite"
        className="text-[var(--text-primary)] font-medium"
      >
        0
      </span>{" "}
      people already on the waitlist
    </p>
  );
}
