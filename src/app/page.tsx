import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import StatsSection from "@/components/StatsSection"
import CategorySection from "@/components/CategorySection"
import FeaturedSection from "@/components/FeaturedSection"
import HowItWorks from "@/components/HowItWorks"
import Footer from "@/components/Footer"
import { mockCategories, mockPlans, USE_MOCK_DATA } from "@/lib/mockData"
import { getCategories, getHousePlans } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const revalidate = 60 // revalidate ทุก 1 นาที เพื่อให้รูปใหม่แสดงเร็ว

export default async function HomePage() {
  let categories = mockCategories
  let featuredPlans = mockPlans.filter((p) => p.is_featured)
  let heroImageUrl = ""
  let heroFgImageUrl = ""

  if (!USE_MOCK_DATA) {
    try {
      [categories, featuredPlans] = await Promise.all([
        getCategories(),
        getHousePlans({ featured: true, limit: 6 }),
      ])
    } catch {
      // fall through to mock data
    }

    // ดึง hero settings จาก site_settings
    try {
      const { data } = await supabaseAdmin
        .from("site_settings")
        .select("key, value")
        .in("key", ["hero_image_url", "hero_fg_image_url"])
      data?.forEach((row) => {
        if (row.key === "hero_image_url") heroImageUrl = row.value ?? ""
        if (row.key === "hero_fg_image_url") heroFgImageUrl = row.value ?? ""
      })
    } catch {
      // ใช้ default
    }
  }

  return (
    <>
      <Navbar transparent />
      <main>
        <Hero heroImageUrl={heroImageUrl} heroFgImageUrl={heroFgImageUrl} />
        <FeaturedSection plans={featuredPlans} />
        <StatsSection />
        <CategorySection categories={categories} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}
