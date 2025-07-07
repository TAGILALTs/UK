import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionBlockProps {
  children: ReactNode
  className?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
  align?: "left" | "center" | "right"
  spacing?: "none" | "small" | "default" | "large"
  titleClassName?: string
  subtitleClassName?: string
  contentClassName?: string
}

export function SectionBlock({
  children,
  className,
  title,
  subtitle,
  align = "left",
  spacing = "default",
  titleClassName,
  subtitleClassName,
  contentClassName,
  ...props
}: SectionBlockProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  const spacingClasses = {
    none: "mb-0",
    small: "mb-4 md:mb-6",
    default: "mb-8 md:mb-12",
    large: "mb-12 md:mb-16",
  }

  return (
    <div className={cn("w-full", spacingClasses[spacing], className)} {...props}>
      {title && (
        <h2 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold mb-4", alignClasses[align], titleClassName)}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn("text-lg md:text-xl text-muted-foreground mb-6", alignClasses[align], subtitleClassName)}>
          {subtitle}
        </p>
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </div>
  )
}
