import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        retro: `
            bg-gradient-to-b from-[#c0d8ff] to-[#6b90ff]
            border border-white
            rounded-md
            px-6 py-2
            shadow-[inset_0_2px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.4)]
            text-[#004444]
            font-extrabold tracking-wide
            drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]
            uppercase
            transition-all
            hover:from-[#e6f0ff] hover:to-[#b3ccff]
            hover:shadow-[inset_0_2px_3px_rgba(255,255,255,1),0_3px_6px_rgba(0,0,0,0.4)]
        `,
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "retro",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
