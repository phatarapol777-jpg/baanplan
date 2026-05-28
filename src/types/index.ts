export interface Category {
  id: string
  name: string
  name_th: string
  slug: string
  icon?: string
  image_url?: string
  plan_count?: number
}

export interface HousePlan {
  id: string
  title: string
  slug: string
  description?: string
  category_id?: string
  category?: Category
  floors: number
  bedrooms: number
  bathrooms: number
  kitchens: number
  living_rooms: number
  garages: number
  total_area_sqm?: number
  cover_image_url?: string
  is_featured: boolean
  is_available: boolean
  view_count: number
  images?: PlanImage[]
  created_at: string
}

export interface PlanImage {
  id: string
  plan_id: string
  image_url: string
  image_type: "exterior" | "interior" | "floor_plan" | "3d"
  sort_order: number
  alt_text?: string
}

export interface SearchFilters {
  category?: string
  floors?: string
  bedrooms?: string
  search?: string
}
