"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useV2Signup } from "@/hooks/useV2Signup";
import type { ReferralTier } from "./types";

// Milestones drive both the copy and the progress-highlight logic.
// `tier` maps to server-returned ReferralTier so we can light up the current
// reward even if count state and tier state are momentarily out of sync.
const MILESTONES: ReadonlyArray<{
  count: number;
  reward: string;
  tier: ReferralTier | null;
}> = [
  { count: 2, reward: "Jump 50 spots", tier: null },
  {
    count: 5,
    reward: "3 extra months free on top of beta",
    tier: "badge",
  },
  {
    count: 10,
    reward:
      "Your subscription stays at founding price forever \u2014 no matter what Orbly costs publicly.",
    tier: "call",
  },
];

interface ReferralCardProps {
  /**
   * When true, move keyboard focus to the Copy button once the entry animation
   * settles. Pass `true` only from the form instance that caused the submit,
   * so parallel instances (Hero + FinalCTA) don't fight for focus.
   */
  autoFocus?: boolean;
  id?: string;
}

export default function ReferralCard({
  autoFocus = false,
  id,
}: ReferralCardProps): ReactNode {
  const { state } = useV2Signup();
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();

  const isSuccess = state.status === "success";
  const referralCode = isSuccess ? state.referralCode : "";

  const shareUrl = `https://orblyapp.com/?ref=${referralCode}`;
  const shareText = `I just joined the Orbly waitlist — the first calendar you can feel. Check it out:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = useCallback(async () => {
    const payload = `${shareText} ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Legacy fallback for older Safari / non-secure contexts
      const input = document.createElement("input");
      input.value = payload;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareText, shareUrl]);

  // Move focus to Copy CTA after entry animation settles. preventScroll is
  // critical — the parent form already scrolled this into view; we don't want
  // the browser re-scrolling a second time.
  useEffect(() => {
    if (!autoFocus || !isSuccess) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timer = setTimeout(
      () => copyRef.current?.focus({ preventScroll: true }),
      prefersReduced ? 80 : 650
    );
    return () => clearTimeout(timer);
  }, [autoFocus, isSuccess]);

  if (!isSuccess) return null;

  const { position, referralCount, tier } = state;

  return (
    <motion.div
      id={id}
      role="status"
      aria-labelledby={labelId}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="relative w-full max-w-md mx-auto p-5 md:p-6 rounded-2xl
        bg-[var(--bg-dark-elevated)]/80 border border-[var(--color-teal)]/25
        backdrop-blur-md text-center
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* Position — inline header. One line instead of stacked. */}
      <p
        id={labelId}
        aria-live="polite"
        className="flex items-baseline justify-center gap-2 mb-3"
      >
        <span
          className="font-[family-name:var(--font-jetbrains)]
            text-[1.75rem] md:text-3xl font-bold text-[var(--text-primary)]
            tabular-nums leading-none"
        >
          #{position.toLocaleString()}
        </span>
        <span className="text-[13px] text-[var(--text-secondary)] font-[family-name:var(--font-inter)]">
          on the Orbly waitlist
        </span>
      </p>

      {/* Single tagline — replaces the two uppercase labels. Short enough to
          fit on one line at 375px so "LINE." doesn't orphan-wrap. */}
      <p
        className="text-[10px] font-[family-name:var(--font-jetbrains)]
          text-[var(--text-secondary)] tracking-[0.16em] uppercase mb-3"
      >
        You both jump the line
      </p>

      {/* Milestones — two-column grid. Left column is a fixed-width label
          ("N friends") so counts stay aligned across rows; right column is
          the reward. Unreached rows have no frame; reached rows get a teal
          tint + teal count + primary reward. Explicit "friends" label kills
          the ambiguity of a naked numeral. */}
      <ol
        className="space-y-1 text-left mb-4"
        aria-label="Referral milestones"
      >
        {MILESTONES.map((m) => {
          const isReached =
            referralCount >= m.count ||
            (m.tier === "badge" && (tier === "badge" || tier === "call")) ||
            (m.tier === "call" && tier === "call");
          const friendsLabel = m.count === 1 ? "friend" : "friends";
          return (
            <li
              key={m.count}
              className={`grid grid-cols-[5.75rem_1fr] items-start gap-3 py-1.5 px-2 rounded-lg transition-colors ${
                isReached ? "bg-[var(--color-teal)]/[0.10]" : ""
              }`}
            >
              <span
                className={`inline-flex items-center justify-center self-start w-full
                  rounded-full border px-2 py-[3px] whitespace-nowrap transition-colors
                  font-[family-name:var(--font-jetbrains)] text-[10.5px] font-semibold
                  tabular-nums tracking-[0.04em] ${
                    isReached
                      ? "bg-[var(--color-teal)]/[0.18] border-[var(--color-teal)]/40 text-[var(--color-teal)]"
                      : "bg-white/[0.04] border-white/[0.08] text-[var(--text-secondary)]"
                  }`}
              >
                {m.count} {friendsLabel}
              </span>
              <span
                className={`text-[12.5px] leading-[1.38] font-[family-name:var(--font-inter)] ${
                  isReached
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {m.reward}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Share buttons — always side-by-side (grid-cols-2), no mobile stack.
          Twitter is navigation (anchor), Copy is an action (button). */}
      <div className="grid grid-cols-2 gap-2">
        <motion.a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08]
            text-[13px] text-[var(--text-primary)] hover:bg-white/[0.10]
            transition-colors inline-flex items-center justify-center gap-1.5
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[var(--color-teal)]/50"
          style={{ minHeight: "44px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </motion.a>
        <motion.button
          ref={copyRef}
          type="button"
          onClick={handleCopy}
          aria-label="Copy referral link to clipboard"
          className="px-3 py-2.5 rounded-xl
            bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-green)]
            text-[var(--bg-dark)] font-medium text-[13px]
            hover:shadow-[0_0_24px_rgba(0,217,230,0.3)] cursor-pointer
            transition-shadow inline-flex items-center justify-center gap-1.5
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[var(--color-teal)]/60"
          style={{ minHeight: "44px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                ✓ Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
              >
                Copy link
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Compact confirmation footer — one sentence. */}
      <p
        className="mt-3 text-[11px] text-[var(--text-secondary)]/80
          font-[family-name:var(--font-inter)]"
      >
        You&apos;ll hear from us before anyone else.
      </p>
    </motion.div>
  );
}
