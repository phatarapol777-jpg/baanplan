"use client"

import { useEffect, useState } from "react"
import { Settings, Save, CheckCircle, Image, Phone } from "lucide-react"
import ImageUpload from "@/components/admin/ImageUpload"

type ContactSettings = {
  contact_phone: string
  contact_email: string
  contact_line_url: string
  contact_location: string
  contact_hours: string
}

export default function AdminSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [heroFgImageUrl, setHeroFgImageUrl] = useState("")
  const [contact, setContact] = useState<ContactSettings>({
    contact_phone: "",
    contact_email: "",
    contact_line_url: "",
    contact_location: "",
    contact_hours: "",
  })
  const [loading, setLoading] = useState(true)
  const [savingHero, setSavingHero] = useState(false)
  const [savedHero, setSavedHero] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savedContact, setSavedContact] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setHeroImageUrl(data.hero_image_url ?? "")
        setHeroFgImageUrl(data.hero_fg_image_url ?? "")
        setContact({
          contact_phone: data.contact_phone ?? "",
          contact_email: data.contact_email ?? "",
          contact_line_url: data.contact_line_url ?? "",
          contact_location: data.contact_location ?? "",
          contact_hours: data.contact_hours ?? "",
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const saveKeys = async (pairs: { key: string; value: string }[]) => {
    await Promise.all(pairs.map(({ key, value }) =>
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
    ))
  }

  const handleSaveHero = async () => {
    setSavingHero(true); setError("")
    try {
      await saveKeys([
        { key: "hero_image_url", value: heroImageUrl },
        { key: "hero_fg_image_url", value: heroFgImageUrl },
      ])
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      })
      setSavedHero(true)
      setTimeout(() => setSavedHero(false), 3000)
    } catch { setError("บันทึกไม่สำเร็จ") }
    finally { setSavingHero(false) }
  }

  const handleSaveContact = async () => {
    setSavingContact(true); setError("")
    try {
      await saveKeys(Object.entries(contact).map(([key, value]) => ({ key, value })))
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/contact" }),
      })
      setSavedContact(true)
      setTimeout(() => setSavedContact(false), 3000)
    } catch { setError("บันทึกไม่สำเร็จ") }
    finally { setSavingContact(false) }
  }

  const SaveButton = ({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) => (
    <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
      <button
        onClick={onClick}
        disabled={saving}
        className="flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-ink/80 transition-colors disabled:opacity-50"
      >
        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว!" : "บันทึก"}
      </button>
      {saved && <p className="text-emerald-600 text-sm font-medium flex items-center gap-1.5"><CheckCircle size={14} /> บันทึกสำเร็จ</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
          <Settings size={22} className="text-gold" /> ตั้งค่าเว็บไซต์
        </h1>
        <p className="text-ink/40 text-sm mt-1">จัดการรูปภาพและข้อมูลติดต่อ</p>
      </div>

      {/* ─── Hero Images ─── */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Image size={18} className="text-gold" />
          <h2 className="font-display font-bold text-lg text-ink">รูปหน้าแรก (Hero)</h2>
        </div>

        <div>
          <p className="font-semibold text-ink text-sm mb-1">รูปพื้นหลัง</p>
          <p className="text-xs text-ink/40 mb-4">แนะนำขนาด 1920×1080 ขึ้นไป</p>
          <ImageUpload value={heroImageUrl} onChange={setHeroImageUrl} label="รูปพื้นหลัง" folder="settings" />
        </div>

        <div className="border-t border-gray-100 pt-5">
          <p className="font-semibold text-ink text-sm mb-1">รูปบ้านหน้า (Foreground PNG)</p>
          <p className="text-xs text-ink/40 mb-2">PNG พื้นหลังโปร่งใส — จะซ้อนทับตัวอักษร</p>
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            💡 ใช้ <a href="https://remove.bg" target="_blank" rel="noreferrer" className="underline font-semibold">remove.bg</a> ตัดพื้นหลังบ้านออกฟรีได้เลย
          </div>
          <ImageUpload value={heroFgImageUrl} onChange={setHeroFgImageUrl} label="Foreground PNG" folder="settings" />
        </div>

        <SaveButton saving={savingHero} saved={savedHero} onClick={handleSaveHero} />
      </div>

      {/* ─── Contact Info ─── */}
      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Phone size={18} className="text-gold" />
          <h2 className="font-display font-bold text-lg text-ink">ช่องทางติดต่อ</h2>
        </div>

        {[
          { key: "contact_phone", label: "เบอร์โทรศัพท์", placeholder: "082-XXX-XXXX", type: "tel" },
          { key: "contact_email", label: "อีเมล", placeholder: "contact@baanplan.com", type: "email" },
          { key: "contact_line_url", label: "LINE URL", placeholder: "https://line.me/ti/p/~yourlineid", type: "url" },
          { key: "contact_location", label: "ที่ตั้ง", placeholder: "กรุงเทพมหานคร", type: "text" },
          { key: "contact_hours", label: "เวลาทำการ", placeholder: "จันทร์ – เสาร์ 09:00–18:00", type: "text" },
        ].map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">{label}</label>
            <input
              type={type}
              value={contact[key as keyof ContactSettings]}
              onChange={e => setContact(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
          💡 LINE URL ได้จาก: LINE Official Account Manager → ลิงก์เพิ่มเพื่อน
        </div>

        <SaveButton saving={savingContact} saved={savedContact} onClick={handleSaveContact} />
      </div>
    </div>
  )
}
