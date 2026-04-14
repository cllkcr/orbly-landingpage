import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Orbly — The first calendar you can feel",
  description:
    "Tasks orbit your Now. Distance shows urgency. The closer it gets, the sooner it's due. Join the waitlist for iOS.",
  keywords: ["calendar", "productivity", "iOS", "orbly", "tasks", "waitlist"],
  openGraph: {
    title: "Orbly — The first calendar you can feel",
    description:
      "Tasks orbit your Now. Distance shows urgency. Join the waitlist.",
    type: "website",
    locale: "en_US",
    siteName: "Orbly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbly — The first calendar you can feel",
    description:
      "Tasks orbit your Now. Distance shows urgency. Join the waitlist.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
