import { createClient } from "@supabase/supabase-js"

// ใช้ placeholder ถ้าไม่มี env vars — USE_MOCK_DATA จะป้องกันไม่ให้ call จริง
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_th")
  if (error) throw error
  return data
}

export async function getHousePlans(filters?: {
  category_slug?: string
  floors?: number
  bedrooms?: number
  search?: string
  featured?: boolean
  limit?: number
}) {
  let query = supabase
    .from("house_plans")
    .select("*, category:categories(*)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })

  if (filters?.featured) query = query.eq("is_featured", true)
  if (filters?.floors) query = query.eq("floors", filters.floors)
  if (filters?.bedrooms) query = query.eq("bedrooms", filters.bedrooms)
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`)
  if (filters?.limit) query = query.limit(filters.limit)

  if (filters?.category_slug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category_slug)
      .single()
    if (cat) query = query.eq("category_id", cat.id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getHousePlanBySlug(slug: string) {
  const { data, error } = await supabase
    .from("house_plans")
    .select("*, category:categories(*), images:plan_images(*)")
    .eq("slug", slug)
    .single()
  if (error) throw error
  return data
}
