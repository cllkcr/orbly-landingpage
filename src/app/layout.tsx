import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://orbly.app";
const TITLE = "Orbly — The first calendar you can feel";
const DESCRIPTION =
  "Tasks orbit your Now. Distance shows urgency. The closer it gets, the sooner it's due. Join the waitlist for iOS.";

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "calendar app",
    "spatial calendar",
    "iOS app",
    "orbly",
    "task management",
    "waitlist",
    "visual calendar",
    "time management",
  ],
  authors: [{ name: "Orbly" }],
  creator: "Orbly",
  publisher: "Orbly",

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Open Graph — image auto-served from src/app/opengraph-image.tsx
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Orbly",
    type: "website",
    locale: "en_US",
  },

  // Twitter / X — image auto-served from src/app/opengraph-image.tsx
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App links
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orbly",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Verification (add your IDs when ready)
  // verification: {
  //   google: "your-google-site-verification-id",
  // },
};

// JSON-LD structured data for Google
function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orbly",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "iOS",
    description: DESCRIPTION,
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      description: "Free for founding members for 12 months",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

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
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
