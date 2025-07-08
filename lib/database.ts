import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface NewsItem {
  id: string
  title: string
  description: string
  image?: string
  date: string
  author: string
  created_at?: string
  updated_at?: string
}

export class NewsDatabase {
  // Получить все новости
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching news:", error)
        throw new Error(`Failed to fetch news: ${error.message}`)
      }

      return (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        image: row.image || undefined,
        date: row.date,
        author: row.author,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    } catch (error) {
      console.error("Error fetching news:", error)
      throw new Error(`Failed to fetch news: ${error}`)
    }
  }

  // Добавить новость
  static async addNews(title: string, description: string, author: string, image?: string): Promise<NewsItem> {
    try {
      const newsId = `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()

      const newsData = {
        id: newsId,
        title: title.trim(),
        description: description.trim(),
        image: image || null,
        author: author.trim(),
        date: now,
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await supabase.from("news").insert([newsData]).select().single()

      if (error) {
        console.error("Supabase error adding news:", error)
        throw new Error(`Failed to add news: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from insert")
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || undefined,
        date: data.date,
        author: data.author,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("Error adding news:", error)
      throw new Error(`Failed to add news: ${error}`)
    }
  }

  // Обновить новость
  static async updateNews(
    id: string,
    title: string,
    description: string,
    author: string,
    image?: string,
  ): Promise<NewsItem> {
    try {
      const now = new Date().toISOString()

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        image: image || null,
        author: author.trim(),
        updated_at: now,
      }

      const { data, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Supabase error updating news:", error)
        throw new Error(`Failed to update news: ${error.message}`)
      }

      if (!data) {
        throw new Error("News not found")
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || undefined,
        date: data.date,
        author: data.author,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("Error updating news:", error)
      throw new Error(`Failed to update news: ${error}`)
    }
  }

  // Удалить новость
  static async deleteNews(id: string): Promise<NewsItem> {
    try {
      if (id === "welcome") {
        throw new Error("Cannot delete welcome message")
      }

      const { data, error } = await supabase.from("news").delete().eq("id", id).select().single()

      if (error) {
        console.error("Supabase error deleting news:", error)
        throw new Error(`Failed to delete news: ${error.message}`)
      }

      if (!data) {
        throw new Error("News not found")
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || undefined,
        date: data.date,
        author: data.author,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      throw new Error(`Failed to delete news: ${error}`)
    }
  }

  // Получить новость по ID
  static async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Supabase error fetching news by ID:", error)
        throw new Error(`Failed to fetch news: ${error.message}`)
      }

      if (!data) {
        return null
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || undefined,
        date: data.date,
        author: data.author,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (error) {
      console.error("Error fetching news by ID:", error)
      throw new Error(`Failed to fetch news: ${error}`)
    }
  }

  // Получить количество новостей
  static async getNewsCount(): Promise<number> {
    try {
      const { count, error } = await supabase.from("news").select("*", { count: "exact", head: true })

      if (error) {
        console.error("Supabase error getting news count:", error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error("Error getting news count:", error)
      return 0
    }
  }

  // Получить список новостей для Telegram
  static async getNewsListForTelegram(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("id, title")
        .neq("id", "welcome")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error getting news list:", error)
        throw new Error(`Failed to get news list: ${error.message}`)
      }

      return (data || []).map((row, index) => `${index + 1}. ${row.title} (ID: ${row.id})`)
    } catch (error) {
      console.error("Error getting news list for Telegram:", error)
      return []
    }
  }

  // Проверить подключение к базе данных
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("news").select("count", { count: "exact", head: true })

      if (error) {
        console.error("Database connection test failed:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Database connection test error:", error)
      return false
    }
  }
}
