import React from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksCallout } from '@/tina/__generated__/types';
import { ArrowRight } from 'lucide-react';
import { Section, sectionBlockSchemaField } from '../layout/section';

export const Callout = ({ data }: { data: PageBlocksCallout }) => {
    return (
        <Section background={data.background!} className='flex justify-center py-6'>
            <Link
                data-tina-field={tinaField(data, 'url')}
                href={data.url!}
                className='group mx-auto inline-flex target-area-7 items-center gap-4 font-label text-xs uppercase tracking-widest text-on-surface-variant transition-colors duration-300 interact:text-primary interact:underline underline-offset-4'
            >
                <span data-tina-field={tinaField(data, 'text')}>
                    {data.text}
                </span>
                <ArrowRight className='size-3 text-primary transition-transform duration-300 group-interact:translate-x-1' />
            </Link>
        </Section>
    );
};

export const calloutBlockSchema: Template = {
    name: 'callout',
    label: 'Callout',
    ui: {
        previewSrc: '/blocks/callout.png',
        defaultItem: {
            background: 'bg-surface-container-low',
            url: '/retreats',
            text: 'Now accepting reservations for our Summer 2025 retreat season',
        },
    },
    fields: [
        sectionBlockSchemaField as any,
        {
            type: 'string',
            label: 'Text',
            name: 'text',
        },
        {
            type: 'string',
            label: 'Url',
            name: 'url',
        },
    ],
};
