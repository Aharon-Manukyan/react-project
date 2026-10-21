import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const serif = Literata({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Atelier — full-stack портфолио",
  description:
    "Next.js студия: публичные кейсы, REST API, Prisma и админка для управления проектами.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
