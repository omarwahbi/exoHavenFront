import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-teal text-white shadow-md hover:shadow-card-hover hover:bg-brand-teal-600",
        secondary:
          "bg-brand-forest text-white shadow-md hover:shadow-card-hover hover:bg-brand-forest-600",
        accent:
          "bg-brand-amber text-neutral-900 shadow-md hover:shadow-card-hover hover:bg-brand-amber-600",
        outline:
          "border-2 border-brand-teal text-brand-teal bg-transparent hover:bg-brand-teal hover:text-white",
        outlineSecondary:
          "border-2 border-neutral-300 text-neutral-700 bg-transparent hover:bg-neutral-100 hover:border-neutral-400",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        link:
          "text-brand-teal underline-offset-4 hover:underline hover:text-brand-teal-700",
        destructive:
          "bg-red-600 text-white shadow-md hover:shadow-card-hover hover:bg-red-700",
        gradient:
          "bg-gradient-to-r from-brand-teal to-brand-forest text-white shadow-md hover:shadow-lg",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-11 px-5 text-base rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, children, asChild = false, animate = true, ...props }, ref) => {
    const Comp = asChild ? motion.slot : motion.button

    const animationProps = animate ? {
      whileHover: { y: -2 },
      whileTap: { y: 0 },
      transition: { type: "spring", stiffness: 400, damping: 25 }
    } : {};

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...animationProps}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
