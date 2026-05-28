import Link from "next/link"
import { notFound } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockPlans, USE_MOCK_DATA } from "@/lib/mockData"
import PlanForm from "@/components/admin/PlanForm"
import { ChevronLeft } from "lucide-react"

export const metadata = { title: "แก้ไขแบบบ้าน — Admin" }

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let plan: {
    id: string; title: string; slug: string; description: string
    category_id: string | null; floors: number; bedrooms: number
    bathrooms: number; kitchens: number; living_rooms: number
    garages: number; total_area_sqm: number | null
    cover_image_url: string | null; is_featured: boolean; is_available: boolean
  } | null = null

  let extraImages: Array<{ id: string; image_url: string; image_type: string; sort_order: number }> = []

  if (!USE_MOCK_DATA) {
    const [{ data: planData }, { data: images }] = await Promise.all([
      supabaseAdmin
        .from("house_plans")
        .select("id, title, slug, description, category_id, floors, bedrooms, bathrooms, kitchens, living_rooms, garages, total_area_sqm, cover_image_url, is_featured, is_available")
        .eq("id", id)
        .single(),
      supabaseAdmin
        .from("plan_images")
        .select("id, image_url, image_type, sort_order")
        .eq("plan_id", id)
        .order("sort_order"),
    ])
    plan = planData
    extraImages = (images ?? []) as typeof extraImages
  } else {
    const mock = mockPlans.find(p => p.id === id)
    if (mock) {
      plan = {
        id: mock.id,
        title: mock.title,
        slug: mock.slug,
        description: mock.description ?? "",
        category_id: mock.category_id ?? null,
        floors: mock.floors,
        bedrooms: mock.bedrooms,
        bathrooms: mock.bathrooms,
        kitchens: mock.kitchens ?? 1,
        living_rooms: mock.living_rooms ?? 1,
        garages: mock.garages ?? 0,
        total_area_sqm: mock.total_area_sqm ?? null,
        cover_image_url: mock.cover_image_url ?? null,
        is_featured: mock.is_featured,
        is_available: mock.is_available,
      }
    }
  }

  if (!plan) notFound()

  const initialData = {
    title: plan.title,
    slug: plan.slug,
    description: plan.description,
    category_id: plan.category_id ?? "",
    floors: plan.floors,
    bedrooms: plan.bedrooms,
    bathrooms: plan.bathrooms,
    kitchens: plan.kitchens,
    living_rooms: plan.living_rooms,
    garages: plan.garages,
    total_area_sqm: plan.total_area_sqm?.toString() ?? "",
    cover_image_url: plan.cover_image_url ?? "",
    is_featured: plan.is_featured,
    is_available: plan.is_available,
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/plans" className="inline-flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink transition-colors mb-4">
          <ChevronLeft size={16} /> กลับ
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink">แก้ไขแบบบ้าน</h1>
        <p className="text-ink/40 text-sm mt-1 font-mono">{plan.slug}</p>
      </div>
      <PlanForm planId={id} initialData={initialData} initialImages={extraImages} />
    </div>
  )
}
