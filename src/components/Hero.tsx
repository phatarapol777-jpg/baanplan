"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"

const HERO_IMAGE_URL = "https://baanplan-cdn.b-cdn.net/LINE_ALBUM_clear%20Logo%20Bogie_260515_2.jpg" // ← ใส่ URL รูปบ้านจาก Bunny.net ที่นี่

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
  { label: "2 ชั้น", value: "2" },
  { label: "3 ชั้น", value: "3" },
]

const bedroomOptions = [
  { label: "ทุกขนาด", value: "" },
  { label: "2 ห้องนอน", value: "2" },
  { label: "3 ห้องนอน", value: "3" },
  { label: "4 ห้องนอน", value: "4" },
]

export default function Hero() {
  const router = useRouter()
  const [style, setStyle] = useState("")
  const [floors, setFloors] = useState("")
  const [bedrooms, setBedrooms] = useState("")

  const handleSearch = () => {
    const p = new URLSearchParams()
    if (style) p.set("category", style)
    if (floors) p.set("floors", floors)
    if (bedrooms) p.set("bedrooms", bedrooms)
    router.push(`/plans?${p.toString()}`)
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">

      {/* ─── Background ──────────────────────────────── */}
      {HERO_IMAGE_URL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO_IMAGE_URL}
          alt="House hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-house-gradient">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 600 400" className="w-full max-w-2xl">
              <polygon points="300,30 40,200 560,200" fill="white" />
              <rect x="80" y="200" width="440" height="200" fill="white" />
              <rect x="230" y="280" width="140" height="120" fill="#a8d5b5" />
              <rect x="100" y="230" width="100" height="80" fill="#a8d5b5" stroke="white" strokeWidth="2" />
              <rect x="400" y="230" width="100" height="80" fill="#a8d5b5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="absolute top-10 left-20 w-48 h-20 bg-white/20 rounded-full blur-xl" />
          <div className="absolute top-6 left-48 w-72 h-24 bg-white/15 rounded-full blur-xl" />
          <div className="absolute top-14 right-24 w-56 h-20 bg-white/20 rounded-full blur-xl" />
        </div>
      )}

      {/* ─── Overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* ─── Content ─────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Tagline top-right */}
        <div className="flex justify-end px-6 sm:px-10 pt-24">
          <p className="text-white/70 text-xs sm:text-sm font-light max-w-[200px] text-right leading-relaxed animate-fade-in">
            ค้นหาแบบบ้านที่ใช่<br />พร้อมสร้างได้ทันที
          </p>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
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

            <div className="sm:hidden h-px bg-gray-100 mx-4" />

            {/* Bedrooms */}
            <div className="flex-1 px-4 sm:px-5 py-1">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">ห้องนอน</p>
              <div className="relative flex items-center">
                <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="select-light pr-5 w-full">
                  {bedroomOptions.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
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
    </section>
  )
}
