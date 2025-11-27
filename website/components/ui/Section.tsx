'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Container } from './Container'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'gradient' | 'dark'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = 'default',
      spacing = 'lg',
      containerSize = 'lg',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: '',
      gradient: 'animated-gradient',
      dark: 'bg-dark-900/30',
    }

    const spacings = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-20',
      lg: 'py-20 md:py-28',
      xl: 'py-28 md:py-36',
    }

    return (
      <motion.section
        ref={ref}
        className={cn('relative', variants[variant], spacings[spacing], className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        {...props}
      >
        <Container size={containerSize}>{children}</Container>
      </motion.section>
    )
  }
)

Section.displayName = 'Section'

export const SectionHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-center max-w-3xl mx-auto mb-12 md:mb-16', className)}
      {...props}
    />
  )
)

SectionHeader.displayName = 'SectionHeader'

export const SectionTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 md:mb-6',
        className
      )}
      {...props}
    />
  )
)

SectionTitle.displayName = 'SectionTitle'

export const SectionDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-lg md:text-xl text-dark-400', className)}
      {...props}
    />
  )
)

SectionDescription.displayName = 'SectionDescription'
