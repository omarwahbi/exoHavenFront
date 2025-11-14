import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-teal text-white border-transparent",
        secondary:
          "bg-brand-forest text-white border-transparent",
        sale:
          "bg-brand-clay text-white border-transparent",
        new:
          "bg-brand-amber text-neutral-900 border-transparent",
        stock:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        outOfStock:
          "bg-neutral-100 text-neutral-600 border border-neutral-300",
        featured:
          "bg-gradient-to-r from-brand-teal to-brand-forest text-white border-transparent",
        expert:
          "bg-brand-amber-50 text-brand-amber-900 border border-brand-amber-200",
        outline:
          "bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        default: "px-2.5 py-1 text-sm rounded-lg",
        lg: "px-3 py-1.5 text-base rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant, size }), className)} {...props} />);
}

export { Badge, badgeVariants }
