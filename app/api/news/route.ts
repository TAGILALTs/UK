import { type NextRequest, NextResponse } from "next/server"

interface NewsItem {
  id: string
  title: string
  description: string
  image?: string
  date: string
  author: string
}

// Инициализируем глобальное хранилище
if (!global.newsStorage) {
  global.newsStorage = [
    {
      id: "welcome",
      title: "Добро пожаловать!",
      description: "Система новостей готова к работе. Теперь вы можете публиковать новости через Telegram бота.",
      date: new Date().toISOString(),
      author: "Система",
    },
  ]
}

export async function GET() {
  try {
    console.log("=== GET /api/news ===")
    console.log("Global storage exists:", !!global.newsStorage)
    console.log("News count:", global.newsStorage ? global.newsStorage.length : 0)

    if (!global.newsStorage) {
      global.newsStorage = [
        {
          id: "welcome",
          title: "Добро пожаловать!",
          description: "Система новостей готова к работе. Теперь вы можете публиковать новости через Telegram бота.",
          date: new Date().toISOString(),
          author: "Система",
        },
      ]
    }

    const news = global.newsStorage.map((item: NewsItem) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      date: item.date,
      author: item.author,
    }))

    console.log("Returning news:", news.length, "items")

    return NextResponse.json({
      success: true,
      news: news,
      count: news.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in GET /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news",
        news: [],
        count: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/news ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { title, description, author, image } = body

    if (!title || !description || !author) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, description, author",
        },
        { status: 400 },
      )
    }

    if (!global.newsStorage) {
      global.newsStorage = []
    }

    const newsId = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newNews: NewsItem = {
      id: newsId,
      title: title.trim(),
      description: description.trim(),
      image: image && typeof image === "string" ? image.trim() : undefined,
      date: new Date().toISOString(),
      author: author.trim(),
    }

    global.newsStorage.unshift(newNews)

    console.log("News added successfully:", newNews)

    return NextResponse.json({
      success: true,
      news: newNews,
      message: "News added successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add news",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("=== PUT /api/news ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { id, title, description, author, image } = body

    if (!id || !title || !description || !author) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: id, title, description, author",
        },
        { status: 400 },
      )
    }

    if (!global.newsStorage) {
      return NextResponse.json(
        {
          success: false,
          error: "News storage not initialized",
        },
        { status: 404 },
      )
    }

    const newsIndex = global.newsStorage.findIndex((news: NewsItem) => news.id === id)

    if (newsIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "News not found",
        },
        { status: 404 },
      )
    }

    const updatedNews: NewsItem = {
      ...global.newsStorage[newsIndex],
      title: title.trim(),
      description: description.trim(),
      image: image && typeof image === "string" ? image.trim() : undefined,
      author: author.trim(),
    }

    global.newsStorage[newsIndex] = updatedNews

    console.log("News updated successfully:", updatedNews)

    return NextResponse.json({
      success: true,
      news: updatedNews,
      message: "News updated successfully",
    })
  } catch (error) {
    console.error("Error in PUT /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update news",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("=== DELETE /api/news ===")

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: id",
        },
        { status: 400 },
      )
    }

    if (!global.newsStorage) {
      return NextResponse.json(
        {
          success: false,
          error: "News storage not initialized",
        },
        { status: 404 },
      )
    }

    if (id === "welcome") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete welcome message",
        },
        { status: 403 },
      )
    }

    const newsIndex = global.newsStorage.findIndex((news: NewsItem) => news.id === id)

    if (newsIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "News not found",
        },
        { status: 404 },
      )
    }

    const deletedNews = global.newsStorage[newsIndex]
    global.newsStorage.splice(newsIndex, 1)

    console.log("News deleted successfully:", deletedNews)

    return NextResponse.json({
      success: true,
      news: deletedNews,
      message: "News deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete news",
      },
      { status: 500 },
    )
  }
}
