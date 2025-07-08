import { type NextRequest, NextResponse } from "next/server"
import { getAllNews, createNews, getNewsCount } from "@/lib/database"

export async function GET() {
  try {
    const news = await getAllNews()
    const count = await getNewsCount()

    return NextResponse.json({
      success: true,
      data: news,
      count: count,
    })
  } catch (error) {
    console.error("Error in GET /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация обязательных полей
    if (!body.title || !body.description || !body.author) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, description, author",
        },
        { status: 400 },
      )
    }

    const newsData = {
      title: body.title,
      description: body.description,
      author: body.author,
      date: body.date || new Date().toISOString(),
      image: body.image || null,
    }

    const newNews = await createNews(newsData)

    return NextResponse.json({
      success: true,
      data: newNews,
    })
  } catch (error) {
    console.error("Error in POST /api/news:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create news",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
