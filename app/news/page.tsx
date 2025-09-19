"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, User, Search, ArrowLeft, Newspaper } from "lucide-react"
import Link from "next/link"
import type { NewsItem } from "@/lib/database"

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setNews(result.data)
            setFilteredNews(result.data)
          }
        }
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredNews(filtered)
    } else {
      setFilteredNews(news)
    }
  }, [searchTerm, news])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Неизвестная дата"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка новостей...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                На главную
              </Link>
            </Button>
            <Badge variant="secondary" className="text-sm">
              <Newspaper className="h-4 w-4 mr-1" />
              Всего новостей: {news.length}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Новости компании</h1>
          <p className="text-xl text-gray-600 mb-6">
            Актуальная информация о деятельности управляющей компании ООО "ДЕЛЬТА"
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Поиск новостей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "Новости не найдены" : "Новостей пока нет"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Попробуйте изменить поисковый запрос"
                : "Новости будут появляться здесь по мере их добавления"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {item.image && (
                  <div className="relative h-48">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                    <span className="line-clamp-2 break-words">{item.title}</span>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.author}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed break-words">
                    <span className="line-clamp-4">{item.description}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to top */}
        {filteredNews.length > 6 && (
          <div className="text-center mt-12">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} variant="outline">
              Наверх
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
