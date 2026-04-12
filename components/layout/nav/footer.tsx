"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { footer } = globalSettings!;

  return (
    <footer className="w-full pt-24 pb-12 bg-white border-t border-outline-variant/20">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" aria-label="go home" className="target-area-7">
              <Image
                src="/uploads/logo.svg"
                alt="Grow and Glow Retreats"
                width={200}
                height={20}
                className="h-5 w-auto"
              />
            </Link>
            <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground opacity-80">
              &copy; {new Date().getFullYear()} Grow and Glow. All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8">
              {footer?.social?.map((link, index) => (
                <Link key={`${link!.icon}${index}`} href={link!.url!} target="_blank" rel="noopener noreferrer" className="target-area-7" >
                  <Icon data={{ ...link!.icon, size: 'small' }} className="text-muted-foreground interact:text-primary block transition-colors duration-300" />
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 font-label text-[10px] uppercase tracking-widest text-muted-foreground opacity-80">
              <Link href="/privacy-policy" className="interact:text-primary transition-colors duration-300">Privacy Policy</Link>
              <span aria-hidden="true">·</span>
              <Link href="/terms-of-service" className="interact:text-primary transition-colors duration-300">Terms of Service</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
