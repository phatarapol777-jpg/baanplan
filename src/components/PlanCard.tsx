import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, ChefHat, Car, Layers, Ruler, MessageCircle } from "lucide-react"
import type { HousePlan } from "@/types"

export default function PlanCard({ plan }: { plan: HousePlan }) {
  return (
    <Link href={`/plans/${plan.slug}`} className="block group">
      <div className="card h-full flex flex-col">

        {/* Image */}
        <div className="relative aspect-[4/3] bg-cream overflow-hidden">
          {plan.cover_image_url ? (
            <Image
              src={plan.cover_image_url}
              alt={plan.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-house-gradient flex items-center justify-center">
              <svg viewBox="0 0 120 90" className="w-20 h-20 opacity-40">
                <polygon points="60,6 8,42 112,42" fill="white" />
                <rect x="16" y="42" width="88" height="48" fill="white" opacity="0.8" />
                <rect x="46" y="58" width="28" height="32" fill="#a8d5b5" />
                <rect x="22" y="50" width="22" height="16" fill="#c8e6fa" />
                <rect x="76" y="50" width="22" height="16" fill="#c8e6fa" />
              </svg>
            </div>
          )}

          {plan.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {plan.category.name_th}
            </span>
          )}
          {plan.is_featured && (
            <span className="absolute top-3 right-3 bg-gold text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              แนะนำ
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-4">
          <div>
            <h3 className="font-display font-semibold text-ink text-[1.05rem] leading-tight group-hover:text-gold transition-colors line-clamp-1">
              {plan.title}
            </h3>
            {plan.total_area_sqm && (
              <p className="text-ink/40 text-xs mt-1 flex items-center gap-1">
                <Ruler size={11} /> {plan.total_area_sqm} ตร.ม.
              </p>
            )}
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-1.5">
            <Spec icon={<Layers size={12} />} label={`${plan.floors} ชั้น`} />
            <Spec icon={<Bed size={12} />} label={`${plan.bedrooms} นอน`} />
            <Spec icon={<Bath size={12} />} label={`${plan.bathrooms} น้ำ`} />
            <Spec icon={<ChefHat size={12} />} label={`${plan.kitchens} ครัว`} />
            {plan.garages > 0 && <Spec icon={<Car size={12} />} label={`${plan.garages} โรงจอด`} />}
          </div>

          {/* CTA — no price */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink/40 font-medium">
              <MessageCircle size={12} />
              สอบถามราคาทาง LINE
            </span>
            <span className="text-[12px] font-semibold text-gold flex items-center gap-1">
              ดูรายละเอียด
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-ink/60 text-[11px] font-medium bg-cream px-2.5 py-1 rounded-full">
      {icon} {label}
    </span>
  )
}
