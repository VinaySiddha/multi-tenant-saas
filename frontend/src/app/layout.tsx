import type { Metadata } from "next";
import "./globals.css";
import { poppins, manrope } from "./fonts";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Sapru — All-in-One Restaurant Management Software",
  description: "Cloud-native restaurant management platform for modern food businesses: Fast Billing POS, Kitchen Display, QR Ordering, Inventory & Daily Reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${poppins.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className={`h-full font-sans antialiased bg-[#FAFAF8] text-[#0B0B0B] dark:bg-[#0A291F] dark:text-[#FAFAF8] selection:bg-[#FF6A3D] selection:text-white ${poppins.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
