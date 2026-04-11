import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps extends React.HTMLProps<HTMLElement> {
  background?: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ className, children, background, ...props }) => {
  return (
    <div className={background || "bg-surface"}>
      <section
        className={cn("py-24 md:py-32 mx-auto max-w-screen-2xl px-6 md:px-12", className)}
        {...props}
      >
        {children}
      </section>
    </div>
  );
};

export const tailwindBackgroundOptions = [
  { label: "Light Sand", value: "bg-surface" },
  { label: "White", value: "bg-white" },
  { label: "Stone", value: "bg-surface-container" },
];

export const sectionBlockSchemaField = {
  type: "string",
  label: "Background",
  name: "background",
  options: tailwindBackgroundOptions,
};
