"use client";
// Skills: /react-expert (state, useCallback, AnimatePresence), /typescript-pro (event types),
// /javascript-pro (clipboard API), /ui-ux-pro-max (referral UX, share mechanics),
// /bencium-ux (button morphing, distinctive interaction)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWaitlist } from "@/hooks/useWaitlist";

export default function Referral() {
  const { submitted, position } = useWaitlist();
  const [copied, setCopied] = useState(false);

  const shareText = `I just joined the Orbly waitlist — the first calendar you can feel. Check it out:`;
  const shareUrl = "https://orbly.app";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = `${shareText} ${shareUrl}`;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <AnimatePresence>
      {submitted && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden bg-[var(--bg-dark-elevated)] border-t border-white/[0.04]"
        >
          <div className="max-w-lg mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="font-[family-name:var(--font-jetbrains)] text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                #{position?.toLocaleString()}
              </p>
              <p className="text-[var(--text-secondary)] mb-1">
                on the Orbly waitlist
              </p>
              <p className="text-[var(--color-teal)] font-[family-name:var(--font-jetbrains)] text-sm mt-6 mb-8">
                Share with friends to move up the list
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08]
                    text-sm text-[var(--text-primary)] hover:bg-white/[0.1] transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </motion.a>

                <motion.button
                  onClick={handleCopy}
                  className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08]
                    text-sm text-[var(--text-primary)] hover:bg-white/[0.1] transition-colors cursor-pointer
                    inline-flex items-center justify-center gap-2 min-w-[160px]"
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
                        &#10003; Copied!
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
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
