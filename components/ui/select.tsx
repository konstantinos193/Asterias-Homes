"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  options: Map<string, React.ReactNode>
  setOptions: (options: Map<string, React.ReactNode>) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface SelectProps {
  children: React.ReactNode
  value: string
  onValueChange: (value: string) => void
}

export function Select({ children, value, onValueChange }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState(new Map<string, React.ReactNode>())

  React.useEffect(() => {
    const handleClickOutside = () => setOpen(false)
    if (open) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, options, setOptions }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "", ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within Select')

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        context.setOpen(!context.open)
      }}
      className={`w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-slate-300 rounded-md shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  )
}

export function SelectContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within Select')

  if (!context.open) return null

  return (
    <div
      className={`absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectItem({ children, value, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')

  const isSelected = context.value === value

  // Register this option with its display text
  React.useEffect(() => {
    const newOptions = new Map(context.options)
    newOptions.set(value, children)
    context.setOptions(newOptions)
  }, [value, children, context])

  return (
    <div
      className={`px-3 py-2 cursor-pointer hover:bg-slate-100 ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        context.onValueChange(value)
        context.setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectValue({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within Select')

  // If children are provided, use them
  if (children) return <>{children}</>
  
  // Get the display text for the selected value
  if (context.value && context.options.has(context.value)) {
    const selectedText = context.options.get(context.value)
    return <>{selectedText}</>
  }
  
  // Fallback to placeholder
  return <span className="text-slate-500">{placeholder}</span>
}
