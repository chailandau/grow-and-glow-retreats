"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayout } from "../layout-context";

export const AnnouncementBanner = () => {
  const { globalSettings } = useLayout();
  const announcement = globalSettings?.announcement;

  if (!announcement?.show || !announcement?.text) return null;

  return (
    <div className="relative z-20 flex items-center justify-center bg-surface-container-low px-6 py-3">
      {announcement.url ? (
        <Link
          href={announcement.url}
          className="inline-flex target-area-7 group items-center gap-4 font-label text-xs uppercase tracking-widest text-on-surface-variant transition-colors duration-300 interact:text-primary interact:underline underline-offset-4"
        >
          <span>{announcement.text}</span>
          <ArrowRight className="size-3 text-primary transition-transform duration-300 group-interact:translate-x-1" />
        </Link>
      ) : (
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
          {announcement.text}
        </span>
      )}
    </div>
  );
};
