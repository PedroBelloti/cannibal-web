import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { site } from "@/content/site";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  metadataBase: new URL(site.meta.siteUrl),
};

// Roda no <head>, antes do corpo existir: em recarga, o navegador não restaura a posição nem
// pula para o "#" do endereço, e a página abre no Hero.
const RELOAD_TO_TOP = `history.scrollRestoration="manual";var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){if(location.hash)history.replaceState(null,"",location.pathname+location.search);scrollTo(0,0)}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.meta.lang}
      className={`${schibsted.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: RELOAD_TO_TOP }} />
      </head>
      <body className="relative min-h-full bg-ground text-ink">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
