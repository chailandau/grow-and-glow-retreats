"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLayout } from "../layout-context";
import { Menu, X } from "lucide-react";
import { AnnouncementBanner } from "./announcement-banner";

export const Header = () => {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings!.header!;

  const pathname = usePathname()
  const [menuState, setMenuState] = React.useState(false)
  const [stuck, setStuck] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    // rootMargin bottom of 48px means the sentinel is considered "visible"
    // until 48px below the viewport top — this fires the expand BEFORE
    // the nav unsticks, so it's already py-6 when it returns to flow
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: '48px 0px 0px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <AnnouncementBanner />
      <div ref={sentinelRef} className="h-0 w-0" aria-hidden />
      <nav
        data-state={menuState && 'active'}
        className="bg-white/80 sticky top-0 z-20 w-full backdrop-blur-md">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-12">
          <div className={`relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 transition-[padding] duration-300 ${stuck ? 'py-5' : 'py-10'}`}>
            <div className="flex w-full items-center justify-between gap-12">
              <Link
                href="/"
                aria-label="home"
                className="target-area-7">
                <Image
                  src="/uploads/logo.svg"
                  alt="Grow and Glow Retreats"
                  width={200}
                  height={20}
                  className="h-5 md:h-7 w-auto transition-[height] duration-300"
                  priority
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:flex items-center gap-10">
                <ul className="flex gap-10 font-headline italic text-base tracking-wide text-on-surface-variant">
                  {header.nav!.map((item, index) => {
                    const isActive = pathname === item!.href || (item!.href !== '/' && pathname.startsWith(item!.href!))
                    return (
                      <li key={index}>
                        <Link
                          href={item!.href!}
                          className={`target-area-7 underline underline-offset-4 decoration-1 transition-all duration-300 ${isActive ? 'text-primary decoration-primary/50' : 'decoration-transparent interact:text-primary interact:decoration-primary/50'}`}>
                          <span>{item!.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <div className="bg-surface in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 border-t border-outline-variant p-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0">
              <div className="lg:hidden">
                <ul className="space-y-6 font-headline italic text-base tracking-wide text-on-surface-variant">
                  {header.nav!.map((item, index) => {
                    const isActive = pathname === item!.href || (item!.href !== '/' && pathname.startsWith(item!.href!))
                    return (
                      <li key={index}>
                        <Link
                          href={item!.href!}
                          className={`target-area transition-colors duration-300 ${isActive ? 'text-primary' : 'interact:text-primary'}`}>
                          <span>{item!.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
