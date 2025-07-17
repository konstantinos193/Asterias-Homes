"use client"

import * as React from "react"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = "", ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
      {...props}
    />
  )
)
Slider.displayName = "Slider"
