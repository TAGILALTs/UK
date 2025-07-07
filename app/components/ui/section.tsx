import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  background?: "white" | "gray" | "primary" | "secondary" | "gradient"
  containerWidth?: "default" | "narrow" | "wide" | "full"
  paddingY?: "none" | "small" | "default" | "large"
}

export function Section({
  children,
  className,
  id,
  background = "white",
  containerWidth = "default",
  paddingY = "default",
  ...props
}: SectionProps) {
  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-primary text-white",
    secondary: "bg-secondary",
    gradient: "bg-gradient-to-b from-primary/20 to-white",
  }

  const containerClasses = {
    default: "container mx-auto px-4",
    narrow: "container mx-auto px-4 max-w-4xl",
    wide: "container mx-auto px-4 max-w-7xl",
    full: "w-full px-4",
  }

  const paddingClasses = {
    none: "py-0",
    small: "py-6 md:py-8",
    default: "py-10 md:py-16",
    large: "py-16 md:py-24",
  }

  return (
    <section id={id} className={cn(backgroundClasses[background], className)} {...props}>
      <div className={cn(containerClasses[containerWidth], paddingClasses[paddingY])}>{children}</div>
    </section>
  )
}
