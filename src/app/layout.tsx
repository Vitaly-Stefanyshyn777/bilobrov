import "./globals.css";
import "@/styles/reset.css";
import "@/styles/tailwind.css";
import {
  Geist,
  Geist_Mono,
  Manrope,
  Playfair_Display,
  Inter,
  Raleway,
} from "next/font/google";
import type { Metadata } from "next";
import ClientProviders from "@/provaiders/ClientProviders";
import Providers from "@/providers";

// import ClientProviders from "@/providers/ClientProviders";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bilobrov Shop",
  description: "Created with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          ${manrope.variable}
          ${playfair.variable}
          ${inter.variable}
          ${raleway.variable}
        `}
      >
        {/* ⬇️ УСІ клієнтські штуки заховано всередині */}
        <Providers>
          <ClientProviders>{children}</ClientProviders>
        </Providers>
      </body>
    </html>
  );
}
