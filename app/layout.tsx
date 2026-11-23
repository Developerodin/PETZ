import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const siteUrl = (process.env.AUTH_URL || "https://petz.love").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PETZ — Know your pet's health before the symptoms",
    template: "%s",
  },
  description:
    "PETZ uses AI and veterinary-informed health science to understand your pet's current health, identify potential risk areas, and create a personalized plan.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "PETZ",
    title: "PETZ — Know your pet's health before the symptoms",
    description:
      "PETZ uses AI and veterinary-informed health science to understand your pet's current health, identify potential risk areas, and create a personalized plan.",
    url: siteUrl,
    images: [
      {
        url: "/assets/images/golden-retriever.jpg",
        width: 1200,
        height: 1924,
        alt: "PETZ — preventive pet health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PETZ — Know your pet's health before the symptoms",
    description:
      "PETZ uses AI and veterinary-informed health science to understand your pet's current health, identify potential risk areas, and create a personalized plan.",
    images: ["/assets/images/golden-retriever.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={figtree.className} suppressHydrationWarning>
        <Script src="/scripts/boot.js" strategy="beforeInteractive" />
        <AuthProvider>{children}</AuthProvider>
        <Script src="/vendor/bootstrap/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
