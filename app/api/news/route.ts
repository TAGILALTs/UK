import { type NextRequest, NextResponse } from "next/server"
import { NewsDatabase } from "@/lib/database"

export async function GET() {
  try {
    console.log("=== GET /api/news ===")

    const news = await NewsDatabase.getAllNews()
    const count = news.length

    console.log("Returning news:", count, "items")

    return NextResponse.json({
      success: true,
      news: news,
      count: count,
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
        details: String(error),
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

    const newNews = await NewsDatabase.addNews(
      title.trim(),
      description.trim(),
      author.trim(),
      image && typeof image === "string" ? image.trim() : undefined,
    )

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
        details: String(error),
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

    const updatedNews = await NewsDatabase.updateNews(
      id,
      title.trim(),
      description.trim(),
      author.trim(),
      image && typeof image === "string" ? image.trim() : undefined,
    )

    console.log("News updated successfully:", updatedNews)

    return NextResponse.json({
      success: true,
      news: updatedNews,
      message: "News updated successfully",
    })
  } catch (error) {
    console.error("Error in PUT /api/news:", error)

    const errorMessage = String(error)
    const statusCode = errorMessage.includes("not found") ? 404 : 500

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update news",
        details: errorMessage,
      },
      { status: statusCode },
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

    const deletedNews = await NewsDatabase.deleteNews(id)

    console.log("News deleted successfully:", deletedNews)

    return NextResponse.json({
      success: true,
      news: deletedNews,
      message: "News deleted successfully",
    })
  } catch (error) {
    console.error("Error in DELETE /api/news:", error)

    const errorMessage = String(error)
    let statusCode = 500

    if (errorMessage.includes("not found")) {
      statusCode = 404
    } else if (errorMessage.includes("Cannot delete welcome")) {
      statusCode = 403
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete news",
        details: errorMessage,
      },
      { status: statusCode },
    )
  }
}
