'use client'

import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'

    const variants = {
      primary:
        'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-glow-sm hover:shadow-glow-md',
      secondary:
        'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700 hover:border-dark-600',
      outline:
        'bg-transparent hover:bg-white/5 text-white border-2 border-accent-blue hover:border-accent-cyan',
      ghost:
        'bg-transparent hover:bg-white/5 text-white',
      gradient:
        'bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple hover:shadow-glow-lg text-white relative overflow-hidden group',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    // If asChild is true, clone the child and pass props to it
    if (asChild && children) {
      const child = children as React.ReactElement
      return (
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className="inline-block"
        >
          {React.cloneElement(child, {
            className: cn(child.props.className, classes),
            ...props,
          } as any)}
        </motion.div>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        {...props}
      >
        {variant === 'gradient' && (
          <span className="absolute inset-0 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : leftIcon ? (
            leftIcon
          ) : null}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
