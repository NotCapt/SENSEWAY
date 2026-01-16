"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GazeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onActivate?: () => void
}

const GazeCard = React.forwardRef<HTMLDivElement, GazeCardProps>(
  ({ className, onActivate, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-card text-card-foreground p-8 shadow-lg",
          "transition-all duration-300 ease-out cursor-pointer",
          "border-2 border-transparent hover:border-primary",
          isHovered && "ring-4 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-2xl",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onActivate}
        role="button"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    )
  },
)
GazeCard.displayName = "GazeCard"

export { GazeCard }
