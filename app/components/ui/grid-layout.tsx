import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GridLayoutProps {
  children: ReactNode
  className?: string
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: "none" | "small" | "default" | "large"
}

export function GridLayout({
  children,
  className,
  columns = { default: 1, md: 2, lg: 3 },
  gap = "default",
  ...props
}: GridLayoutProps) {
  const gapClasses = {
    none: "gap-0",
    small: "gap-4",
    default: "gap-6 md:gap-8",
    large: "gap-8 md:gap-12",
  }

  // Создаем классы для колонок на разных размерах экрана
  const getGridCols = () => {
    const cols = []

    cols.push(`grid-cols-${columns.default}`)
    if (columns.sm) cols.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) cols.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) cols.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) cols.push(`xl:grid-cols-${columns.xl}`)

    return cols.join(" ")
  }

  return (
    <div className={cn("grid", getGridCols(), gapClasses[gap], className)} {...props}>
      {children}
    </div>
  )
}

export default GridLayout
