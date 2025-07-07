"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, User, ExternalLink, AlertCircle, CheckCircle, Activity } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  description: string
  image?: string
  date: string
  author: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const fetchNews = async () => {
    try {
      setError(null)

      const response = await fetch("/api/news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.news)) {
        setNews(data.news)
        setLastUpdate(new Date().toLocaleTimeString("ru-RU"))
      } else {
        setError(`Неверный формат ответа`)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setError(`Ошибка загрузки: ${String(error)}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNews()
  }

  useEffect(() => {
    fetchNews()

    // Автообновление каждые 10 секунд
    const interval = setInterval(() => {
      fetchNews()
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка новостей...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Новости компании
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Актуальная информация о деятельности управляющей компании
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Обновление..." : "Обновить"}
            </Button>

            {lastUpdate && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Последнее обновление: {lastUpdate}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <div className="flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Автообновление каждые 10 секунд • Всего новостей: {news.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Ошибка загрузки</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
              >
                Попробовать снова
              </Button>
            </div>
          </div>
        )}

        {news.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Новостей пока нет</h3>
              <p className="text-gray-600 mb-4">Новости будут появляться здесь по мере их публикации.</p>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <p className="font-medium mb-1">Следите за обновлениями!</p>
                <p>Страница автоматически обновляется каждые 10 секунд</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12">
            {news.map((item) => (
              <Card
                key={item.id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl overflow-hidden"
              >
                {item.image && (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </CardTitle>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
