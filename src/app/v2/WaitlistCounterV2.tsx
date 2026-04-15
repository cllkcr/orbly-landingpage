"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useV2Signup } from "@/hooks/useV2Signup";

gsap.registerPlugin(ScrollTrigger);

// Threshold below which we frame the low count as exclusive rather than
// social proof. Early adopters are the "first N" — not a small crowd.
const EARLY_ACCESS_THRESHOLD = 25 as const;

type CounterCopy =
  | { kind: "empty" }
  | { kind: "early"; count: number }
  | { kind: "social"; count: number };

function resolveCopy(count: number): CounterCopy {
  if (count <= 0) return { kind: "empty" };
  if (count < EARLY_ACCESS_THRESHOLD) return { kind: "early", count };
  return { kind: "social", count };
}

export default function WaitlistCounterV2() {
  const { count } = useV2Signup();
  const numRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const copy = resolveCopy(count);

  useEffect(() => {
    if (count <= 0) return;
    if (!numRef.current || hasAnimated.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const node = numRef.current;

    // With very small numbers, an animated count-up from 0 draws attention to
    // the smallness. Snap directly to the value instead.
    if (prefersReduced || count < 10) {
      node.textContent = count.toLocaleString();
      hasAnimated.current = true;
      return;
    }

    const proxy = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 95%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(proxy, {
          val: count,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent =
                Math.round(proxy.val).toLocaleString();
            }
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [count]);

  const shadow = {
    textShadow: "0 1px 14px rgba(0,0,0,0.95), 0 0 32px rgba(0,0,0,0.7)",
  };

  const baseClass =
    "text-sm text-[var(--text-secondary)] text-center " +
    "font-[family-name:var(--font-jetbrains)] tracking-wide tabular-nums";

  if (copy.kind === "empty") {
    return (
      <p className={baseClass} style={shadow} aria-live="polite">
        Be the first to reserve your spot
      </p>
    );
  }

  if (copy.kind === "early") {
    return (
      <p className={baseClass} style={shadow}>
        You&apos;re among the first{" "}
        <span
          ref={numRef}
          aria-live="polite"
          className="text-[var(--text-primary)] font-medium"
        >
          {copy.count.toLocaleString()}
        </span>{" "}
        reserving early access
      </p>
    );
  }

  return (
    <p className={baseClass} style={shadow}>
      Join{" "}
      <span
        ref={numRef}
        aria-live="polite"
        className="text-[var(--text-primary)] font-medium"
      >
        0
      </span>{" "}
      people already reserving their spot
    </p>
  );
}
