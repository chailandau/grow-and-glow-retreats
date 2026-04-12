"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLayout } from "../layout-context";
import { Menu, X, ChevronRight } from "lucide-react";
import { AnnouncementBanner } from "./announcement-banner";

export const Header = () => {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings!.header!;

  const pathname = usePathname()
  const [menuState, setMenuState] = React.useState(false)
  const [stuck, setStuck] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    document.body.style.overflow = menuState ? 'hidden' : ''
    if (!menuState) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuState(false) }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey) }
  }, [menuState])

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
        className={`sticky top-0 z-20 w-full backdrop-blur-md border-b border-b-outline-variant/30 ${menuState ? 'bg-white' : 'bg-white/80'}`}>
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
          </div>
        </div>

        <div className="bg-surface in-data-[state=active]:block lg:in-data-[state=active]:flex hidden absolute left-0 right-0 top-full w-full border-t border-t-outline-variant/30 border-b border-b-outline-variant/30 md:flex-nowrap lg:relative lg:top-auto lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:border-transparent lg:bg-transparent lg:p-0">
          <div className="lg:hidden w-full">
            <ul className="font-headline italic text-base tracking-wide text-on-surface-variant">
              {header.nav!.map((item, index) => {
                const isActive = pathname === item!.href || (item!.href !== '/' && pathname.startsWith(item!.href!))
                return (
                  <li key={index} className="mx-10 md:mx-16 border-b border-outline-variant/30 last:border-b-0">
                    <Link
                      href={item!.href!}
                      className={`group flex items-center gap-3 py-8 target-area transition-colors duration-300 ${isActive ? 'text-primary underline underline-offset-4 decoration-1 decoration-primary/50' : 'interact:text-primary interact:underline interact:underline-offset-4 interact:decoration-1 interact:decoration-primary/50'}`}>
                      <ChevronRight className="size-4 opacity-50 transition-transform duration-300 group-hover:translate-x-1" />
                      <span>{item!.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {menuState && (
        <div
          className="fixed inset-0 z-[19] bg-black/40 lg:hidden"
          onClick={() => setMenuState(false)}
          onPointerDown={() => setMenuState(false)}
          aria-hidden
        />
      )}
    </>
  )
}
