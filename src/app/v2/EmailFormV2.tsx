"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useV2Signup } from "@/hooks/useV2Signup";
import ReferralCard from "./ReferralCard";

interface EmailFormV2Props {
  id?: string;
  initialRef?: string;
}

export default function EmailFormV2({ id, initialRef }: EmailFormV2Props) {
  const { state, email, setEmail, handleSubmit } = useV2Signup();
  const isLoading = state.status === "loading";
  const isSubmitted = state.status === "success";
  const error = state.status === "error" ? state.message : null;

  // Tracks whether THIS form instance caused the current submission.
  // Both Hero and FinalCTA mount EmailFormV2, but only the one the user
  // actually submitted from should autofocus its card and scroll-into-view.
  const [submittedHere, setSubmittedHere] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // On transition to success, if THIS instance was the submitter, pull the
  // card into view. scrollIntoView is a no-op when already in view, so safe
  // to call unconditionally — but we only call it for the winning instance
  // to avoid both forms fighting over viewport.
  useEffect(() => {
    if (!isSubmitted || !submittedHere) return;
    const node = containerRef.current;
    if (!node) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Defer to next frame so AnimatePresence has committed the swap
    const raf = requestAnimationFrame(() => {
      node.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [isSubmitted, submittedHere]);

  const onSubmit = async (e: React.FormEvent) => {
    // Claim the submission for this instance BEFORE the async store call —
    // so the subsequent state transition sees `submittedHere === true`.
    setSubmittedHere(true);
    await handleSubmit(e, initialRef);
  };

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="flex flex-col gap-2 w-full max-w-md mx-auto"
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              transition: { duration: 0.25 },
            }}
            id={id}
          >
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <label htmlFor={`${id ?? "v2"}-email`} className="sr-only">
                Email address
              </label>
              <input
                id={`${id ?? "v2"}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                autoComplete="email"
                className="flex-1 px-5 py-3.5 rounded-xl
                  bg-white/[0.06] border border-white/[0.08]
                  text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]/50
                  focus:border-[var(--color-teal)]/40
                  backdrop-blur-sm transition-all duration-300
                  font-[family-name:var(--font-jetbrains)]
                  disabled:opacity-50"
                style={{ minHeight: "48px" }}
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="px-7 py-3.5 rounded-xl font-medium text-[15px] text-[var(--bg-dark)]
                  bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-green)]
                  hover:shadow-[0_0_30px_rgba(0,217,230,0.3)] cursor-pointer
                  transition-shadow duration-300 shrink-0
                  disabled:opacity-70 disabled:cursor-wait
                  flex items-center justify-center gap-2 min-w-[148px]"
                style={{ minHeight: "48px" }}
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-[var(--bg-dark)]/30 border-t-[var(--bg-dark)] rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    Joining…
                  </>
                ) : (
                  "Reserve my spot"
                )}
              </motion.button>
            </div>
            <p
              className="text-[11px] font-[family-name:var(--font-jetbrains)]
                tracking-[0.18em] uppercase text-[var(--text-secondary)]/60
                text-center mt-1"
            >
              No spam, ever
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ReferralCard autoFocus={submittedHere} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && !isSubmitted && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            aria-live="polite"
            className="text-[var(--color-coral)] text-sm mt-2 text-center font-[family-name:var(--font-jetbrains)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
