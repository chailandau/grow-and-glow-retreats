'use client';
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import ErrorBoundary from '@/components/error-boundary';

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { theme } = useLayout();
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date!);
  let formattedDate = '';
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, 'MMM dd, yyyy');
  }

  return (
    <ErrorBoundary>
      <Section className="max-w-4xl">
        <div className="text-center mb-16">
          <h1 data-tina-field={tinaField(post, 'title')} className="font-headline text-5xl md:text-6xl text-on-surface leading-[1.1] mb-8">
            {post.title}
          </h1>
          <div data-tina-field={tinaField(post, 'author')} className='flex items-center justify-center gap-4'>
            {post.author && (
              <>
                {post.author.avatar && (
                  <div className='shrink-0'>
                    <Image
                      data-tina-field={tinaField(post.author, 'avatar')}
                      priority={true}
                      className='h-12 w-12 object-cover'
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={500}
                      height={500}
                    />
                  </div>
                )}
                <p
                  data-tina-field={tinaField(post.author, 'name')}
                  className='font-label text-sm text-on-surface-variant'
                >
                  {post.author.name}
                </p>
                <span className='text-outline-variant'>&mdash;</span>
              </>
            )}
            <p
              data-tina-field={tinaField(post, 'date')}
              className='font-label text-sm text-muted-foreground'
            >
              {formattedDate}
            </p>
          </div>
        </div>
        {post.heroImg && (
          <div className='w-full mb-16'>
            <div data-tina-field={tinaField(post, 'heroImg')} className='relative max-w-4xl mx-auto overflow-hidden editorial-shadow'>
              <Image
                priority={true}
                src={post.heroImg}
                alt={post.title}
                width={1200}
                height={600}
                className='w-full h-auto object-cover'
              />
            </div>
          </div>
        )}
        <div data-tina-field={tinaField(post, '_body')} className='prose prose-lg dark:prose-dark w-full max-w-none prose-headings:font-headline prose-headings:text-on-surface prose-p:text-on-surface-variant prose-p:leading-relaxed prose-a:text-primary'>
          <TinaMarkdown
            content={post._body}
            components={{
              ...components,
            }}
          />
        </div>
      </Section>
    </ErrorBoundary>
  );
}
