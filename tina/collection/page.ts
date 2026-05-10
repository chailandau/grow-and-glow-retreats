import type { Collection } from 'tinacms';
import { calloutBlockSchema } from '@/components/blocks/callout';
import { featureBlockSchema } from '@/components/blocks/features';
import { heroBlockSchema } from '@/components/blocks/hero';
import { imageTextBlockSchema } from '@/components/blocks/image-text';
import { statsBlockSchema } from '@/components/blocks/stats';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { textBlockSchema } from '@/components/blocks/call-to-action';
import { longTextBlockSchema } from '@/components/blocks/long-text';
import { embedBlockSchema } from '@/components/blocks/embed';
import { calBookingBlockSchema } from '@/components/blocks/cal-booking';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
        itemProps: (item: any) => ({
          label: item?.title || item?.label || item?._template,
        }),
      } as any,
      templates: [
        imageTextBlockSchema,
        textBlockSchema,
        testimonialBlockSchema,
        calloutBlockSchema,
        heroBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        longTextBlockSchema,
        embedBlockSchema,
        calBookingBlockSchema,
      ],
    },
  ],
};

export default Page;
