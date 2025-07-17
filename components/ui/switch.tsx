"use client"

import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", ...props }, ref) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
      <input
        type="checkbox"
        ref={ref}
        className={`sr-only ${className}`}
        {...props}
      />
      <span
        style={{
          display: 'inline-block',
          width: 44,
          height: 24,
          background: props.checked ? '#2563eb' : '#e5e7eb',
          borderRadius: 9999,
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: props.checked ? 22 : 2,
            top: 2,
            width: 20,
            height: 20,
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'left 0.2s',
          }}
        />
      </span>
    </label>
  )
)
Switch.displayName = "Switch"
