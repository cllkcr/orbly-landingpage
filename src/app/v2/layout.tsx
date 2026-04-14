import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Orbly — Your brain lives in the now",
  description:
    "See what's coming. Feel what's close. Let Orbly handle the rest. Join the waitlist for iOS.",
  alternates: { canonical: "/v2" },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
