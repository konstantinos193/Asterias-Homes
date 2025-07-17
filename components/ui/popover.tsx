"use client"

import * as React from "react"

interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function PopoverTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      {children}
    </span>
  )
}

export function PopoverContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`absolute z-50 mt-2 bg-white border rounded shadow-lg ${className || ""}`}
      style={{ minWidth: 200 }}
    >
      {children}
    </div>
  )
}
