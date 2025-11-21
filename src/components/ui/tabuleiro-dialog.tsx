'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/lib/utils'

const TabuleiroDialog = DialogPrimitive.Root

const TabuleiroDialogTrigger = DialogPrimitive.Trigger

const TabuleiroDialogPortal = DialogPrimitive.Portal

const TabuleiroDialogClose = DialogPrimitive.Close

const TabuleiroDialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        className={cn(
            'z-50 w-full h-full bg-background p-6 shadow-lg rounded-lg',
            className,
        )}
        {...props}
    >
        {children}
    </DialogPrimitive.Content>
))
TabuleiroDialogContent.displayName = 'TabuleiroDialogContent'

const TabuleiroDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col space-y-1.5 text-center sm:text-left',
            className,
        )}
        {...props}
    />
)
TabuleiroDialogHeader.displayName = 'TabuleiroDialogHeader'

const TabuleiroDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            className,
        )}
        {...props}
    />
)
TabuleiroDialogFooter.displayName = 'TabuleiroDialogFooter'

const TabuleiroDialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            'text-lg font-semibold leading-none tracking-tight',
            className,
        )}
        {...props}
    />
))
TabuleiroDialogTitle.displayName = 'TabuleiroDialogTitle'

const TabuleiroDialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
))
TabuleiroDialogDescription.displayName = 'TabuleiroDialogDescription'

export {
    TabuleiroDialog,
    TabuleiroDialogPortal,
    TabuleiroDialogTrigger,
    TabuleiroDialogClose,
    TabuleiroDialogContent,
    TabuleiroDialogHeader,
    TabuleiroDialogFooter,
    TabuleiroDialogTitle,
    TabuleiroDialogDescription,
}
