"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { NewsItem } from "@/lib/database"

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news")
      const data = await response.json()

      if (data.success) {
        setNews(data.news)
      } else {
        setError(data.error || "Ошибка при загрузке новостей")
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Ошибка при загрузке новостей")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка новостей...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-bold">Ошибка</p>
              <p>{error}</p>
            </div>
            <Button onClick={fetchNews} className="mt-4">
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Новости</h1>
            <p className="text-xl text-gray-600">Актуальная информация от управляющей компании</p>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Новостей пока нет</h3>
              <p className="text-gray-500">Новости будут появляться здесь по мере их публикации.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item) => (
                <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{item.title}</CardTitle>
                      <div className="text-sm text-gray-500 ml-4 flex-shrink-0">{formatDate(item.date)}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Автор:</span> {item.author}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.image && (
                      <div className="mb-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button onClick={fetchNews} variant="outline">
              Обновить новости
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
