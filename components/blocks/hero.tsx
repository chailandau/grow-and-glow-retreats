'use client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';
import { PageBlocksHero } from '../../tina/__generated__/types';
import { Section, sectionBlockSchemaField } from '../layout/section';
import { Button } from '../ui/button';

export const Hero = ({ data }: { data: PageBlocksHero }) => {
  return (
    <Section background={data.background!} className="min-h-[80vh] flex items-center py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
        {/* Text Column */}
        <div className="lg:col-span-5 z-10">
          {data.eyebrow && (
            <div data-tina-field={tinaField(data, 'eyebrow')}>
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6 block">
                {data.eyebrow!}
              </span>
            </div>
          )}
          {data.title && (
            <div data-tina-field={tinaField(data, 'title')}>
              <h1 className="font-title text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-on-surface mb-8">
                {data.title!}
              </h1>
            </div>
          )}
          {data.text && (
            <div data-tina-field={tinaField(data, 'text')}>
              <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-md">
                {data.text!}
              </p>
            </div>
          )}

          <div className="flex items-center gap-8 mt-10">
            {data.actions &&
              data.actions.map((action, i) => {
                const href = resolveActionHref(action!);
                const isExternal = isExternalAction(action!);
                const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
                return (
                  <div key={`${action!.label}-${i}`} data-tina-field={tinaField(action)}>
                    {action!.style === 'link' ? (
                      <Link
                        href={href}
                        {...externalProps}
                        className="font-label text-xs uppercase tracking-widest border-b border-primary pb-1 text-primary interact:text-on-surface transition-colors duration-300"
                      >
                        <div className="target-area-7 inline-flex items-center gap-2">
                          <span>{action!.label}</span>
                          <ArrowRight className="size-4" />
                        </div>
                      </Link>
                    ) : (
                      <Button asChild>
                        <Link href={href} {...externalProps}>
                          <span>{action!.label}</span>
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Image Column */}
        {data.image?.src && (
          <div className="lg:col-span-7 relative" data-tina-field={tinaField(data, 'image')}>
            <div className="aspect-[7/5] overflow-hidden editorial-shadow">
              <Image
                className="w-full h-full object-cover"
                alt={data.image.alt || ''}
                src={data.image.src}
                height={4000}
                width={3000}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export const heroBlockSchema: Template = {
  name: 'hero',
  label: 'Hero',
  ui: {
    previewSrc: '/blocks/hero.png',
    defaultItem: {
      background: 'bg-orange-50/80',
      eyebrow: "Est. 2024",
      title: 'Grow and Glow Retreats',
      text: 'A curated sanctuary for the modern spirit. Rediscover your internal rhythm through architectural silence and intentional movement.',
      actions: [
        {
          type: 'internal',
          label: 'Book a Retreat',
          style: 'button',
          page: 'content/pages/home.mdx',
        },
        {
          type: 'internal',
          label: 'Our Story',
          style: 'link',
          page: 'content/pages/about.mdx',
        },
      ],
      image: {
        src: '/uploads/retreat.jpg',
        alt: 'Peaceful wellness retreat surrounded by nature',
      },
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Eyebrow',
      name: 'eyebrow',
    },
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Text',
      name: 'text',
      ui: {
        component: 'textarea',
      },
    },
    actionsFieldSchema as any,
    {
      type: 'object',
      label: 'Image',
      name: 'image',
      fields: [
        {
          name: 'src',
          label: 'Image Source',
          type: 'image',
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],
};
