"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SubsectionItem {
  id: string
  title: string
}

interface SubsectionNavProps {
  section: string
  subsections: SubsectionItem[]
  className?: string
}

export function SubsectionNav({ section, subsections, className }: SubsectionNavProps) {
  const pathname = usePathname()
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Функция для обработки изменения хэша
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash && subsections.some((sub) => sub.id === hash)) {
        setActiveSubsection(hash)
      }
    }

    // Проверяем хэш при монтировании
    const hash = window.location.hash.replace("#", "")
    if (hash && subsections.some((sub) => sub.id === hash)) {
      setActiveSubsection(hash)
    } else {
      // Если нет хэша, устанавливаем первый подраздел как активный
      setActiveSubsection(subsections[0]?.id || null)
    }

    // Добавляем слушатель для изменения хэша
    window.addEventListener("hashchange", handleHashChange)

    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [pathname, subsections])

  const handleSubsectionClick = (id: string) => {
    setActiveSubsection(id)
    setIsOpen(false)

    // Плавная прокрутка к элементу
    const element = document.getElementById(id)
    if (element) {
      // Используем scrollIntoView с опцией behavior: "smooth"
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Обновляем URL с хэшем без перезагрузки страницы
    window.history.pushState(null, "", `#${id}`)
  }

  const activeSubsectionTitle = subsections.find((sub) => sub.id === activeSubsection)?.title || "Выберите раздел"

  return (
    <div className={cn("mb-8", className)}>
      {/* Мобильная навигация (выпадающий список) */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
        >
          <span>{activeSubsectionTitle}</span>
          <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen && "transform rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
            {subsections.map((subsection) => (
              <button
                key={subsection.id}
                className={cn(
                  "block w-full text-left px-4 py-2 hover:bg-gray-100",
                  activeSubsection === subsection.id && "bg-primary/10 text-primary font-medium",
                )}
                onClick={() => handleSubsectionClick(subsection.id)}
              >
                {subsection.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Десктопная навигация (горизонтальные табы) */}
      <div className="hidden md:flex overflow-x-auto space-x-2 border-b">
        {subsections.map((subsection) => (
          <button
            key={subsection.id}
            className={cn(
              "px-4 py-2 whitespace-nowrap hover:text-primary transition-colors",
              activeSubsection === subsection.id
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-gray-600",
            )}
            onClick={() => handleSubsectionClick(subsection.id)}
          >
            {subsection.title}
          </button>
        ))}
      </div>
    </div>
  )
}
