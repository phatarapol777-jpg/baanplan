import { Suspense } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PlanCard from "@/components/PlanCard"
import PlansFilter from "@/components/PlansFilter"
import { mockPlans, mockCategories, USE_MOCK_DATA } from "@/lib/mockData"
import { getHousePlans, getCategories } from "@/lib/supabase"
import type { SearchFilters } from "@/types"

export const revalidate = 3600

export default async function PlansPage({ searchParams }: { searchParams: Promise<SearchFilters> }) {
  const filters = await searchParams
  let plans = mockPlans
  let categories = mockCategories

  if (!USE_MOCK_DATA) {
    try {
      categories = await getCategories()
      plans = await getHousePlans({
        category_slug: filters.category,
        floors: filters.floors ? parseInt(filters.floors) : undefined,
        bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
        search: filters.search,
      })
    } catch {
      // fall through
    }
  } else {
    if (filters.category) plans = plans.filter(p => p.category?.slug === filters.category)
    if (filters.floors) plans = plans.filter(p => p.floors === parseInt(filters.floors!))
    if (filters.bedrooms) plans = plans.filter(p => p.bedrooms === parseInt(filters.bedrooms!))
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[70px]">
        <div className="bg-cream border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p className="section-label mb-1">เลือกได้ตามใจชอบ</p>
            <h1 className="section-heading">แบบบ้านทั้งหมด</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <Suspense fallback={null}>
            <PlansFilter categories={categories} currentFilters={filters} />
          </Suspense>

          {plans.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-5">🏠</p>
              <h3 className="font-display text-xl text-ink mb-2">ไม่พบแบบบ้าน</h3>
              <p className="text-ink/50">ลองเปลี่ยนตัวกรองใหม่</p>
            </div>
          ) : (
            <>
              <p className="text-ink/40 text-sm mb-6">พบ {plans.length} แบบบ้าน</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
