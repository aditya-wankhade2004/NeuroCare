import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardShell from "./components/DashboardShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NeuroSense 2.0 — Intelligent Cognitive Wellness & Health Monitoring",
  description: "Advanced personal health monitoring, cognitive baseline tracking, and neural wellness overview.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
