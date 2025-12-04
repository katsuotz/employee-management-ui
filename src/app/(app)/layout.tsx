import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationInitializer } from "@/components/NotificationInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard | Employee Management",
  description: "Employee Management System Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <NotificationInitializer>
            <Navigation />
            <main className="min-h-screen bg-background container mx-auto pt-8">
              {children}
            </main>
            <Toaster />
          </NotificationInitializer>
        </NotificationProvider>
      </body>
    </html>
  );
}
