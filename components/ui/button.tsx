import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ArrowRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest font-label transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 interact:[&_svg]:translate-x-1 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground interact:bg-primary-container interact:text-on-surface",
        destructive:
          "bg-destructive text-white interact:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-outline/30 bg-transparent interact:bg-surface-container-low interact:text-on-surface",
        secondary:
          "bg-surface-container text-on-surface interact:bg-surface-container-high",
        ghost:
          "interact:bg-surface-container interact:text-on-surface",
        link: "text-primary border-b border-primary/20 interact:border-primary pb-1",
      },
      size: {
        default: "px-8 py-3",
        sm: "px-6 py-2",
        lg: "px-10 py-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
