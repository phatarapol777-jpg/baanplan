"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Home, Lock, Loader2, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [show, setShow] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      router.push(searchParams.get("from") ?? "/admin")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด")
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-card space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink/50 uppercase tracking-widest block">
          รหัสผ่าน
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
          />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
      )}

      <button type="submit" disabled={loading || !password}
        className="w-full btn-dark py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-ink">BaanPlan Admin</h1>
          <p className="text-ink/50 text-sm mt-1">เข้าสู่ระบบจัดการเว็บไซต์</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-3xl p-8 shadow-card flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-gold" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
