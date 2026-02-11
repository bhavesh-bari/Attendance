// layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
var domain = process.env.DOMAIN || "https://jspmattendance.vercel.app";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(domain),

  title: {
    default: "JSPM NTC Attendance Monitoring System",
    template: "%s | JSPM NTC Attendance System",
  },

  description:
    "A modern attendance monitoring system for JSPM NTC. Features include real-time tracking, automated reports, class analytics, teacher dashboards, and academic year-wise insights.",

  icons: {
    icon: "/jspm1.webp",
    shortcut: "/jspm1.webp",
    apple: "/jspm1.webp",
  },

  keywords: [
    "JSPM NTC",
    "attendance system",
    "student attendance",
    "college attendance monitoring",
    "automated attendance",
    "class attendance",
  ],

  openGraph: {
    title: "JSPM NTC Attendance Monitoring System",
    description:
      "A powerful attendance monitoring system built for JSPM NTC to track student attendance with automation, analytics, and real-time updates.",
    url: domain,
    siteName: "JSPM NTC Attendance Monitoring System",
    images: [
      {
        url: `${domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JSPM NTC Attendance System",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JSPM NTC Attendance Monitoring System",
    description:
      "A modern attendance tracking platform with analytics, automation, and teacher tools.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: domain,
  },

  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>

        {/* ⭐ JSON-LD Structured Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "JSPM NTC Attendance Monitoring System",
              operatingSystem: "Web",
              applicationCategory: "EducationalApplication",
              url: domain,
              description:
                "A complete attendance monitoring system for JSPM NTC with analytics and automation.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
