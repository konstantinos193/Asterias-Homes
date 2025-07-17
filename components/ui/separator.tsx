"use client"

import * as React from "react"

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement | HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ orientation = "horizontal", className = "", ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          role="separator"
          aria-orientation="vertical"
          className={`w-px h-full bg-gray-200 ${className}`}
          {...props}
        />
      )
    }
    return (
      <hr
        ref={ref as React.RefObject<HTMLHRElement>}
        role="separator"
        aria-orientation="horizontal"
        className={`h-px w-full bg-gray-200 border-0 ${className}`}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"
