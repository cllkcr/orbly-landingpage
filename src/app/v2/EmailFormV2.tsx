"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useV2Signup } from "@/hooks/useV2Signup";

interface EmailFormV2Props {
  id?: string;
  initialRef?: string;
}

export default function EmailFormV2({ id, initialRef }: EmailFormV2Props) {
  const { state, email, setEmail, handleSubmit } = useV2Signup();
  const isLoading = state.status === "loading";
  const isSubmitted = state.status === "success";
  const error = state.status === "error" ? state.message : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            onSubmit={(e) => handleSubmit(e, initialRef)}
            className="flex flex-col gap-2 w-full"
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.25 } }}
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
            key="success"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="flex items-center gap-3 px-6 py-4 rounded-xl
              bg-[var(--color-teal)]/[0.08] border border-[var(--color-teal)]/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="var(--color-teal)"
                strokeOpacity="0.4"
              />
              <path
                d="M5 8.5l2 2 4-4"
                stroke="var(--color-teal)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[var(--color-teal)] text-[14px] font-[family-name:var(--font-jetbrains)] tracking-wide">
              You&apos;re on the list.
            </span>
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
