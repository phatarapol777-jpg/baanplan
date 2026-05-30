"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import type { Category } from "@/types"

const categoryConfig: Record<string, { gradient: string }> = {
  modern:       { gradient: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #4a9eda 100%)" },
  tropical:     { gradient: "linear-gradient(135deg, #1a4731 0%, #2d8653 50%, #52c17a 100%)" },
  contemporary: { gradient: "linear-gradient(135deg, #2d2d2d 0%, #555 50%, #888 100%)" },
  thai:         { gradient: "linear-gradient(135deg, #7c3d00 0%, #c4620a 50%, #f0a030 100%)" },
  loft:         { gradient: "linear-gradient(135deg, #3b2a1a 0%, #6b4c30 50%, #a07850 100%)" },
  minimalist:   { gradient: "linear-gradient(135deg, #2a2a3e 0%, #4a4a6a 50%, #7a7aaa 100%)" },
}

const categoryIcons: Record<string, string> = {
  modern: "▣", tropical: "❋", contemporary: "◈",
  thai: "⌂", loft: "⚙", minimalist: "□",
}

interface CategorySectionProps {
  categories: Category[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const [active, setActive] = useState(Math.floor(categories.length / 2))

  const prev = () => setActive(i => (i - 1 + categories.length) % categories.length)
  const next = () => setActive(i => (i + 1) % categories.length)

  // เรียงการ์ดโดยให้ active อยู่กลาง
  const getOrder = (idx: number) => {
    const diff = idx - active
    const len = categories.length
    const wrapped = ((diff + Math.floor(len / 2)) % len) - Math.floor(len / 2)
    return wrapped // -n ... 0 ... +n
  }

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-2">เลือกตามไลฟ์สไตล์</p>
          <h2 className="section-heading">หมวดหมู่สไตล์บ้าน</h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center" style={{ height: "500px" }}>

          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute left-0 z-20 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-ink hover:scale-105 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards */}
          <div className="relative w-full h-full flex items-center justify-center">
            {categories.map((cat, idx) => {
              const order = getOrder(idx)
              const isActive = order === 0
              const isVisible = Math.abs(order) <= 2

              if (!isVisible) return null

              const cfg = categoryConfig[cat.slug] ?? { gradient: "linear-gradient(135deg,#333,#666)" }

              // คำนวณ position, scale, opacity
              const xOffset = order * 280   // ระยะห่างระหว่างการ์ด
              const scale   = isActive ? 1 : Math.abs(order) === 1 ? 0.82 : 0.68
              const opacity = isActive ? 1 : Math.abs(order) === 1 ? 0.75 : 0.45
              const zIndex  = isActive ? 10 : Math.abs(order) === 1 ? 5 : 1

              return (
                <div
                  key={cat.id}
                  onClick={() => !isActive && setActive(idx)}
                  className="absolute rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    width: "320px",
                    height: "440px",
                    transform: `translateX(${xOffset}px) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {/* Background */}
                  <div className="absolute inset-0" style={{ background: cfg.gradient }} />

                  {/* Big icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] text-white/10 font-bold select-none leading-none">
                      {categoryIcons[cat.slug] ?? "⌂"}
                    </span>
                  </div>

                  {/* Dark overlay bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  {/* Badge plan count */}
                  <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-semibold">{cat.plan_count ?? 0} แบบ</span>
                  </div>

                  {/* Arrow icon top-right (active only) */}
                  {isActive && (
                    <Link
                      href={`/plans?category=${cat.slug}`}
                      onClick={e => e.stopPropagation()}
                      className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                      <ArrowUpRight size={18} className="text-white" />
                    </Link>
                  )}

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest mb-1">สไตล์บ้าน</p>
                    <h3 className="text-white font-display font-bold text-2xl">{cat.name_th}</h3>
                    {isActive && (
                      <Link
                        href={`/plans?category=${cat.slug}`}
                        onClick={e => e.stopPropagation()}
                        className="mt-4 inline-flex items-center gap-2 bg-white text-ink text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
                      >
                        ดูแบบบ้าน <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute right-0 z-20 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-ink hover:scale-105 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === active
                  ? "w-6 h-2.5 bg-ink"
                  : "w-2.5 h-2.5 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
