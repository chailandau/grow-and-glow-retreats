import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksStats } from "@/tina/__generated__/types";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from '../layout/section';

export const Stats = ({ data }: { data: PageBlocksStats }) => {
    return (
        <Section background={data.background!}>
            <div className="mx-auto max-w-screen-xl space-y-16 md:space-y-24">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                    <h2 className="font-headline text-5xl md:text-6xl text-on-surface" data-tina-field={tinaField(data, 'title')}>{data.title}</h2>
                    <p className="font-body text-on-surface-variant leading-relaxed" data-tina-field={tinaField(data, 'description')}>{data.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 md:gap-24">
                    {data.stats?.map((stat) => (
                        <div key={stat?.type} className="text-center space-y-4 py-8">
                            <div className="font-headline text-6xl md:text-7xl text-primary" data-tina-field={tinaField(stat, 'stat')}>{stat!.stat}</div>
                            <p className="font-label text-xs uppercase tracking-widest text-muted-foreground" data-tina-field={tinaField(stat, 'type')}>{stat!.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}


export const statsBlockSchema: Template = {
    name: "stats",
    label: "Stats",
    ui: {
        previewSrc: "/blocks/stats.png",
        defaultItem: {
            background: "bg-zinc-50",
            title: "A legacy of transformation",
            description: "Since our founding, Grow and Glow Retreats has guided thousands on their journey toward stillness, self-discovery, and renewal.",
            stats: [
                {
                    stat: "2,400+",
                    type: "Guests Welcomed",
                },
                {
                    stat: "120+",
                    type: "Retreats Hosted",
                },
                {
                    stat: "98%",
                    type: "Return Rate",
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
        },
        {
            type: "object",
            label: "Stats",
            name: "stats",
            list: true,
            ui: {
                defaultItem: {
                    stat: "100+",
                    type: "Retreats Hosted",
                },
                itemProps: (item) => {
                    return {
                        label: `${item.stat} ${item.type}`,
                    };
                },
            },
            fields: [
                {
                    type: "string",
                    label: "Stat",
                    name: "stat",
                },
                {
                    type: "string",
                    label: "Type",
                    name: "type",
                },
            ],
        },
    ],
};
