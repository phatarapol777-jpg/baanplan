import { NextRequest, NextResponse } from "next/server"
import { uploadToBunny } from "@/lib/bunny"
import sharp from "sharp"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) ?? "plans"

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 })
    }

    // ขนาดไฟล์สูงสุด 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 10MB" }, { status: 400 })
    }

    const rawBuffer = await file.arrayBuffer()

    // แปลงเป็น WebP คุณภาพ 85% — ลดขนาดได้ ~60-70%
    const webpBuffer = await sharp(Buffer.from(rawBuffer))
      .webp({ quality: 85 })
      .toBuffer()

    // ใช้ชื่อไฟล์เดิมแต่เปลี่ยน extension เป็น .webp
    const baseName = file.name.replace(/\.[^.]+$/, "")
    const webpFilename = `${baseName}.webp`

    const url = await uploadToBunny(
      webpBuffer.buffer as ArrayBuffer,
      webpFilename,
      "image/webp",
      folder
    )

    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload ล้มเหลว"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
