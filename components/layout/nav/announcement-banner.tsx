"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayout } from "../layout-context";

export const AnnouncementBanner = () => {
  const { globalSettings } = useLayout();
  const announcement = globalSettings?.announcement;

  if (!announcement?.show || !announcement?.text) return null;

  const content = (
    <div className="group flex items-center justify-center gap-4 bg-surface-container-low px-6 py-3">
      <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
        {announcement.text}
      </span>
      {announcement.url && (
        <>
          <span className="block h-4 w-px bg-outline-variant" />
          <div className="overflow-hidden">
            <div className="flex w-8 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-4">
                <ArrowRight className="m-auto size-3 text-primary" />
              </span>
              <span className="flex size-4">
                <ArrowRight className="m-auto size-3 text-primary" />
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (announcement.url) {
    return <Link href={announcement.url}>{content}</Link>;
  }

  return content;
};
