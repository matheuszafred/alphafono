import type { Metadata } from "next";
import { Oxygen } from "next/font/google";
import "./globals.css";

const oxygen = Oxygen({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-oxygen",
});

export const metadata: Metadata = {
  title: "Alphafono — Métricas do Site",
  description: "Dashboard de métricas da Alphafono",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${oxygen.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-oxygen)]">{children}</body>
    </html>
  );
}
