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

    // ขนาดไฟล์สูงสุด 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 10MB" }, { status: 400 })
    }

    const rawBuffer = await file.arrayBuffer()
    const baseName = file.name.replace(/\.[^.]+$/, "")

    let uploadBuffer: ArrayBuffer = rawBuffer
    let uploadFilename = file.name
    let uploadMime = file.type

    // แปลงเป็น WebP ด้วย sharp (dynamic import — ไม่ crash ถ้า sharp ยังไม่ install)
    try {
      const sharp = (await import("sharp")).default
      const webpBuffer = await sharp(Buffer.from(rawBuffer))
        .webp({ quality: 85 })
        .toBuffer()
      uploadBuffer = webpBuffer.buffer as ArrayBuffer
      uploadFilename = `${baseName}.webp`
      uploadMime = "image/webp"
    } catch {
      // sharp ยังไม่พร้อม → upload ไฟล์ต้นฉบับแทน
      console.warn("sharp not available, uploading original file")
    }

    const url = await uploadToBunny(uploadBuffer, uploadFilename, uploadMime, folder)

    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload ล้มเหลว"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
