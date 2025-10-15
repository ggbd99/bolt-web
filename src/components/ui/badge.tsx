import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-indigo-600 text-white": variant === "default",
          "border border-zinc-700 text-zinc-300": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
