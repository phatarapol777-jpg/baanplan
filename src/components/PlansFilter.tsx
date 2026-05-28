"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronDown, X, SlidersHorizontal } from "lucide-react"
import type { Category, SearchFilters } from "@/types"

interface PlansFilterProps {
  categories: Category[]
  currentFilters: SearchFilters
}

export default function PlansFilter({ categories, currentFilters }: PlansFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<SearchFilters>(currentFilters)

  useEffect(() => setFilters(currentFilters), [currentFilters])

  const push = (next: SearchFilters) => {
    const p = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) p.set(k, v) })
    router.push(`${pathname}?${p.toString()}`)
  }

  const set = (key: keyof SearchFilters, val: string) => {
    const next = { ...filters, [key]: val || undefined }
    setFilters(next)
    push(next)
  }

  const clear = () => { setFilters({}); router.push(pathname) }
  const hasActive = Object.values(filters).some(Boolean)

  return (
    <div className="mb-8 p-5 bg-cream rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={15} className="text-ink/40" />
        <span className="text-sm font-semibold text-ink/60">กรองแบบบ้าน</span>
        {hasActive && (
          <button onClick={clear} className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors font-medium">
            <X size={13} /> ล้างทั้งหมด
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Style */}
        <FilterSelect
          label="สไตล์บ้าน"
          value={filters.category ?? ""}
          onChange={v => set("category", v)}
        >
          <option value="">ทุกสไตล์</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name_th}</option>)}
        </FilterSelect>

        {/* Floors */}
        <FilterSelect
          label="จำนวนชั้น"
          value={filters.floors ?? ""}
          onChange={v => set("floors", v)}
        >
          <option value="">ทั้งหมด</option>
          <option value="1">1 ชั้น</option>
          <option value="2">2 ชั้น</option>
          <option value="3">3 ชั้น</option>
        </FilterSelect>

        {/* Bedrooms */}
        <FilterSelect
          label="ห้องนอน"
          value={filters.bedrooms ?? ""}
          onChange={v => set("bedrooms", v)}
        >
          <option value="">ทั้งหมด</option>
          <option value="2">2 ห้อง</option>
          <option value="3">3 ห้อง</option>
          <option value="4">4 ห้อง</option>
          <option value="5">5+ ห้อง</option>
        </FilterSelect>
      </div>
    </div>
  )
}

function FilterSelect({
  label, value, onChange, children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="text-[10px] text-ink/40 uppercase tracking-widest font-semibold block mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink appearance-none focus:outline-none focus:border-gold/50 transition-colors pr-9 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
