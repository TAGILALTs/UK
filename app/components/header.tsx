"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Home,
  Building,
  Wrench,
  FileText,
  Phone,
  BarChart3,
  Mail,
  Newspaper,
  Monitor,
  HelpCircle,
  Info,
} from "lucide-react"
import { Logo } from "./logo"
import { FaTelegramPlane } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const menuItems = [
    { href: "/", label: "Главная", shortLabel: "Главная", icon: Home },
    { href: "/about", label: "О нас", shortLabel: "О нас", icon: Info },
    { href: "/services", label: "Услуги", shortLabel: "Услуги", icon: Wrench },
    { href: "/houses", label: "Дома", shortLabel: "Дома", icon: Building },
    { href: "/documents", label: "Документы", shortLabel: "Документы", icon: FileText },
    { href: "/contacts", label: "Контакты", shortLabel: "Контакты", icon: Mail },
    { href: "/news", label: "Новости", shortLabel: "Новости", icon: Newspaper },
    { href: "/statistics", label: "Статистика", shortLabel: "Статистика", icon: BarChart3 },
    { href: "/useful-phones", label: "Телефоны", shortLabel: "Телефоны", icon: Phone },
    { href: "/domonline", label: "ДомОнлайн", shortLabel: "ДомОнлайн", icon: Monitor },
    { href: "/faq", label: "FAQ", shortLabel: "FAQ", icon: HelpCircle },
  ]

  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMenuItemClick = () => {
    setIsOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-effect shadow-medium" : "bg-white/95 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary leading-tight">ООО Дельта</span>
              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">УК</span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation - скрыто на планшетах и мобильных */}
        <nav className="hidden xl:flex flex-grow justify-center space-x-1">
          {menuItems.slice(0, 8).map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`relative px-2 py-2 text-xs font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
                onClick={handleMenuItemClick}
              >
                {item.shortLabel}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="https://t.me/YKdelta72" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
                <FaTelegramPlane size={18} />
              </Button>
            </Link>
          </motion.div>

          <div className="xl:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="xl:hidden glass-effect border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="container mx-auto px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl font-medium transition-all duration-300 min-h-[70px] ${
                        pathname === item.href
                          ? "text-primary bg-primary/10 shadow-soft"
                          : "text-gray-600 hover:text-primary hover:bg-primary/5"
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      <item.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs text-center leading-tight">{item.shortLabel}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
