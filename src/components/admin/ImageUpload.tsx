"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  folder?: string
}

export default function ImageUpload({ value, onChange, label = "อัพโหลดรูป", folder = "plans" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFile = async (file: File) => {
    setLoading(true)
    setError("")
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", folder)

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      onChange(json.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload ล้มเหลว")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-ink/50 uppercase tracking-widest">{label}</label>

      {value ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 group bg-cream">
          <Image src={value} alt="preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-gold/40 bg-cream hover:bg-gold/5 transition-all flex flex-col items-center justify-center gap-2 text-ink/40 hover:text-gold"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin text-gold" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm font-medium">คลิกเพื่ออัพโหลด</span>
              <span className="text-xs">PNG, JPG, WEBP (สูงสุด 10MB)</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ""
        }}
      />
    </div>
  )
}
