import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import StatsSection from "@/components/StatsSection"
import CategorySection from "@/components/CategorySection"
import FeaturedSection from "@/components/FeaturedSection"
import HowItWorks from "@/components/HowItWorks"
import Footer from "@/components/Footer"
import { mockCategories, mockPlans, USE_MOCK_DATA } from "@/lib/mockData"
import { getCategories, getHousePlans } from "@/lib/supabase"

export const revalidate = 3600

export default async function HomePage() {
  let categories = mockCategories
  let featuredPlans = mockPlans.filter((p) => p.is_featured)

  if (!USE_MOCK_DATA) {
    try {
      categories = await getCategories()
      featuredPlans = await getHousePlans({ featured: true, limit: 6 })
    } catch {
      // fall through to mock data
    }
  }

  return (
    <>
      <Navbar transparent />
      <main>
        <Hero />
        <FeaturedSection plans={featuredPlans} />
        <StatsSection />
        <CategorySection categories={categories} />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}
