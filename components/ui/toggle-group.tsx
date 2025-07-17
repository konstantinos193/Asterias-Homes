"use client"

import * as React from "react"

interface ToggleGroupProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  children: React.ReactNode
  type?: 'single' | 'multiple'
  className?: string
}

const ToggleGroupContext = React.createContext<{
  value: string[]
  onValueChange: (value: string[]) => void
  type: 'single' | 'multiple'
}>({ value: [], onValueChange: () => {}, type: 'multiple' })

export function ToggleGroup({ value, onValueChange, children, type = 'multiple', className = '' }: ToggleGroupProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>([])
  const isControlled = value !== undefined
  const groupValue = isControlled ? value! : internalValue
  const handleValueChange = (val: string[]) => {
    if (!isControlled) setInternalValue(val)
    onValueChange?.(val)
  }
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <ToggleGroupContext.Provider value={{ value: groupValue, onValueChange: handleValueChange, type }}>
        {children}
      </ToggleGroupContext.Provider>
    </div>
  )
}

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

export function ToggleGroupItem({ value, children, className = '', ...props }: ToggleGroupItemProps) {
  const { value: groupValue, onValueChange, type } = React.useContext(ToggleGroupContext)
  const isSelected = groupValue.includes(value)
  const handleClick = () => {
    if (type === 'single') {
      onValueChange(isSelected ? [] : [value])
    } else {
      onValueChange(isSelected ? groupValue.filter((v) => v !== value) : [...groupValue, value])
    }
  }
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`inline-flex items-center justify-center rounded-md px-3 h-10 min-w-10 text-sm font-medium transition-colors bg-transparent hover:bg-gray-100 ${isSelected ? 'bg-blue-600 text-white' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
