import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PlanCard from "@/components/PlanCard"
import { mockPlans, USE_MOCK_DATA } from "@/lib/mockData"
import { getHousePlanBySlug, getHousePlans } from "@/lib/supabase"
import {
  Bed, Bath, ChefHat, Car, Layers, Ruler, Sofa,
  ArrowLeft, CheckCircle, MessageCircle,
} from "lucide-react"
import type { HousePlan } from "@/types"

// LINE icon SVG component
function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

const LINE_ID = "@baanplan" // ← เปลี่ยนเป็น LINE ID จริงของคุณ

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let plan: HousePlan | null = null
  let relatedPlans: HousePlan[] = []

  if (!USE_MOCK_DATA) {
    try {
      plan = await getHousePlanBySlug(id)
      const all = await getHousePlans({ category_slug: plan?.category?.slug, limit: 4 })
      relatedPlans = all.filter((p: HousePlan) => p.id !== plan?.id).slice(0, 3)
    } catch { /* empty */ }
  } else {
    plan = mockPlans.find(p => p.slug === id) ?? null
    relatedPlans = mockPlans.filter(p => p.id !== plan?.id && p.category?.slug === plan?.category?.slug).slice(0, 3)
  }

  if (!plan) return notFound()

  const specs = [
    { icon: <Layers size={18} />, label: "จำนวนชั้น", value: `${plan.floors} ชั้น` },
    { icon: <Bed size={18} />, label: "ห้องนอน", value: `${plan.bedrooms} ห้อง` },
    { icon: <Bath size={18} />, label: "ห้องน้ำ", value: `${plan.bathrooms} ห้อง` },
    { icon: <ChefHat size={18} />, label: "ห้องครัว", value: `${plan.kitchens} ห้อง` },
    { icon: <Sofa size={18} />, label: "ห้องนั่งเล่น", value: `${plan.living_rooms} ห้อง` },
    { icon: <Car size={18} />, label: "โรงจอดรถ", value: `${plan.garages} คัน` },
    ...(plan.total_area_sqm
      ? [{ icon: <Ruler size={18} />, label: "พื้นที่ใช้สอย", value: `${plan.total_area_sqm} ตร.ม.` }]
      : []),
  ]

  const included = [
    "ไฟล์ PDF แบบพิมพ์เขียวครบชุด",
    "ไฟล์ AutoCAD (.dwg) ทุกชั้น",
    "แบบสถาปัตยกรรม (ผัง, รูปด้าน, รูปตัด)",
    "แบบโครงสร้าง (คาน, เสา, ฐานราก)",
    "แบบระบบไฟฟ้าและประปา",
    "รายการวัสดุก่อสร้างเบื้องต้น",
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[70px]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-ink/40 mb-8">
            <Link href="/plans" className="hover:text-ink transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={14} /> แบบบ้านทั้งหมด
            </Link>
            <span>/</span>
            <span className="text-ink">{plan.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: Image + Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Cover image */}
              <div className="relative aspect-[16/10] bg-cream rounded-3xl overflow-hidden">
                {plan.cover_image_url ? (
                  <Image src={plan.cover_image_url} alt={plan.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-house-gradient flex items-center justify-center">
                    <svg viewBox="0 0 200 150" className="w-36 h-36 opacity-30">
                      <polygon points="100,10 10,70 190,70" fill="white" />
                      <rect x="20" y="70" width="160" height="80" fill="white" opacity="0.8" />
                      <rect x="80" y="100" width="40" height="50" fill="#a8d5b5" />
                      <rect x="30" y="80" width="35" height="25" fill="#c8e6fa" />
                      <rect x="135" y="80" width="35" height="25" fill="#c8e6fa" />
                    </svg>
                  </div>
                )}
                {plan.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ink text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                    {plan.category.name_th}
                  </div>
                )}
              </div>

              {/* Additional images */}
              {plan.images && plan.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {plan.images.slice(0, 6).map(img => (
                    <div key={img.id} className="relative aspect-video bg-cream rounded-2xl overflow-hidden">
                      <Image src={img.image_url} alt={img.alt_text || plan.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {plan.description && (
                <div className="bg-cream rounded-2xl p-6">
                  <h2 className="font-display font-bold text-xl text-ink mb-3">รายละเอียดแบบบ้าน</h2>
                  <p className="text-ink/60 leading-relaxed">{plan.description}</p>
                </div>
              )}

              {/* Specs */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-xl text-ink mb-5">ข้อมูลสเปค</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map(spec => (
                    <div key={spec.label} className="bg-cream rounded-xl p-4 flex items-center gap-3">
                      <div className="text-gold flex-shrink-0">{spec.icon}</div>
                      <div>
                        <p className="text-[11px] text-ink/40">{spec.label}</p>
                        <p className="text-ink font-bold text-sm">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-xl text-ink mb-5">สิ่งที่รวมในแพ็กเกจ</h2>
                <ul className="space-y-3">
                  {included.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink/70">
                      <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Contact card */}
            <div>
              <div className="sticky top-[86px] space-y-4">

                {/* LINE Contact Card */}
                <div className="card p-6 space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-[#06C755]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={26} className="text-[#06C755]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-ink">สนใจแบบบ้านนี้?</h3>
                    <p className="text-ink/50 text-sm mt-2 leading-relaxed">
                      ทักหาเราทาง LINE เพื่อสอบถามราคา<br />
                      และรายละเอียดเพิ่มเติมได้เลย
                    </p>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* LINE button */}
                  <a
                    href={`https://line.me/ti/p/${LINE_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-[#06C755]/20"
                  >
                    <LineIcon />
                    สอบถามทาง LINE
                  </a>

                  <p className="text-center text-xs text-ink/30">LINE ID: {LINE_ID}</p>

                  {/* Contact page link */}
                  <Link
                    href="/contact"
                    className="w-full py-3.5 border border-gray-200 text-ink/60 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 hover:border-ink/30 hover:text-ink transition-colors"
                  >
                    หรือส่งข้อความผ่านเว็บ →
                  </Link>

                  {/* Perks */}
                  <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
                    {[
                      "ตอบเร็ว ภายใน 1 ชั่วโมง",
                      "ราคาปรับเปลี่ยนตามช่วงเวลา",
                      "มีโปรโมชั่นพิเศษบ่อยครั้ง",
                    ].map(t => (
                      <p key={t} className="text-xs text-emerald-700 flex items-center gap-2">
                        <CheckCircle size={12} className="flex-shrink-0" /> {t}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Plan code */}
                <div className="card p-4 flex items-center justify-between">
                  <span className="text-xs text-ink/40">รหัสแบบบ้าน</span>
                  <span className="font-display font-bold text-sm text-ink bg-cream px-3 py-1 rounded-lg">
                    {plan.title.split(" ").pop()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedPlans.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl font-bold text-ink mb-8">แบบบ้านที่คล้ายกัน</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPlans.map(p => <PlanCard key={p.id} plan={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
