"use client"

import { useEffect, useState } from "react"
import { Settings, Save, CheckCircle } from "lucide-react"
import ImageUpload from "@/components/admin/ImageUpload"

export default function AdminSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState("")
  const [heroFgImageUrl, setHeroFgImageUrl] = useState("")
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
        setHeroFgImageUrl(data.hero_fg_image_url ?? "")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      // บันทึกทั้ง 2 ค่าพร้อมกัน
      const [res1, res2] = await Promise.all([
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "hero_image_url", value: heroImageUrl }),
        }),
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "hero_fg_image_url", value: heroFgImageUrl }),
        }),
      ])
      const res = res1.ok ? res2 : res1
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

          {/* Hero Background */}
          <div>
            <p className="font-semibold text-ink text-base mb-1">รูปพื้นหลังหน้าแรก (Hero)</p>
            <p className="text-xs text-ink/40 mb-5">
              รูป background ของหน้าหลัก — แนะนำขนาด 1920×1080 ขึ้นไป
            </p>
            <ImageUpload
              value={heroImageUrl}
              onChange={setHeroImageUrl}
              label="รูปพื้นหลัง"
              folder="settings"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            {/* Hero Foreground PNG */}
            <p className="font-semibold text-ink text-base mb-1">รูปบ้านหน้า (Foreground PNG)</p>
            <p className="text-xs text-ink/40 mb-2">
              รูปนี้จะ<strong className="text-ink/60">ซ้อนทับตัวอักษร</strong> — ต้องเป็น PNG พื้นหลังโปร่งใส (transparent)
            </p>
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              💡 ถ้าไม่มีรูป PNG ตัดพื้น สามารถใช้เว็บ{" "}
              <a href="https://remove.bg" target="_blank" rel="noreferrer" className="underline font-semibold">remove.bg</a>
              {" "}ตัดพื้นหลังบ้านออกฟรีได้เลย
            </div>
            <ImageUpload
              value={heroFgImageUrl}
              onChange={setHeroFgImageUrl}
              label="รูปบ้าน Foreground (PNG)"
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
