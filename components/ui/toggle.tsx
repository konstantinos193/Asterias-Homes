"use client"

import * as React from "react"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className = "", pressed, onPressedChange, children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(false)
    const isControlled = pressed !== undefined
    const isPressed = isControlled ? pressed : internalPressed
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) setInternalPressed((p) => !p)
      onPressedChange?.(!isPressed)
      props.onClick?.(e)
    }
    return (
      <button
        ref={ref}
        aria-pressed={isPressed}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium px-3 h-10 min-w-10 transition-colors bg-transparent hover:bg-gray-100 ${isPressed ? 'bg-blue-600 text-white' : ''} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Toggle.displayName = "Toggle"
