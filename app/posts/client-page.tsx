'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import ErrorBoundary from '@/components/error-boundary';
import { ArrowRight, UserRound } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClientPostProps {
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
  query: string;
}

export default function PostsClientPage(props: ClientPostProps) {
  const posts = props.data?.postConnection.edges!.map((postData) => {
    const post = postData!.node!;
    const date = new Date(post.date!);
    let formattedDate = '';
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMM dd, yyyy');
    }

    return {
      id: post.id,
      published: formattedDate,
      title: post.title,
      tags: post.tags?.map((tag) => tag?.tag?.name) || [],
      url: `/posts/${post._sys.breadcrumbs.join('/')}`,
      excerpt: post.excerpt,
      heroImg: post.heroImg,
      author: {
        name: post.author?.name || 'Anonymous',
        avatar: post.author?.avatar,
      }
    }
  });

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col items-center gap-16">
          <div className="text-center">
            <h2 className="font-headline text-5xl md:text-6xl text-on-surface mb-6">
              Journal
            </h2>
            <p className="mx-auto max-w-2xl text-on-surface-variant font-body leading-relaxed italic">
              Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.
            </p>
          </div>

          <div className="grid gap-y-16 sm:grid-cols-12 lg:gap-y-24 w-full">
            {posts.map((post) => (
              <div
                key={post.id}
                className="sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-8 md:items-center lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-3 font-label text-[10px] uppercase tracking-[0.3em] text-primary">
                        {post.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                    <h3 className="font-headline text-2xl md:text-3xl text-on-surface">
                      <Link
                        href={post.url}
                        className="hover:text-primary transition-colors duration-300"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <div className="mt-4 text-on-surface-variant font-body leading-relaxed">
                      <TinaMarkdown content={post.excerpt} />
                    </div>
                    <div className="mt-6 flex items-center space-x-4 text-sm">
                      <Avatar className="size-9">
                        {post.author.avatar && (
                          <AvatarImage
                            src={post.author.avatar}
                            alt={post.author.name}
                          />
                        )}
                        <AvatarFallback className="bg-surface-container-high text-on-surface-variant font-headline text-xs">
                          <UserRound size={14} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-on-surface-variant font-label text-xs">{post.author.name}</span>
                      <span className="text-outline-variant">&middot;</span>
                      <span className="text-muted-foreground font-label text-xs">
                        {post.published}
                      </span>
                    </div>
                    <div className="mt-6">
                      <Link
                        href={post.url}
                        className="inline-flex items-center font-label text-xs uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary pb-1 transition-all duration-300"
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 size-3" />
                      </Link>
                    </div>
                  </div>
                  {post.heroImg && (
                    <div className="order-first sm:order-last sm:col-span-5">
                      <Link href={post.url} className="block group">
                        <div className="aspect-[16/9] overflow-hidden">
                          <Image
                            width={533}
                            height={300}
                            src={post.heroImg}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
