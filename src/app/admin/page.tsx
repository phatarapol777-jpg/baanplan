import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockPlans, mockCategories, USE_MOCK_DATA } from "@/lib/mockData"
import { LayoutDashboard, BookImage, Tag, Star, Eye } from "lucide-react"

export default async function AdminDashboardPage() {
  let totalPlans = 0, featuredPlans = 0, totalCategories = 0
  let recentPlans: Array<{ id: string; title: string; is_featured: boolean; is_available: boolean; view_count: number; category: { name_th: string } | null }> = []

  if (!USE_MOCK_DATA) {
    try {
      const [{ count: pc }, { count: fc }, { count: cc }, { data: recent }] = await Promise.all([
        supabaseAdmin.from("house_plans").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("house_plans").select("*", { count: "exact", head: true }).eq("is_featured", true),
        supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("house_plans").select("id, title, is_featured, is_available, view_count, category:categories(name_th)").order("created_at", { ascending: false }).limit(8),
      ])
      totalPlans = pc ?? 0; featuredPlans = fc ?? 0; totalCategories = cc ?? 0
      recentPlans = (recent ?? []) as unknown as typeof recentPlans
    } catch { /* mock */ }
  } else {
    totalPlans = mockPlans.length
    featuredPlans = mockPlans.filter(p => p.is_featured).length
    totalCategories = mockCategories.length
    recentPlans = mockPlans.slice(0, 8).map(p => ({
      id: p.id, title: p.title, is_featured: p.is_featured,
      is_available: p.is_available, view_count: p.view_count,
      category: p.category ? { name_th: p.category.name_th } : null,
    }))
  }

  const stats = [
    { label: "แบบบ้านทั้งหมด", value: totalPlans, icon: <BookImage size={20} />, color: "bg-blue-50 text-blue-500" },
    { label: "แบบบ้านแนะนำ", value: featuredPlans, icon: <Star size={20} />, color: "bg-amber-50 text-amber-500" },
    { label: "หมวดหมู่", value: totalCategories, icon: <Tag size={20} />, color: "bg-emerald-50 text-emerald-500" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
          <LayoutDashboard size={22} className="text-gold" /> Dashboard
        </h1>
        <p className="text-ink/40 text-sm mt-1">ภาพรวมของเว็บไซต์</p>
      </div>

      {USE_MOCK_DATA && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
          ⚠️ ขณะนี้แสดง Mock Data — ใส่ค่า Supabase ใน <code className="bg-amber-100 px-1.5 py-0.5 rounded">.env.local</code> เพื่อใช้งานจริง
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-display font-black text-ink">{s.value}</p>
              <p className="text-xs text-ink/40 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/plans/new" className="bg-ink text-white rounded-2xl p-5 flex items-center gap-3 hover:bg-ink/85 transition-colors group">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><BookImage size={18} /></div>
          <div>
            <p className="font-semibold">เพิ่มแบบบ้านใหม่</p>
            <p className="text-white/50 text-xs">สร้างแบบบ้านพร้อมอัพโหลดรูป</p>
          </div>
          <span className="ml-auto text-white/30 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link href="/admin/categories" className="bg-white rounded-2xl p-5 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow group border border-gray-100">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Tag size={18} className="text-gold" /></div>
          <div>
            <p className="font-semibold text-ink">จัดการหมวดหมู่</p>
            <p className="text-ink/40 text-xs">เพิ่ม แก้ไข หมวดหมู่สไตล์บ้าน</p>
          </div>
          <span className="ml-auto text-ink/20 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Recent plans */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-ink">แบบบ้านล่าสุด</h2>
          <Link href="/admin/plans" className="text-xs text-gold hover:text-gold-dark font-semibold">ดูทั้งหมด →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentPlans.map(plan => (
            <Link key={plan.id} href={`/admin/plans/${plan.id}/edit`}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-cream transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{plan.title}</p>
                <p className="text-xs text-ink/40 mt-0.5">{plan.category?.name_th ?? "ไม่ระบุหมวดหมู่"}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {plan.is_featured && <span className="text-[10px] bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full font-semibold">แนะนำ</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${plan.is_available ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                  {plan.is_available ? "แสดง" : "ซ่อน"}
                </span>
                <span className="text-[11px] text-ink/30 flex items-center gap-1">
                  <Eye size={11} /> {plan.view_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
