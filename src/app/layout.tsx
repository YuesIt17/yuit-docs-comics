import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MockProvider } from "@/components/providers/MockProvider";
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
  title: "The Staff Engineering Team",
  description:
    "AI-native communication platform for software engineers — operational English fluency through interactive comic simulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <MockProvider>{children}</MockProvider>
      </body>
    </html>
  );
}
