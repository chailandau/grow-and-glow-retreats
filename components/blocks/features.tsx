"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import type { Template } from 'tinacms';
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../mdx-components";
import { Icon } from "../icon";
import { iconSchema } from "../../tina/fields/icon";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from '../layout/section';

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section background={data.background!}>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
          <h2 data-tina-field={tinaField(data, 'title')} className="font-headline text-5xl md:text-6xl text-on-surface max-w-xl">{data.title}</h2>
          {data.description && (
            <p data-tina-field={tinaField(data, 'description')} className="font-label text-xs uppercase tracking-widest text-muted-foreground mb-2">{data.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {data.items &&
            data.items.map(function (block, i) {
              return <Feature key={i} index={i} {...block!} />;
            })}
        </div>
      </div>
    </Section>
  )
}

export const Feature = (data: PageBlocksFeaturesItems & { index: number }) => {
  return (
    <div className={`group ${data.index === 1 ? 'mt-12 md:mt-24' : ''}`}>
      {data.icon && (
        <div className="aspect-[3/4] mb-8 overflow-hidden bg-surface-container-high flex items-center justify-center">
          <Icon
            tinaField={tinaField(data, "icon")}
            data={{ size: "large", ...data.icon }}
            className="text-primary"
          />
        </div>
      )}

      <h3
        data-tina-field={tinaField(data, "title")}
        className="font-headline text-3xl mb-4"
      >
        {data.title}
      </h3>

      <div className="text-on-surface-variant leading-relaxed font-body mb-6">
        <TinaMarkdown
          data-tina-field={tinaField(data, "text")}
          content={data.text}
          components={components}
        />
      </div>
    </div>
  );
};

const defaultFeature = {
  title: "Mindful Movement",
  text: "Reconnect with your body through guided yoga, breathwork, and somatic practices designed to release tension and restore balance.",
  icon: {
    name: "BiLeaf",
    color: "",
    style: "float",
  }
};

export const featureBlockSchema: Template = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      background: 'bg-surface',
      title: 'The Foundation of Stillness',
      description: 'Our Core Pillars',
      items: [defaultFeature, defaultFeature, defaultFeature],
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
      label: "Description",
      name: "description",
    },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        iconSchema as any,
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "rich-text",
          label: "Text",
          name: "text",
        },
      ],
    },
  ],
};
