import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RestoSaaS - Enterprise Restaurant Operating System",
  description: "Cloud-native Multi-tenant POS, Kitchen Display & Restaurant Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
