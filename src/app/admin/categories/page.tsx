"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  name_th: string
  slug: string
  plan_count?: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // new category form
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newNameTh, setNewNameTh] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [slugAuto, setSlugAuto] = useState(true)

  // edit state
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editNameTh, setEditNameTh] = useState("")
  const [editSlug, setEditSlug] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch { /* empty */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toSlug = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-") || ""

  const handleCreate = async () => {
    if (!newName.trim() || !newNameTh.trim()) return setError("กรุณากรอก ชื่อภาษาอังกฤษ และ ชื่อภาษาไทย")
    const slug = newSlug.trim() || toSlug(newName)
    if (!slug) return setError("กรุณากรอก slug")
    setSaving(true); setError("")
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), name_th: newNameTh.trim(), slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setNewName(""); setNewNameTh(""); setNewSlug(""); setSlugAuto(true)
      setShowNew(false)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "สร้างล้มเหลว")
    } finally { setSaving(false) }
  }

  const startEdit = (cat: Category) => {
    setEditId(cat.id)
    setEditName(cat.name)
    setEditNameTh(cat.name_th)
    setEditSlug(cat.slug)
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editNameTh.trim() || !editSlug.trim()) return
    setSaving(true); setError("")
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), name_th: editNameTh.trim(), slug: editSlug.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setEditId(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกล้มเหลว")
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ยืนยันการลบหมวดหมู่ "${name}"?\nแบบบ้านในหมวดหมู่นี้จะยังคงอยู่ แต่จะไม่มีหมวดหมู่`)) return
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      load()
    } catch { /* empty */ }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink flex items-center gap-2.5">
            <Tag size={22} className="text-gold" /> หมวดหมู่
          </h1>
          <p className="text-ink/40 text-sm mt-1">{categories.length} หมวดหมู่</p>
        </div>
        <button onClick={() => { setShowNew(true); setError("") }}
          className="btn-dark flex items-center gap-2">
          <Plus size={17} /> เพิ่มหมวดหมู่
        </button>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">

        {/* New Category Form */}
        {showNew && (
          <div className="border-b border-gray-100 px-6 py-5 bg-gold/5">
            <p className="text-xs font-semibold text-ink/50 uppercase tracking-widest mb-3">หมวดหมู่ใหม่</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-ink/40 block mb-1">ชื่อภาษาอังกฤษ *</label>
                <input
                  value={newName}
                  onChange={e => {
                    setNewName(e.target.value)
                    if (slugAuto) setNewSlug(toSlug(e.target.value))
                  }}
                  placeholder="Modern, Classic, ..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-ink/40 block mb-1">ชื่อภาษาไทย *</label>
                <input
                  value={newNameTh}
                  onChange={e => setNewNameTh(e.target.value)}
                  placeholder="โมเดิร์น, คลาสสิค, ..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-ink/40 block mb-1">Slug</label>
                <input
                  value={newSlug}
                  onChange={e => { setSlugAuto(false); setNewSlug(e.target.value) }}
                  placeholder="modern, classic, ..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={handleCreate} disabled={saving}
                className="btn-dark px-5 py-2 text-sm flex items-center gap-1.5 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {saving ? "กำลังบันทึก..." : "สร้างหมวดหมู่"}
              </button>
              <button onClick={() => { setShowNew(false); setError(""); setNewName(""); setNewNameTh(""); setNewSlug("") }}
                className="px-5 py-2 text-sm border border-gray-200 rounded-xl text-ink/50 hover:text-ink transition-colors flex items-center gap-1.5">
                <X size={14} /> ยกเลิก
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="py-16 flex items-center justify-center text-ink/30 gap-2">
            <Loader2 size={18} className="animate-spin" /> กำลังโหลด...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-ink/30">
            <Tag size={32} className="mx-auto mb-3 opacity-20" />
            <p>ยังไม่มีหมวดหมู่</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest">ชื่อไทย</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest hidden sm:table-cell">ชื่ออังกฤษ</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest hidden md:table-cell">Slug</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-ink/40 uppercase tracking-widest text-center hidden lg:table-cell">แบบบ้าน</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-cream/50 transition-colors">
                  {editId === cat.id ? (
                    /* Edit row */
                    <>
                      <td className="px-6 py-3">
                        <input value={editNameTh} onChange={e => setEditNameTh(e.target.value)}
                          className="w-full border border-gold/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          className="w-full border border-gold/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <input value={editSlug} onChange={e => setEditSlug(e.target.value)}
                          className="w-full border border-gold/40 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell" />
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleUpdate(cat.id)} disabled={saving}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} บันทึก
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-ink/40 hover:text-ink bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                            <X size={11} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    /* Display row */
                    <>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-ink">{cat.name_th}</span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-ink/60">{cat.name}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="font-mono text-xs text-ink/40 bg-gray-50 px-2 py-0.5 rounded">{cat.slug}</span>
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell">
                        <span className="text-xs text-ink/40">{cat.plan_count ?? 0}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => startEdit(cat)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-ink bg-cream hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Pencil size={11} /> แก้ไข
                          </button>
                          <button onClick={() => handleDelete(cat.id, cat.name_th)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
