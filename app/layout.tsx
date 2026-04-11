import React from "react";
import { Metadata } from "next";
import { Newsreader, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
  style: ["normal", "italic"],
});

const bodyFont = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Grow and Glow Retreats",
  description: "A curated sanctuary for the modern spirit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(newsreader.variable, bodyFont.variable)}>
      <body className="min-h-screen bg-background font-body text-lg antialiased selection:bg-primary-container selection:text-on-surface">
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
