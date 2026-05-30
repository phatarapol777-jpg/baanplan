"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"

// Fallback รูป default (ถ้ายังไม่ได้ตั้งค่าใน Admin)
const DEFAULT_HERO_IMAGE = "https://baanplan-cdn.b-cdn.net/LINE_ALBUM_clear%20Logo%20Bogie_260515_2.jpg"

const styles = [
  { label: "ทุกสไตล์", value: "" },
  { label: "โมเดิร์น", value: "modern" },
  { label: "ทรอปิคอล", value: "tropical" },
  { label: "คอนเทมโพรารี", value: "contemporary" },
  { label: "ไทยประยุกต์", value: "thai" },
  { label: "ลอฟต์", value: "loft" },
  { label: "มินิมอล", value: "minimalist" },
]

const floorOptions = [
  { label: "ทุกขนาด", value: "" },
  { label: "1 ชั้น", value: "1" },
  { label: "ชั้นครึ่ง", value: "1.5" },
  { label: "2 ชั้น", value: "2" },
]

interface HeroProps {
  heroImageUrl?: string
  heroFgImageUrl?: string  // PNG ตัดพื้นหลัง วางหน้าตัวอักษร
}

export default function Hero({ heroImageUrl, heroFgImageUrl }: HeroProps) {
  const router = useRouter()
  const [style, setStyle] = useState("")
  const [floors, setFloors] = useState("")

  const bgImage = heroImageUrl || DEFAULT_HERO_IMAGE

  const handleSearch = () => {
    const p = new URLSearchParams()
    if (style) p.set("category", style)
    if (floors) p.set("floors", floors)
    router.push(`/plans?${p.toString()}`)
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">

      {/* ─── Layer 1: Background image ───────────────── */}
      {bgImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt="House hero background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-house-gradient" />
      )}

      {/* ─── Overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* ─── Layer 2: Content + Text (z-10) ──────────── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Tagline top-right */}
        <div className="flex justify-end px-6 sm:px-10 pt-24">
          <p className="text-white/70 text-xs sm:text-sm font-light max-w-[200px] text-right leading-relaxed animate-fade-in">
            ค้นหาแบบบ้านที่ใช่<br />พร้อมสร้างได้ทันที
          </p>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 pb-40">
          <div className="opacity-0 animate-fade-up">
            <h1 className="font-display font-black text-hero text-white leading-none tracking-tight select-none">
              แบบบ้าน
            </h1>
          </div>
          <div className="mt-6 max-w-xl opacity-0 animate-fade-up-delay">
            <p className="text-white text-xl sm:text-2xl font-light leading-snug drop-shadow">
              เลือกแบบบ้านคุณภาพสูง<br className="hidden sm:block" />
              หลากหลายสไตล์ ครบทุกฟังก์ชัน
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 sm:px-8 lg:px-16 pb-12 opacity-0 animate-fade-up-delay2">
          <div className="bg-white rounded-2xl sm:rounded-full shadow-search p-3 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 max-w-3xl">

            {/* Style */}
            <div className="flex-1 px-4 sm:px-5 py-1 sm:border-r border-gray-200">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">สไตล์บ้าน</p>
              <div className="relative flex items-center">
                <select value={style} onChange={e => setStyle(e.target.value)} className="select-light pr-5 w-full">
                  {styles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-0 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="sm:hidden h-px bg-gray-100 mx-4" />

            {/* Floors */}
            <div className="flex-1 px-4 sm:px-5 py-1 sm:border-r border-gray-200">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">จำนวนชั้น</p>
              <div className="relative flex items-center">
                <select value={floors} onChange={e => setFloors(e.target.value)} className="select-light pr-5 w-full">
                  {floorOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-0 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleSearch}
              className="sm:ml-2 bg-ink text-white font-semibold text-sm rounded-xl sm:rounded-full px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors flex-shrink-0 w-full sm:w-auto"
            >
              <Search size={16} />
              ค้นหาแบบบ้าน
            </button>
          </div>
        </div>
      </div>

      {/* ─── Layer 3: Foreground PNG (z-20) ─── ซ้อนหน้าตัวอักษร */}
      {heroFgImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroFgImageUrl}
          alt="House foreground"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none z-20"
        />
      )}
    </section>
  )
}
