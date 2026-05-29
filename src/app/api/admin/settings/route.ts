import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { USE_MOCK_DATA } from "@/lib/mockData"

// Mock fallback
const mockSettings: Record<string, string> = {
  hero_image_url: "",
}

// GET — ดึง settings ทั้งหมด
export async function GET() {
  if (USE_MOCK_DATA) {
    return NextResponse.json(mockSettings)
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value")
    if (error) throw error

    const settings: Record<string, string> = {}
    data?.forEach((row) => { settings[row.key] = row.value ?? "" })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({})
  }
}

// PUT — อัปเดต setting
export async function PUT(req: NextRequest) {
  if (USE_MOCK_DATA) {
    const body = await req.json()
    mockSettings[body.key] = body.value
    return NextResponse.json({ ok: true })
  }
  try {
    const body = await req.json()
    const { key, value } = body
    if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 })

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
