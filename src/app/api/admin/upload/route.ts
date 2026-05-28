import { NextRequest, NextResponse } from "next/server"
import { uploadToBunny } from "@/lib/bunny"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) ?? "plans"

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const url = await uploadToBunny(buffer, file.name, file.type, folder)

    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload ล้มเหลว"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
