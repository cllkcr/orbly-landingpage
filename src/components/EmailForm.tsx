"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWaitlist } from "@/hooks/useWaitlist";

interface EmailFormProps {
  id?: string;
}

export default function EmailForm({ id }: EmailFormProps) {
  const { email, submitted, loading, error, setEmail, handleSubmit } = useWaitlist();

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full"
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.25 } }}
            id={id}
          >
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <input
              id={`${id}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              autoComplete="email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08]
                text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                focus:outline-none focus:border-[var(--color-teal)]/40 focus:ring-1 focus:ring-[var(--color-teal)]/20
                backdrop-blur-sm transition-all duration-300
                font-[family-name:var(--font-jetbrains)]
                disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 rounded-xl font-medium text-[15px] text-[var(--bg-dark)]
                bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-green)]
                hover:shadow-[0_0_30px_rgba(0,217,230,0.3)] cursor-pointer
                transition-shadow duration-300 shrink-0
                disabled:opacity-70 disabled:cursor-wait
                flex items-center justify-center gap-2 min-w-[148px]"
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[var(--bg-dark)]/30 border-t-[var(--bg-dark)] rounded-full animate-spin" />
                  Joining…
                </>
              ) : (
                "Reserve my spot"
              )}
            </motion.button>
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
            {/* SVG check — no emoji */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7.5" stroke="var(--color-teal)" strokeOpacity="0.4" />
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
        {error && !submitted && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="text-[var(--color-coral)] text-sm mt-2 text-center font-[family-name:var(--font-jetbrains)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
