"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GazeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline"
  size?: "sm" | "md" | "lg" | "xl"
}

const GazeButton = React.forwardRef<HTMLButtonElement, GazeButtonProps>(
  ({ className, variant = "default", size = "lg", onClick, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
    }

    const sizeStyles = {
      sm: "h-12 px-6 text-base",
      md: "h-16 px-8 text-lg",
      lg: "h-20 px-10 text-xl",
      xl: "h-24 px-12 text-2xl",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "relative rounded-lg font-semibold transition-all duration-300 ease-out",
          "shadow-lg hover:shadow-xl active:shadow-md",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          variantStyles[variant],
          sizeStyles[size],
          isHovered && "ring-4 ring-accent ring-offset-2 ring-offset-background scale-105",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center justify-center gap-3 h-full">{children}</div>
      </button>
    )
  },
)
GazeButton.displayName = "GazeButton"

export { GazeButton }
