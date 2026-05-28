import Link from "next/link"
import PlanCard from "./PlanCard"
import type { HousePlan } from "@/types"

interface FeaturedSectionProps {
  plans: HousePlan[]
}

export default function FeaturedSection({ plans }: FeaturedSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">คัดสรรโดยทีมงาน</p>
            <h2 className="section-heading">แบบบ้านแนะนำ</h2>
          </div>
          <Link
            href="/plans"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50 hover:text-ink transition-colors"
          >
            ดูทั้งหมด <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-10">
          <Link href="/plans" className="btn-outline-dark">ดูแบบบ้านทั้งหมด</Link>
        </div>
      </div>
    </section>
  )
}
