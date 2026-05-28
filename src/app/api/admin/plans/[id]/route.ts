import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockPlans, USE_MOCK_DATA } from "@/lib/mockData"

// GET — ดึงแบบบ้านเดียว
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (USE_MOCK_DATA) {
    const plan = mockPlans.find(p => p.id === id)
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(plan)
  }

  const { data, error } = await supabaseAdmin
    .from("house_plans")
    .select("*, category:categories(*), images:plan_images(*)")
    .eq("id", id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PUT — อัพเดทแบบบ้าน
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (USE_MOCK_DATA) {
    return NextResponse.json({ id, ...body })
  }

  const { data, error } = await supabaseAdmin
    .from("house_plans")
    .update(body)
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — ลบแบบบ้าน
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (USE_MOCK_DATA) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabaseAdmin.from("house_plans").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
