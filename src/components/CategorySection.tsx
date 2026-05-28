import Link from "next/link"
import type { Category } from "@/types"

const categoryColors: Record<string, string> = {
  modern: "from-slate-200 to-slate-300",
  tropical: "from-emerald-100 to-emerald-200",
  contemporary: "from-zinc-200 to-zinc-300",
  thai: "from-amber-100 to-amber-200",
  loft: "from-stone-200 to-stone-300",
  minimalist: "from-gray-100 to-gray-200",
}

const categoryIcons: Record<string, string> = {
  modern: "▣",
  tropical: "❋",
  contemporary: "◈",
  thai: "⌂",
  loft: "⚙",
  minimalist: "□",
}

interface CategorySectionProps {
  categories: Category[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="text-center mb-14">
          <p className="section-label mb-2">เลือกตามไลฟ์สไตล์</p>
          <h2 className="section-heading">หมวดหมู่สไตล์บ้าน</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/plans?category=${cat.slug}`}
              className="group block"
            >
              <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                {/* Image area */}
                <div className={`h-28 bg-gradient-to-br ${categoryColors[cat.slug] ?? "from-gray-100 to-gray-200"} flex items-center justify-center text-4xl text-ink/20 font-bold`}>
                  {categoryIcons[cat.slug] ?? "⌂"}
                </div>
                {/* Label */}
                <div className="bg-white px-4 py-3">
                  <p className="font-display font-semibold text-ink text-sm group-hover:text-gold transition-colors">
                    {cat.name_th}
                  </p>
                  <p className="text-ink/40 text-xs mt-0.5">{cat.plan_count ?? 0} แบบ</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
