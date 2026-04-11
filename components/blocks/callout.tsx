import React from 'react';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksCallout } from '@/tina/__generated__/types';
import { ArrowRight } from 'lucide-react';
import { Section, sectionBlockSchemaField } from '../layout/section';

export const Callout = ({ data }: { data: PageBlocksCallout }) => {
    return (
        <Section background={data.background!} className='py-6'>
            <Link
                data-tina-field={tinaField(data, 'url')}
                href={data.url!}
                className='group mx-auto flex w-fit items-center gap-4 bg-surface-container-low px-6 py-3 hover:bg-surface-container transition-colors duration-300'
            >
                <span data-tina-field={tinaField(data, 'text')} className='font-label text-xs uppercase tracking-widest text-on-surface-variant'>
                    {data.text}
                </span>
                <span className='block h-4 w-px bg-outline-variant'></span>

                <div className='overflow-hidden'>
                    <div className='flex w-8 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0'>
                        <span className='flex size-4'>
                            <ArrowRight className='m-auto size-3 text-primary' />
                        </span>
                        <span className='flex size-4'>
                            <ArrowRight className='m-auto size-3 text-primary' />
                        </span>
                    </div>
                </div>
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
