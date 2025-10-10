import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'rounded-lg border-4 border-teal-600 bg-gradient-to-b from-teal-800 to-teal-900 text-white shadow-lg font-bold p-4',
            className,
        )}
        {...props}
    />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex flex-col space-y-1 p-2 bg-teal-700 text-white rounded-t-md border-b-2 border-teal-500',
            className,
        )}
        {...props}
    />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'text-lg font-black uppercase tracking-wide text-center text-white',
            className,
        )}
        {...props}
    />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'text-sm text-center font-semibold text-gray-800',
            className,
        )}
        {...props}
    />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-4 text-center font-medium', className)}
        {...props}
    />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex items-center justify-center p-4 pt-0 text-center font-bold',
            className,
        )}
        {...props}
    />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
