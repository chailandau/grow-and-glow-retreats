'use client';

import React, { useState } from 'react';
import type { Template } from 'tinacms';
import {
  PageBlocksTestimonial,
  PageBlocksTestimonialTestimonials,
} from '../../tina/__generated__/types';
import { Section } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonial = ({ data }: { data: PageBlocksTestimonial }) => {
  const testimonials = data.testimonials ?? [];
  const total = testimonials.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  if (total === 0) return null;

  return (
    <Section background={data.background!}>
      <div className="text-center mb-16">
        <h2
          className="font-headline text-5xl md:text-6xl text-on-surface"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </h2>
        {data.description && (
          <p
            className="font-body text-on-surface-variant mt-6 italic leading-relaxed max-w-xl mx-auto"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center max-w-2xl mx-auto">
        {/* Decorative quote mark — static, outside the animation */}
        <div className="font-headline text-7xl md:text-8xl text-primary-container leading-none select-none">
          &ldquo;
        </div>

        {/* Grid stack: all testimonials in same cell so tallest sets the height */}
        <div className="grid w-full text-center">
          {testimonials.map((t, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`col-start-1 row-start-1 flex flex-col justify-center ${isActive ? '' : 'invisible'}`}
              >
                {isActive ? (
                  <div
                    key={activeIndex}
                    aria-live="polite"
                    style={{ '--slide-from': direction === 'right' ? '24px' : '-24px', animation: 'testimonial-slide-in 300ms ease' } as React.CSSProperties}
                  >
                    <blockquote data-tina-field={tinaField(t, 'quote')}>
                      <p className="font-headline italic text-xl md:text-2xl lg:text-3xl text-on-surface-variant leading-relaxed">
                        {t.quote}
                      </p>
                    </blockquote>
                    <p className="mt-8 font-label text-xs uppercase tracking-[0.2em] text-outline">
                      <span data-tina-field={tinaField(t, 'author')}>
                        {t.author}
                      </span>
                      {t.role && (
                        <>
                          <span className="mx-2">&middot;</span>
                          <span data-tina-field={tinaField(t, 'role')}>
                            {t.role}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div aria-hidden="true">
                    <p className="font-headline italic text-xl md:text-2xl lg:text-3xl leading-relaxed">
                      {t.quote}
                    </p>
                    <p className="mt-8 font-label text-xs uppercase tracking-[0.2em]">
                      {t.author}{t.role && <><span className="mx-2">&middot;</span>{t.role}</>}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Counter navigation */}
        {total > 1 && (
          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex items-center justify-center size-11 text-primary hover:text-on-surface transition-colors duration-300 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-outline tabular-nums">
              {activeIndex + 1} / {total}
            </span>
            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex items-center justify-center size-11 text-primary hover:text-on-surface transition-colors duration-300 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

export const testimonialBlockSchema: Template = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    previewSrc: "/blocks/testimonial.png",
    defaultItem: {
      background: "bg-surface",
      title: "Words from our guests",
      description:
        "Every retreat leaves a lasting imprint. Here's what our community has to say.",
      testimonials: [
        {
          quote:
            "I arrived exhausted and left feeling like myself again. The silence, the space, the intention behind everything — it was exactly what I needed.",
          author: "Maya Chen",
          role: "Returning Guest",
        },
        {
          quote:
            "The morning yoga sessions changed something in me I can't quite name. I came for relaxation and left with clarity.",
          author: "Lena Park",
          role: "First-Time Guest",
        },
        {
          quote:
            "Every detail felt intentional — from the meals to the journaling prompts. I've never felt so held.",
          author: "Sofia Reyes",
          role: "Weekend Retreat",
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
    {
      type: "object",
      list: true,
      label: "Testimonials",
      name: "testimonials",
      ui: {
        defaultItem: {
          quote:
            "This retreat gave me the space to breathe and the clarity to move forward.",
          author: "Guest Name",
          role: "Retreat Attendee",
        },
        itemProps: (item) => ({
          label: `${item.author} — ${item.quote?.substring(0, 40)}...`,
        }),
      },
      fields: [
        {
          type: "string",
          ui: {
            component: "textarea",
          },
          label: "Quote",
          name: "quote",
        },
        {
          type: "string",
          label: "Author",
          name: "author",
        },
        {
          type: "string",
          label: "Role",
          name: "role",
        },
      ],
    },
  ],
};
