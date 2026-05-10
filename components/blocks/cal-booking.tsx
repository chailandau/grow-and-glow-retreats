"use client";
import React, { useEffect } from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { Section, sectionBlockSchemaField } from "../layout/section";

// Placeholder type — replaced with generated type in Task 2
type CalBookingData = {
  background?: string | null;
  title?: string | null;
  url?: string | null;
};

declare global {
  interface Window {
    Cal: any;
  }
}

export const CalBooking = ({ data }: { data: CalBookingData }) => {
  const calLink = data.url?.replace("https://cal.com/", "") ?? "";
  const elementId = `cal-inline-${calLink.replace(/\//g, "-")}`;

  useEffect(() => {
    if (!calLink) return;

    if (!window.Cal) {
      (function (C: any, A: string, L: string) {
        const p = (a: any, ar: any) => { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
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

    window.Cal("init", { origin: "https://cal.com" });
    window.Cal("inline", {
      elementOrSelector: `#${elementId}`,
      calLink,
    });
  }, [calLink, elementId]);

  if (!data.url) return null;

  return (
    <Section background={data.background!}>
      <div className="max-w-screen-md mx-auto" data-tina-field={tinaField(data as any, "url")}>
        {data.title && (
          <h2
            className="font-headline text-4xl md:text-5xl text-on-surface mb-12"
            data-tina-field={tinaField(data as any, "title")}
          >
            {data.title}
          </h2>
        )}
        <div
          id={elementId}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
        />
      </div>
    </Section>
  );
};

export const calBookingBlockSchema: Template = {
  name: "calBooking",
  label: "Cal.com Booking",
  ui: {
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
    },
  ],
};
