"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category } from "@/types"

const categoryConfig: Record<string, { gradient: string; textColor: string }> = {
  modern:        { gradient: "from-slate-700 via-slate-600 to-slate-500",        textColor: "text-white" },
  tropical:      { gradient: "from-emerald-700 via-emerald-500 to-teal-400",     textColor: "text-white" },
  contemporary:  { gradient: "from-zinc-600 via-zinc-500 to-zinc-400",           textColor: "text-white" },
  thai:          { gradient: "from-amber-700 via-amber-500 to-yellow-400",       textColor: "text-white" },
  loft:          { gradient: "from-stone-700 via-stone-600 to-stone-500",        textColor: "text-white" },
  minimalist:    { gradient: "from-gray-500 via-gray-400 to-gray-300",           textColor: "text-white" },
}

const categoryIcons: Record<string, string> = {
  modern:       "▣",
  tropical:     "❋",
  contemporary: "◈",
  thai:         "⌂",
  loft:         "⚙",
  minimalist:   "□",
}

interface CategorySectionProps {
  categories: Category[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">เลือกตามไลฟ์สไตล์</p>
            <h2 className="section-heading">หมวดหมู่สไตล์บ้าน</h2>
          </div>
          {/* Arrow buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-ink/60 hover:text-ink hover:border-ink/30 hover:shadow-md transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-ink/60 hover:text-ink hover:border-ink/30 hover:shadow-md transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const cfg = categoryConfig[cat.slug] ?? { gradient: "from-gray-500 to-gray-600", textColor: "text-white" }
            const icon = categoryIcons[cat.slug] ?? "⌂"
            return (
              <Link
                key={cat.id}
                href={`/plans?category=${cat.slug}`}
                className="group flex-shrink-0 relative rounded-3xl overflow-hidden cursor-pointer"
                style={{ width: "300px", height: "420px", scrollSnapAlign: "start" }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${cfg.gradient} transition-transform duration-500 group-hover:scale-105`} />

                {/* Big icon center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl text-white/10 font-bold select-none transition-transform duration-500 group-hover:scale-110">
                    {icon}
                  </span>
                </div>

                {/* Overlay gradient bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Plan count badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-semibold">{cat.plan_count ?? 0} แบบ</span>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">สไตล์บ้าน</p>
                  <h3 className="text-white font-display font-bold text-2xl leading-tight">
                    {cat.name_th}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                    <span>ดูแบบบ้าน</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile arrows */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-ink/60 hover:text-ink transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-ink/60 hover:text-ink transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
