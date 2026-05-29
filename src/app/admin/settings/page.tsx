"use client"

import { useEffect, useState } from "react"
import { Settings, Save, CheckCircle } from "lucide-react"
import ImageUpload from "@/components/admin/ImageUpload"

export default function AdminSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // โหลด settings ปัจจุบัน
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setHeroImageUrl(data.hero_image_url ?? "")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_image_url", value: heroImageUrl }),
      })
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ")

      // Revalidate หน้าแรกทันที — รูปขึ้นเร็วเลย ไม่ต้องรอ cache
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
          <Settings size={22} className="text-gold" />
          ตั้งค่าเว็บไซต์
        </h1>
        <p className="text-ink/40 text-sm mt-1">จัดการรูปภาพและข้อมูลหน้าหลัก</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">

          {/* Hero Image Section */}
          <div>
            <p className="font-semibold text-ink text-base mb-1">รูปพื้นหลังหน้าแรก (Hero)</p>
            <p className="text-xs text-ink/40 mb-5">
              รูปที่แสดงเป็น background ของหน้าหลัก — แนะนำขนาด 1920×1080 ขึ้นไป
            </p>
            <ImageUpload
              value={heroImageUrl}
              onChange={setHeroImageUrl}
              label="รูป Hero"
              folder="settings"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-xl font-semibold
                         hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saved ? (
                <CheckCircle size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว!" : "บันทึก"}
            </button>

            {saved && (
              <p className="text-emerald-600 text-sm font-medium flex items-center gap-1.5">
                <CheckCircle size={14} />
                อัปเดตรูป Hero สำเร็จ — รูปจะขึ้นหน้าเว็บภายใน 1 นาที
              </p>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
