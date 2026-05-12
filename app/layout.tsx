import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DesktopOnlyWarning } from "@/components/layout/desktop-only-warning";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <DesktopOnlyWarning>{children}</DesktopOnlyWarning>
      </body>
    </html>
  );
}
