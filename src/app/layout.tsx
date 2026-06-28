import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import { constructMetadata } from "@/lib/seo";
import type { Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1220",
};

import { SeoPromoBanner } from "@/components/seo-promo-banner";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0B1220] text-white overflow-hidden`}>
        <DashboardLayout>
          {children}
          <SeoPromoBanner />
          <Footer />
        </DashboardLayout>
      </body>
    </html>
  );
}
