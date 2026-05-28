import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockPlans, USE_MOCK_DATA } from "@/lib/mockData"
import { Plus, Pencil, Eye, Star } from "lucide-react"

export default async function AdminPlansPage() {
  let plans: Array<{
    id: string; title: string; slug: string; floors: number; bedrooms: number;
    is_featured: boolean; is_available: boolean; view_count: number;
    cover_image_url?: string;
    category: { name_th: string } | null
  }> = []

  if (!USE_MOCK_DATA) {
    try {
      const { data } = await supabaseAdmin
        .from("house_plans")
        .select("id, title, slug, floors, bedrooms, is_featured, is_available, view_count, cover_image_url, category:categories(name_th)")
        .order("created_at", { ascending: false })
      plans = (data ?? []) as unknown as typeof plans
    } catch { /* empty */ }
  } else {
    plans = mockPlans.map(p => ({
      id: p.id, title: p.title, slug: p.slug,
      floors: p.floors, bedrooms: p.bedrooms,
      is_featured: p.is_featured, is_available: p.is_available,
      view_count: p.view_count, cover_image_url: p.cover_image_url,
      category: p.category ? { name_th: p.category.name_th } : null,
    }))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">แบบบ้านทั้งหมด</h1>
          <p className="text-ink/40 text-sm mt-1">{plans.length} แบบบ้าน</p>
        </div>
        <Link href="/admin/plans/new" className="btn-dark flex items-center gap-2">
          <Plus size={17} /> เพิ่มแบบบ้านใหม่
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest">แบบบ้าน</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest hidden sm:table-cell">หมวดหมู่</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest hidden md:table-cell">ชั้น/นอน</th>
                <th className="text-center px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest">สถานะ</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-cream/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg bg-cream overflow-hidden flex-shrink-0">
                        {plan.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={plan.cover_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-house-gradient" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink line-clamp-1">{plan.title}</p>
                        <p className="text-xs text-ink/30">{plan.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-ink/60">{plan.category?.name_th ?? "—"}</span>
                  </td>
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    <span className="text-xs text-ink/60">{plan.floors}ชั้น / {plan.bedrooms}นอน</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {plan.is_featured && <Star size={13} className="text-gold" fill="currentColor" />}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${plan.is_available ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                        {plan.is_available ? "แสดง" : "ซ่อน"}
                      </span>
                      <span className="text-[11px] text-ink/30 flex items-center gap-0.5 hidden sm:flex">
                        <Eye size={10} />{plan.view_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/plans/${plan.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-ink bg-cream hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                      <Pencil size={12} /> แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {plans.length === 0 && (
            <div className="text-center py-16 text-ink/30">
              <p className="text-4xl mb-3">🏠</p>
              <p>ยังไม่มีแบบบ้าน — <Link href="/admin/plans/new" className="text-gold underline">เพิ่มแบบแรก</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
