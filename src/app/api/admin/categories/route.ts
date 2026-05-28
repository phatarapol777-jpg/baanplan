import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { mockCategories, USE_MOCK_DATA } from "@/lib/mockData"

export async function GET() {
  if (USE_MOCK_DATA) {
    return NextResponse.json(mockCategories)
  }
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("name_th")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (USE_MOCK_DATA) {
    const body = await req.json()
    const newCat = { id: Date.now().toString(), plan_count: 0, ...body }
    return NextResponse.json(newCat, { status: 201 })
  }
  const body = await req.json()
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert([body])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
