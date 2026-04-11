'use client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';
import { PageBlocksImageText } from '@/tina/__generated__/types';
import { Section, sectionBlockSchemaField } from '../layout/section';
import { Button } from '../ui/button';

export const ImageText = ({ data }: { data: PageBlocksImageText }) => {
  const imageFirst = data.layout !== 'imageRight';

  return (
    <Section background={data.background!}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {imageFirst ? (
          <>
            <ImageColumn data={data} />
            <TextColumn data={data} />
          </>
        ) : (
          <>
            <TextColumn data={data} />
            <ImageColumn data={data} />
          </>
        )}
      </div>
    </Section>
  );
};

const ImageColumn = ({ data }: { data: PageBlocksImageText }) => {
  if (!data.image?.src) return null;
  const ratio = data.imageRatio === 'portrait' ? 'aspect-[5/6]' : data.imageRatio === 'landscape' ? 'aspect-[7/5]' : 'aspect-[4/3]';
  return (
    <div data-tina-field={tinaField(data, 'image')}>
      <div className={`${ratio} overflow-hidden editorial-shadow`}>
        <Image
          className="w-full h-full object-cover"
          alt={data.image.alt || ''}
          src={data.image.src}
          width={3000}
          height={4000}
        />
      </div>
    </div>
  );
};

const TextColumn = ({ data }: { data: PageBlocksImageText }) => (
  <div>
    {data.tagline && (
      <span
        className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6 block"
        data-tina-field={tinaField(data, 'tagline')}
      >
        {data.tagline}
      </span>
    )}
    {data.title && (
      <h2
        className="font-headline text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-on-surface mb-4"
        data-tina-field={tinaField(data, 'title')}
      >
        {data.title}
      </h2>
    )}
    {data.subtitle && (
      <p
        className="font-label text-sm uppercase tracking-widest text-on-surface-variant mb-8"
        data-tina-field={tinaField(data, 'subtitle')}
      >
        {data.subtitle}
      </p>
    )}
    {data.text && (
      <div
        className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed whitespace-pre-line"
        data-tina-field={tinaField(data, 'text')}
      >
        {data.text}
      </div>
    )}

    {data.actions && data.actions.length > 0 && (
      <div className="flex items-center gap-8 mt-10">
        {data.actions.map((action) => {
          const href = resolveActionHref(action!);
          const isExternal = isExternalAction(action!);
          const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
          return (
            <div key={action!.label} data-tina-field={tinaField(action)}>
              {action!.type === 'link' ? (
                <Link
                  href={href}
                  {...externalProps}
                  className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-widest border-b border-primary pb-1 text-primary hover:text-on-surface transition-colors duration-300"
                >
                  <span>{action!.label}</span>
                  <ArrowRight className="size-4" />
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
    )}
  </div>
);

export const imageTextBlockSchema: Template = {
  name: 'imageText',
  label: 'Image + Text Content',
  ui: {
    defaultItem: {
      background: 'bg-surface',
      layout: 'imageLeft',
      imageRatio: 'default',
      tagline: 'Our Story',
      title: 'Rooted in Nature, Guided by Light',
      subtitle: '',
      text: 'Every retreat is designed to help you slow down, reconnect, and rediscover the quiet strength within. Set among rolling hills and ancient woodlands, our spaces invite deep restoration.',
      actions: [
        {
          label: 'Learn More',
          type: 'link',
          linkType: 'internal',
          page: 'content/pages/about.mdx',
          link: '',
        },
      ],
      image: {
        src: '/uploads/hero/retreat.jpg',
        alt: 'Peaceful retreat setting surrounded by nature',
      },
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Layout',
      name: 'layout',
      options: [
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Image Right', value: 'imageRight' },
      ],
    },
    {
      type: 'string',
      label: 'Image Ratio',
      name: 'imageRatio',
      options: [
        { label: 'Default (4/3)', value: 'default' },
        { label: 'Portrait (5/6)', value: 'portrait' },
        { label: 'Landscape (7/5)', value: 'landscape' },
      ],
    },
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
    {
      type: 'string',
      label: 'Tagline',
      name: 'tagline',
    },
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Subtitle',
      name: 'subtitle',
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
  ],
};
