'use client';
import React from 'react';
import { useCMS, wrapFieldsWithMeta } from 'tinacms';

// Custom field: shows a dropdown of all pages when linkType === 'internal'
const InternalPageField = wrapFieldsWithMeta((props) => {
  const { field, input, form } = props;
  const cms = useCMS();
  const [pages, setPages] = React.useState<{ label: string; value: string }[]>([]);

  const basePath = field.name.replace(/\.[^.]+$/, '');
  const linkType = form.getFieldState(`${basePath}.linkType`)?.value;

  React.useEffect(() => {
    if (linkType !== 'internal') return;
    // Query TinaCMS for all pages in the page collection
    cms.api.tina
      .request(
        `query { pageConnection { edges { node { _sys { relativePath breadcrumbs } } } } }`,
        { variables: {} }
      )
      .then((res: any) => {
        const edges = res?.data?.pageConnection?.edges || [];
        setPages(
          edges.map((edge: any) => {
            const relativePath = edge.node._sys.relativePath;
            const name = edge.node._sys.breadcrumbs.join('/');
            return {
              label: name === 'home' ? 'Home (/)' : `${name} (/${name})`,
              value: `content/pages/${relativePath}`,
            };
          })
        );
      });
  }, [cms, linkType]);

  if (linkType !== 'internal') return null;

  return (
    <select
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      value={input.value || ''}
      onChange={(e) => input.onChange(e.target.value)}
    >
      <option value="">Select a page...</option>
      {pages.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
});

// Custom field: shows a URL text input when linkType === 'external'
const ExternalLinkField = wrapFieldsWithMeta((props) => {
  const { field, input, form } = props;
  const basePath = field.name.replace(/\.[^.]+$/, '');
  const linkType = form.getFieldState(`${basePath}.linkType`)?.value;
  if (linkType === 'internal') return null;

  return (
    <input
      type="url"
      placeholder="https://example.com"
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      value={input.value || ''}
      onChange={(e) => input.onChange(e.target.value)}
    />
  );
});

export const actionsFieldSchema = {
  label: 'Actions',
  name: 'actions',
  type: 'object' as const,
  list: true,
  ui: {
    defaultItem: {
      label: 'Learn More',
      type: 'button',
      linkType: 'internal',
      page: 'content/pages/home.mdx',
      link: '',
    },
    itemProps: (item: any) => ({ label: item.label }),
  },
  fields: [
    {
      label: 'Label',
      name: 'label',
      type: 'string' as const,
    },
    {
      label: 'Style',
      name: 'type',
      type: 'string' as const,
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Link', value: 'link' },
      ],
    },
    {
      label: 'Link Type',
      name: 'linkType',
      type: 'string' as const,
      options: [
        { label: 'Internal Page', value: 'internal' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      label: 'Page',
      name: 'page',
      type: 'string' as const,
      ui: {
        component: InternalPageField,
      },
    },
    {
      label: 'URL',
      name: 'link',
      type: 'string' as const,
      ui: {
        component: ExternalLinkField,
      },
    },
  ],
};
