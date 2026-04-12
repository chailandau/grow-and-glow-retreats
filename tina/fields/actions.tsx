import React from 'react';
import { TextField, ReferenceField } from 'tinacms';

export const actionsFieldSchema = {
  label: 'Actions',
  name: 'actions',
  type: 'object' as const,
  list: true,
  ui: {
    defaultItem: {
      type: 'internal',
      label: 'Learn More',
      style: 'button',
      page: 'content/pages/home.mdx',
    },
    itemProps: (item: any) => ({ label: item?.label }),
  },
  fields: [
    {
      label: 'Type',
      name: 'type',
      type: 'string' as const,
      options: [
        { label: 'Internal Page Link', value: 'internal' },
        { label: 'External URL Link', value: 'external' },
      ],
    },
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
      ui: {
        component: (props: any) => {
          const type = props.form.getFieldState(
            props.field.name.replace('.page', '.type')
          )?.value;
          if (type !== 'internal') return null;
          return React.createElement(ReferenceField, props);
        },
      },
    },
    {
      label: 'URL',
      name: 'link',
      type: 'string' as const,
      ui: {
        component: (props: any) => {
          const type = props.form.getFieldState(
            props.field.name.replace('.link', '.type')
          )?.value;
          if (type !== 'external') return null;
          return React.createElement(TextField, props);
        },
      },
    },
  ],
};
