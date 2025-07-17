"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <React.Fragment>
      {children &&
        React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, { open, onOpenChange })
            : child
        )}
    </React.Fragment>
  )
}

export function SheetTrigger({ onClick, children }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
}

export function SheetClose({ onClick, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClick={onClick} {...props}>
      {children || <X className="h-4 w-4" />}
      <span className="sr-only">Close</span>
    </button>
  )
}

export function SheetContent({
  open,
  onOpenChange,
  side = "right",
  className = "",
  children,
  ...props
}: any) {
  if (!open) return null
  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={() => onOpenChange(false)}
        aria-label="Close sheet overlay"
      />
      <div
        className={`fixed z-50 bg-white p-6 shadow-lg transition-all ${
          side === "right"
            ? "inset-y-0 right-0 w-3/4 sm:max-w-sm border-l"
            : side === "left"
            ? "inset-y-0 left-0 w-3/4 sm:max-w-sm border-r"
            : side === "top"
            ? "inset-x-0 top-0 border-b"
            : "inset-x-0 bottom-0 border-t"
        } ${className}`}
        style={{
          ...(side === "right" && { height: "100%" }),
          ...(side === "left" && { height: "100%" }),
        }}
        {...props}
      >
        {children}
        <SheetClose onClick={() => onOpenChange(false)} />
      </div>
    </>,
    typeof window !== "undefined" ? document.body : (null as any)
  )
}

export function SheetHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props} />
}

export function SheetFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
}

export function SheetTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-lg font-semibold text-foreground ${className}`} {...props} />
}

export function SheetDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props} />
}
