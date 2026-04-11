export const actionsFieldSchema = {
  label: 'Actions',
  name: 'actions',
  type: 'object' as const,
  list: true,
  ui: {
    defaultItem: {
      _template: 'internalAction',
      label: 'Learn More',
      style: 'button',
      page: 'content/pages/home.mdx',
    },
    itemProps: (item: any) => ({ label: item.label }),
  },
  templates: [
    {
      name: 'internalAction',
      label: 'Internal Page Link',
      ui: {
        defaultItem: {
          label: 'Learn More',
          style: 'button',
          page: 'content/pages/home.mdx',
        },
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string' as const,
        },
        {
          label: 'Style',
          name: 'style',
          type: 'string' as const,
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          label: 'Page',
          name: 'page',
          type: 'reference' as const,
          collections: ['page'],
        },
      ],
    },
    {
      name: 'externalAction',
      label: 'External URL Link',
      ui: {
        defaultItem: {
          label: 'Learn More',
          style: 'button',
          link: 'https://example.com',
        },
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string' as const,
        },
        {
          label: 'Style',
          name: 'style',
          type: 'string' as const,
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          label: 'URL',
          name: 'link',
          type: 'string' as const,
        },
      ],
    },
  ],
};
