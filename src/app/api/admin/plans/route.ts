import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockPlans, USE_MOCK_DATA } from "@/lib/mockData"

// GET — ดึงรายการแบบบ้านทั้งหมด (admin เห็นทุกอัน)
export async function GET() {
  if (USE_MOCK_DATA) {
    return NextResponse.json(mockPlans)
  }
  const { data, error } = await supabaseAdmin
    .from("house_plans")
    .select("*, category:categories(name_th)")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — สร้างแบบบ้านใหม่
export async function POST(req: NextRequest) {
  if (USE_MOCK_DATA) {
    const body = await req.json()
    const newPlan = { id: Date.now().toString(), view_count: 0, created_at: new Date().toISOString(), ...body }
    return NextResponse.json(newPlan, { status: 201 })
  }
  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from("house_plans")
    .insert([body])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
