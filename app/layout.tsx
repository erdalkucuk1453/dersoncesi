import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DersÖncesi – Akıllı Derse Hazırlık Platformu",
  description:
    "MEB Türkiye Yüzyılı Maarif Modeli uyumlu, ortaokul öğrencileri ve öğretmenleri için akıllı derse ön hazırlık ve hazır bulunuşluk takip platformu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
