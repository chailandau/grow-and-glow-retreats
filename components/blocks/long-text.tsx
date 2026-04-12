"use client";
import React from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../mdx-components";
import { PageBlocksLongText } from "@/tina/__generated__/types";
import { Section, sectionBlockSchemaField } from "../layout/section";

export const LongText = ({ data }: { data: PageBlocksLongText }) => {
  return (
    <Section background={data.background!}>
      <div className="max-w-screen-md mx-auto">
        {data.title && (
          <h1
            className="font-headline text-4xl md:text-5xl text-on-surface mb-4"
            data-tina-field={tinaField(data, "title")}
          >
            {data.title}
          </h1>
        )}
        {data.subtitle && (
          <p
            className="font-body text-on-surface-variant mb-12"
            data-tina-field={tinaField(data, "subtitle")}
          >
            {data.subtitle}
          </p>
        )}
        <div
          className="font-body text-on-surface-variant leading-relaxed [&_h2]:font-headline [&_h2]:text-on-surface [&_h2]:text-2xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-headline [&_h3]:text-on-surface [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline"
          data-tina-field={tinaField(data, "body")}
        >
          <TinaMarkdown content={data.body} components={components} />
        </div>
      </div>
    </Section>
  );
};

export const longTextBlockSchema: Template = {
  name: "longText",
  label: "Long Text",
  ui: {
    previewSrc: "/blocks/long-text.png",
    defaultItem: {
      background: "bg-surface",
      title: "Page Title",
      subtitle: "",
      body: {
        type: "root",
        children: [
          {
            type: "p",
            children: [{ type: "text", text: "Start writing here..." }],
          },
        ],
      },
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
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },
  ],
};
