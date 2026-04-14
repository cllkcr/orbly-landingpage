"use client";
// Skills: /react-expert (controlled inputs, form handling), /typescript-pro (event types),
// /ui-ux-pro-max (input UX, validation states), /bencium-ux (distinctive form styling)

import { motion, AnimatePresence } from "framer-motion";
import { useWaitlist } from "@/hooks/useWaitlist";

export default function EmailForm({ id }: { id?: string }) {
  const { email, submitted, setEmail, handleSubmit } = useWaitlist();

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          id={id}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08]
              text-[15px] text-white placeholder:text-white/30
              focus:outline-none focus:border-[var(--color-teal)]/40 focus:ring-1 focus:ring-[var(--color-teal)]/20
              backdrop-blur-sm transition-all duration-300
              font-[family-name:var(--font-jetbrains)]"
            aria-label="Email address"
          />
          <motion.button
            type="submit"
            className="px-7 py-3.5 rounded-xl font-medium text-[15px] text-[var(--bg-dark)]
              bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-teal-green)]
              hover:shadow-[0_0_30px_rgba(0,217,230,0.3)] cursor-pointer
              transition-shadow duration-300 shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reserve my spot
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center gap-3 px-6 py-3.5 rounded-xl
            bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20 max-w-md mx-auto"
        >
          <span className="text-[var(--color-teal)] text-lg">&#10003;</span>
          <span className="text-[var(--color-teal)] text-[15px] font-medium">
            You&apos;re in! Check your email.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
