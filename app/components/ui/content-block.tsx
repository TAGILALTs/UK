import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ContentBlockProps {
  children: ReactNode
  className?: string
  padding?: "none" | "small" | "default" | "large"
  background?: "none" | "white" | "gray" | "primary" | "secondary"
  rounded?: boolean
  shadow?: boolean
  border?: boolean
}

export function ContentBlock({
  children,
  className,
  padding = "default",
  background = "none",
  rounded = true,
  shadow = false,
  border = false,
  ...props
}: ContentBlockProps) {
  const paddingClasses = {
    none: "p-0",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  }

  const backgroundClasses = {
    none: "",
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-primary text-white",
    secondary: "bg-secondary",
  }

  return (
    <div
      className={cn(
        paddingClasses[padding],
        backgroundClasses[background],
        rounded && "rounded-lg",
        shadow && "shadow-md",
        border && "border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
