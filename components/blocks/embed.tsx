"use client";
import React, { useEffect, useRef } from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksEmbed } from "@/tina/__generated__/types";
import { Section, sectionBlockSchemaField } from "../layout/section";

export const Embed = ({ data }: { data: PageBlocksEmbed }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isTally = data.url?.includes("tally.so") ?? false;

  useEffect(() => {
    if (!data.url || !isTally) return;

    const scriptSrc = "https://tally.so/widgets/embed.js";

    const loadEmbeds = () => {
      if (typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      }
    };

    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.onload = loadEmbeds;
      script.onerror = () => {
        // Fallback: set src directly if script fails
        if (iframeRef.current) iframeRef.current.src = data.url!;
      };
      document.body.appendChild(script);
    } else {
      loadEmbeds();
    }
  }, [data.url, isTally]);

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
        {isTally ? (
          <iframe
            ref={iframeRef}
            data-tally-src={data.url}
            loading="lazy"
            width="100%"
            height={data.height || 552}
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title={data.title || "Embedded content"}
            style={{ border: 0 }}
          />
        ) : (
          <iframe
            src={data.url}
            loading="lazy"
            width="100%"
            height={data.height || 552}
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title={data.title || "Embedded content"}
            style={{ border: 0 }}
          />
        )}
      </div>
    </Section>
  );
};

export const embedBlockSchema: Template = {
  name: "embed",
  label: "Embed",
  ui: {
    previewSrc: "/blocks/embed.png",
    defaultItem: {
      background: "bg-surface",
      title: "",
      url: "",
      height: 552,
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
      label: "Embed URL",
      name: "url",
    },
    {
      type: "number",
      label: "Height (px)",
      name: "height",
    },
  ],
};
