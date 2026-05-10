"use client";
import React, { useEffect, useId } from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { Section, sectionBlockSchemaField } from "../layout/section";
import { PageBlocksCalBooking } from "@/tina/__generated__/types";

declare global {
  interface Window {
    Cal: any;
  }
}

export const CalBooking = ({ data }: { data: PageBlocksCalBooking }) => {
  const calLink = (() => {
    if (!data.url) return "";
    try {
      return new URL(data.url).pathname.replace(/^\//, "");
    } catch {
      return data.url.replace(/^\//, "");
    }
  })();
  const instanceId = useId().replace(/:/g, "");
  const elementId = `cal-inline-${calLink.replace(/\//g, "-")}-${instanceId}`;

  useEffect(() => {
    if (!calLink) return;

    if (!window.Cal) {
      (function (C: any, A: string, L: string) {
        const p = (a: any, ar: any) => { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function (...ar: any[]) {
          const cal = C.Cal;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = (...args: any[]) => { p(api, args); };
            const namespace = ar[1];
            api.q = [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["-queue", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
    }

    // Only call init once per page load
    if (!window.Cal.initialized) {
      window.Cal("init", { origin: "https://cal.com" });
      window.Cal.initialized = true;
    }
    window.Cal("inline", {
      elementOrSelector: `#${elementId}`,
      calLink,
    });
    return () => {
      const el = document.getElementById(elementId);
      if (el) el.innerHTML = "";
    };
  }, [calLink, elementId]);

  if (!data.url) return null;

  return (
    <Section background={data.background!}>
      <div className="max-w-screen-md mx-auto" data-tina-field={tinaField(data, "url")}>
        {data.title && (
          <h2
            className="font-headline text-4xl md:text-5xl text-on-surface mb-12"
            data-tina-field={tinaField(data, "title")}
          >
            {data.title}
          </h2>
        )}
        <div
          id={elementId}
          className="w-full min-h-[500px] md:min-h-[700px] overflow-auto"
        />
      </div>
    </Section>
  );
};

export const calBookingBlockSchema: Template = {
  name: "calBooking",
  label: "Cal.com Booking",
  ui: {
    previewSrc: "/blocks/cal-booking.png",
    defaultItem: {
      background: "bg-surface",
      title: "",
      url: "",
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Cal.com URL",
      name: "url",
      ui: {
        description: "Enter the full URL, e.g. https://cal.com/growandglow/workshop",
      },
    },
  ],
};
