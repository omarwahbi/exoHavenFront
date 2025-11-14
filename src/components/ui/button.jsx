import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-green-700 text-white shadow-lg hover:shadow-xl hover:bg-brand-green-800 dark:bg-brand-green-600 dark:hover:bg-brand-green-700",
        secondary:
          "bg-brand-forest-700 text-white shadow-lg hover:shadow-xl hover:bg-brand-forest-800 dark:bg-brand-forest-600 dark:hover:bg-brand-forest-700",
        accent:
          "bg-brand-yellow text-gray-900 shadow-lg hover:shadow-xl hover:bg-brand-yellow-400 dark:bg-brand-yellow-500 dark:hover:bg-brand-yellow-400",
        outline:
          "border-2 border-brand-green-700 text-brand-green-700 bg-transparent hover:bg-brand-green-700 hover:text-white dark:border-brand-green-600 dark:text-brand-green-600 dark:hover:bg-brand-green-600 dark:hover:text-white",
        outlineSecondary:
          "border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500",
        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        link:
          "text-brand-green-700 underline-offset-4 hover:underline hover:text-brand-green-800 dark:text-brand-green-600 dark:hover:text-brand-green-500",
        destructive:
          "bg-red-600 text-white shadow-lg hover:shadow-xl hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
        gradient:
          "bg-gradient-to-r from-brand-green-700 to-brand-teal-700 text-white shadow-lg hover:shadow-xl dark:from-brand-green-600 dark:to-brand-teal-600",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-11 px-6 text-base rounded-xl",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-xl",
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
