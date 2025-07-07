import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SubsectionProps {
  id: string
  title?: string
  children: ReactNode
  className?: string
}

export function Subsection({ id, title, children, className }: SubsectionProps) {
  return (
    <div id={id} className={cn("scroll-mt-20 mb-12", className)}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {children}
    </div>
  )
}
