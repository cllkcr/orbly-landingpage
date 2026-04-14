"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useV2Signup } from "@/hooks/useV2Signup";
import type { ReferralTier } from "../types";

const MILESTONES: Array<{
  count: number;
  reward: string;
  tier: ReferralTier | null;
}> = [
  { count: 2, reward: "Jump 50 spots", tier: null },
  { count: 5, reward: "Founding member badge in the app. Forever.", tier: "badge" },
  { count: 10, reward: "One-on-one onboarding call with the founder.", tier: "call" },
];

export default function ReferralV2() {
  const { state } = useV2Signup();
  const [copied, setCopied] = useState(false);

  const isSuccess = state.status === "success";
  const position = isSuccess ? state.position : 0;
  const referralCode = isSuccess ? state.referralCode : "";
  const referralCount = isSuccess ? state.referralCount : 0;
  const tier = isSuccess ? state.tier : "none";

  const shareUrl = `https://orbly.app/v2?ref=${referralCode}`;
  const shareText = `I just joined the Orbly waitlist — the first calendar you can feel. Check it out:`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = `${shareText} ${shareUrl}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareText, shareUrl]);

  return (
    <AnimatePresence>
      {isSuccess && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden bg-[var(--bg-dark-elevated)] border-t border-white/[0.04]"
          aria-label="Your waitlist position and referral"
        >
          <div className="max-w-lg mx-auto px-5 md:px-6 py-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Position */}
              <p className="font-[family-name:var(--font-jetbrains)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-1">
                #{position.toLocaleString()}
              </p>
              <p className="text-[var(--text-secondary)] font-[family-name:var(--font-inter)] mb-8">
                on the Orbly waitlist
              </p>

              {/* Milestones */}
              <div className="mb-8 space-y-3 text-left">
                <p className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)] tracking-widest uppercase text-center mb-4">
                  Move up. Bring someone with you.
                </p>
                {MILESTONES.map((m) => {
                  const isReached =
                    referralCount >= m.count ||
                    (m.tier && tier === m.tier) ||
                    (m.tier === "call" && tier === "call") ||
                    (m.tier === "badge" &&
                      (tier === "badge" || tier === "call"));
                  return (
                    <div
                      key={m.count}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        isReached
                          ? "bg-[var(--color-teal)]/[0.08] border border-[var(--color-teal)]/20"
                          : "bg-white/[0.03] border border-white/[0.05]"
                      }`}
                    >
                      <span
                        className="font-[family-name:var(--font-jetbrains)] text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          color: isReached
                            ? "var(--color-teal)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {m.count} friend{m.count > 1 ? "s" : ""}
                      </span>
                      <span
                        className="text-sm font-[family-name:var(--font-inter)] leading-snug"
                        style={{
                          color: isReached
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {m.count === 2
                          ? "Jump 50 spots"
                          : m.count === 5
                          ? "Founding member badge in the app. Forever."
                          : "One-on-one onboarding call with the founder."}
                      </span>
                    </div>
                  );
                })}
                <p className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-jetbrains)] text-center pt-1">
                  Both you and every friend you refer move up the list.
                </p>
              </div>

              {/* Share buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08]
                    text-sm text-[var(--text-primary)] hover:bg-white/[0.10]
                    transition-colors inline-flex items-center justify-center gap-2"
                  style={{ minHeight: "44px" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </motion.a>

                <motion.button
                  onClick={handleCopy}
                  className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08]
                    text-sm text-[var(--text-primary)] hover:bg-white/[0.10]
                    transition-colors cursor-pointer
                    inline-flex items-center justify-center gap-2 min-w-[160px]"
                  style={{ minHeight: "44px" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-[var(--color-teal)]"
                      >
                        ✓ Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        Copy referral link
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Confirmation note */}
              <p className="mt-8 text-xs text-[var(--text-secondary)] font-[family-name:var(--font-inter)] leading-relaxed">
                We&apos;ll send you a confirmation now and keep you updated as
                we build. You&apos;ll hear from us before anyone else.
              </p>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
