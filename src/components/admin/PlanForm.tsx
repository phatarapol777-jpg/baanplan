"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, Save, Trash2 } from "lucide-react"
import ImageUpload from "./ImageUpload"
import type { Category } from "@/types"

interface PlanFormData {
  title: string
  slug: string
  description: string
  category_id: string
  floors: number
  bedrooms: number
  bathrooms: number
  kitchens: number
  living_rooms: number
  garages: number
  total_area_sqm: string
  cover_image_url: string
  is_featured: boolean
  is_available: boolean
}

interface ExtraImage {
  id?: string
  image_url: string
  image_type: string
  sort_order: number
}

interface PlanFormProps {
  planId?: string
  initialData?: Partial<PlanFormData>
  initialImages?: ExtraImage[]
}

const defaultData: PlanFormData = {
  title: "", slug: "", description: "",
  category_id: "",
  floors: 1, bedrooms: 3, bathrooms: 2,
  kitchens: 1, living_rooms: 1, garages: 0,
  total_area_sqm: "",
  cover_image_url: "",
  is_featured: false, is_available: true,
}

function toSlug(str: string) {
  return str.toLowerCase()
    .replace(/[฀-๿]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-") || `plan-${Date.now()}`
}

export default function PlanForm({ planId, initialData, initialImages = [] }: PlanFormProps) {
  const router = useRouter()
  const isEdit = !!planId

  const [form, setForm] = useState<PlanFormData>({ ...defaultData, ...initialData })
  const [extraImages, setExtraImages] = useState<ExtraImage[]>(initialImages)
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(isEdit)

  // load categories
  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(setCategories)
  }, [])

  const set = <K extends keyof PlanFormData>(key: K, value: PlanFormData[K]) => {
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === "title" && !slugManual) next.slug = toSlug(value as string)
      return next
    })
  }

  const addExtraImage = (url: string) => {
    setExtraImages(imgs => [...imgs, { image_url: url, image_type: "exterior", sort_order: imgs.length }])
  }

  const removeExtraImage = (idx: number) => {
    setExtraImages(imgs => imgs.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return setError("กรุณาใส่ชื่อแบบบ้าน")
    if (!form.slug.trim()) return setError("กรุณาใส่ slug")
    setSaving(true); setError("")

    try {
      const payload = {
        ...form,
        total_area_sqm: form.total_area_sqm ? parseFloat(form.total_area_sqm) : null,
        category_id: form.category_id || null,
      }

      const url = isEdit ? `/api/admin/plans/${planId}` : "/api/admin/plans"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      // save extra images (new only)
      const savedId = isEdit ? planId : json.id
      for (const img of extraImages.filter(i => !i.id)) {
        await fetch("/api/admin/plan-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: savedId, ...img }),
        })
      }

      router.push("/admin/plans")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกล้มเหลว")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!planId) return
    if (!confirm("ยืนยันการลบแบบบ้านนี้?")) return
    await fetch(`/api/admin/plans/${planId}`, { method: "DELETE" })
    router.push("/admin/plans")
    router.refresh()
  }

  return (
    <div className="space-y-6 pb-10">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── LEFT: ข้อมูลหลัก ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ข้อมูลพื้นฐาน */}
          <div className="bg-white rounded-2xl p-6 space-y-4 shadow-card">
            <h2 className="font-display font-bold text-ink">ข้อมูลพื้นฐาน</h2>
            <Field label="ชื่อแบบบ้าน *">
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="เช่น บ้านโมเดิร์น M-101" />
            </Field>
            <Field label="Slug (URL)">
              <div className="flex gap-2">
                <Input
                  value={form.slug}
                  onChange={e => { setSlugManual(true); set("slug", e.target.value) }}
                  placeholder="modern-m101"
                />
                <button type="button" onClick={() => { setSlugManual(false); set("slug", toSlug(form.title)) }}
                  className="px-3 py-2 text-xs text-gold border border-gold/30 rounded-xl hover:bg-gold/5 transition-colors whitespace-nowrap">
                  Auto
                </button>
              </div>
              <p className="text-xs text-ink/30 mt-1">URL จะเป็น /plans/{form.slug || "..."}</p>
            </Field>
            <Field label="หมวดหมู่">
              <select value={form.category_id} onChange={e => set("category_id", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer">
                <option value="">-- ไม่ระบุ --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_th} ({c.name})</option>)}
              </select>
            </Field>
            <Field label="คำอธิบาย">
              <textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="อธิบายจุดเด่นของแบบบ้านนี้..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-gold/50 transition-colors resize-none" />
            </Field>
          </div>

          {/* สเปค */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="font-display font-bold text-ink mb-5">ข้อมูลสเปค</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="จำนวนชั้น">
                <select
                  value={form.floors}
                  onChange={e => set("floors", parseFloat(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value={1}>1 ชั้น</option>
                  <option value={1.5}>ชั้นครึ่ง</option>
                  <option value={2}>2 ชั้น ขึ้นไป</option>
                </select>
              </Field>
              <NumInput label="ห้องนอน" value={form.bedrooms} onDec={() => set("bedrooms", Math.max(0, form.bedrooms - 1))} onInc={() => set("bedrooms", form.bedrooms + 1)} />
              <NumInput label="ห้องน้ำ" value={form.bathrooms} onDec={() => set("bathrooms", Math.max(0, form.bathrooms - 1))} onInc={() => set("bathrooms", form.bathrooms + 1)} />
              <NumInput label="ห้องครัว" value={form.kitchens} onDec={() => set("kitchens", Math.max(0, form.kitchens - 1))} onInc={() => set("kitchens", form.kitchens + 1)} />
              <NumInput label="ห้องนั่งเล่น" value={form.living_rooms} onDec={() => set("living_rooms", Math.max(0, form.living_rooms - 1))} onInc={() => set("living_rooms", form.living_rooms + 1)} />
              <NumInput label="โรงจอดรถ" value={form.garages} onDec={() => set("garages", Math.max(0, form.garages - 1))} onInc={() => set("garages", form.garages + 1)} />
            </div>
            <div className="mt-5">
              <Field label="พื้นที่ใช้สอย (ตร.ม.)">
                <Input type="number" value={form.total_area_sqm} onChange={e => set("total_area_sqm", e.target.value)} placeholder="เช่น 185" />
              </Field>
            </div>
          </div>

          {/* รูปเพิ่มเติม */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-ink">รูปเพิ่มเติม</h2>
              <p className="text-xs text-ink/40">{extraImages.length} รูป</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {extraImages.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExtraImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={11} />
                  </button>
                  <select value={img.image_type}
                    onChange={e => setExtraImages(imgs => imgs.map((im, j) => j === i ? { ...im, image_type: e.target.value } : im))}
                    className="absolute bottom-1 left-1 right-1 text-[10px] bg-black/60 text-white rounded-lg px-1.5 py-0.5 border-0 appearance-none">
                    <option value="exterior">ภายนอก</option>
                    <option value="interior">ภายใน</option>
                    <option value="floor_plan">ผังพื้น</option>
                    <option value="3d">3D</option>
                  </select>
                </div>
              ))}
              {/* Add image button */}
              <ExtraImageAdder onAdd={addExtraImage} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: รูปหลัก + settings ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <ImageUpload
              value={form.cover_image_url}
              onChange={url => set("cover_image_url", url)}
              label="รูปหน้าปก"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            <h2 className="font-display font-bold text-ink text-sm">การตั้งค่า</h2>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-11 h-6 rounded-full transition-colors ${form.is_available ? "bg-emerald-500" : "bg-gray-200"} relative flex-shrink-0`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_available ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <input type="checkbox" className="hidden" checked={form.is_available} onChange={e => set("is_available", e.target.checked)} />
              <div>
                <p className="text-sm font-semibold text-ink">แสดงในเว็บ</p>
                <p className="text-xs text-ink/40">ลูกค้าจะมองเห็นแบบบ้านนี้</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-11 h-6 rounded-full transition-colors ${form.is_featured ? "bg-gold" : "bg-gray-200"} relative flex-shrink-0`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? "translate-x-6" : "translate-x-1"}`} />
              </div>
              <input type="checkbox" className="hidden" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} />
              <div>
                <p className="text-sm font-semibold text-ink">แบบบ้านแนะนำ</p>
                <p className="text-xs text-ink/40">แสดงในส่วน &ldquo;แนะนำ&rdquo; หน้าแรก</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <button type="button" onClick={handleSave} disabled={saving}
            className="w-full btn-dark py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "สร้างแบบบ้าน"}
          </button>

          {isEdit && (
            <button type="button" onClick={handleDelete}
              className="w-full py-3 border border-red-200 text-red-500 text-sm font-semibold rounded-2xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <Trash2 size={15} /> ลบแบบบ้านนี้
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Input helpers (ต้องอยู่นอก PlanForm เพื่อไม่ให้ re-mount ทุก render) ──
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-ink/50 uppercase tracking-widest block">{label}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-gold/50 transition-colors" />
  )
}

function NumInput({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onDec} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-ink hover:border-gold/50 transition-colors font-bold">−</button>
        <span className="w-8 text-center font-bold text-ink">{value}</span>
        <button type="button" onClick={onInc} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-ink hover:border-gold/50 transition-colors font-bold">+</button>
      </div>
    </Field>
  )
}

// ── ปุ่มเพิ่มรูปเพิ่มเติม ──────────────────────────────────
function ExtraImageAdder({ onAdd }: { onAdd: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handle = async (file: File) => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "plans")
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (res.ok) onAdd(json.url)
    } finally { setLoading(false) }
  }

  return (
    <>
      <button type="button" onClick={() => inputRef.current?.click()}
        className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-gold/40 bg-cream hover:bg-gold/5 transition-all flex flex-col items-center justify-center gap-1.5 text-ink/30 hover:text-gold">
        {loading ? <Loader2 size={18} className="animate-spin text-gold" /> : <><Plus size={20} /><span className="text-[11px]">เพิ่มรูป</span></>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = "" }} />
    </>
  )
}

