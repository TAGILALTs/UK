import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface NewsItem {
  id: number
  title: string
  description: string
  date: string
  author: string
  image?: string
  created_at: string
  updated_at: string
}

export async function getAllNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    throw error
  }

  return data || []
}

export async function getNewsById(id: number): Promise<NewsItem | null> {
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching news by id:", error)
    return null
  }

  return data
}

export async function createNews(news: Omit<NewsItem, "id" | "created_at" | "updated_at">): Promise<NewsItem> {
  const { data, error } = await supabase.from("news").insert([news]).select().single()

  if (error) {
    console.error("Error creating news:", error)
    throw error
  }

  return data
}

export async function updateNews(
  id: number,
  updates: Partial<Omit<NewsItem, "id" | "created_at" | "updated_at">>,
): Promise<NewsItem> {
  const { data, error } = await supabase.from("news").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating news:", error)
    throw error
  }

  return data
}

export async function deleteNews(id: number): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    console.error("Error deleting news:", error)
    throw error
  }
}

export async function getNewsCount(): Promise<number> {
  const { count, error } = await supabase.from("news").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error getting news count:", error)
    return 0
  }

  return count || 0
}
