import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-green-700 text-white border-transparent dark:bg-brand-green-600",
        secondary:
          "bg-brand-forest-700 text-white border-transparent dark:bg-brand-forest-600",
        sale:
          "bg-red-600 text-white border-transparent dark:bg-red-500",
        new:
          "bg-brand-yellow text-gray-900 border-transparent font-bold dark:bg-brand-yellow-400",
        stock:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700",
        outOfStock:
          "bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
        featured:
          "bg-gradient-to-r from-brand-green-700 to-brand-teal-700 text-white border-transparent dark:from-brand-green-600 dark:to-brand-teal-600",
        expert:
          "bg-brand-yellow-100 text-brand-yellow-900 border border-brand-yellow-200 dark:bg-brand-yellow-900 dark:text-brand-yellow-100 dark:border-brand-yellow-700",
        outline:
          "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md font-bold",
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
