import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Rhema — Scripture-Centered Study & Curriculum",
  description:
    "A free, open platform for deep Bible study. Build and follow structured curriculum with scripture, commentary, video, and discussion — all in one place.",
  keywords: [
    "Bible study",
    "curriculum",
    "scripture",
    "theology",
    "commentary",
    "free",
    "open source",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--neutral-900)] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
