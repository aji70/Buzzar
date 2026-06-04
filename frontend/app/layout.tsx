import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Buzzar",
    template: "%s | Buzzar",
  },
  description:
    "Buzzar is a competitive learning platform where knowledge creates a buzz. Play quiz battles, climb the hive ranks, and become Hive Master.",
  applicationName: "Buzzar",
  keywords: ["Buzzar", "quiz", "learning", "games", "hive", "trivia"],
  openGraph: {
    title: "Buzzar",
    description:
      "Where knowledge creates a buzz. Compete in real-time quizzes and climb the hive ranks.",
    siteName: "Buzzar",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Buzzar",
    description:
      "Where knowledge creates a buzz. Compete in real-time quizzes and climb the hive ranks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
