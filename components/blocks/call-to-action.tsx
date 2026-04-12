import { ArrowRight } from 'lucide-react';
import Link from 'next/link'
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Button } from '@/components/ui/button'
import { PageBlocksText } from '@/tina/__generated__/types';
import { Section, sectionBlockSchemaField } from '../layout/section';
import { resolveActionHref, isExternalAction } from '@/lib/resolve-action-href';
import { actionsFieldSchema } from '@/tina/fields/actions';

export const Text = ({ data }: { data: PageBlocksText }) => {
    return (
        <Section background={data.background!}>
            <div className="max-w-xl mx-auto text-center">
                <h2 className="font-headline text-5xl md:text-6xl text-on-surface mb-8" data-tina-field={tinaField(data, 'title')}>{data.title}</h2>
                <p className="font-body text-on-surface-variant leading-relaxed italic mb-12" data-tina-field={tinaField(data, 'description')}>{data.description}</p>

                <div className="flex flex-wrap justify-center gap-6">
                    {data.actions && data.actions.map((action, i) => {
                        const href = resolveActionHref(action!);
                        const isExternal = isExternalAction(action!);
                        const externalProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
                        return (
                            <div
                                key={`${action!.label}-${i}`}
                                data-tina-field={tinaField(action)}>
                                {action!.style === 'link' ? (
                                    <Link
                                        href={href}
                                        {...externalProps}
                                        className="font-label text-xs uppercase tracking-widest text-primary border-b border-primary/20 interact:border-primary pb-1 transition-colors duration-300"
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
        </Section>
    )
}


export const textBlockSchema: Template = {
    name: "text",
    label: "Text Content",
    ui: {
        previewSrc: "/blocks/cta.png",
        defaultItem: {
            background: "bg-surface-container",
            title: "Join the Inner Circle",
            description: "Receive private invitations to our upcoming retreats and seasonal reflections on growth and glowing from within.",
            actions: [
                {
                    type: 'internal',
                    label: 'Reserve Your Spot',
                    style: 'button',
                    page: 'content/pages/home.mdx',
                },
                {
                    type: 'internal',
                    label: 'Learn More',
                    style: 'link',
                    page: 'content/pages/about.mdx',
                },
            ],
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
            ui: {
                component: "textarea",
            },
        },
        actionsFieldSchema as any,
    ],
};
