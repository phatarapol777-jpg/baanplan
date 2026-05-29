/**
 * อัพโหลดไฟล์ไปยัง Bunny.net Storage Zone
 * คืนค่า CDN URL ของไฟล์ที่อัพโหลด
 */
export async function uploadToBunny(
  buffer: ArrayBuffer,
  originalFilename: string,
  contentType: string,
  folder = "plans"
): Promise<string> {
  const zone = process.env.BUNNY_STORAGE_ZONE
  const apiKey = process.env.BUNNY_STORAGE_API_KEY
  const cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL

  if (!zone || !apiKey || !cdnUrl) {
    throw new Error("Bunny.net ยังไม่ได้ตั้งค่า — ใส่ BUNNY_STORAGE_ZONE, BUNNY_STORAGE_API_KEY, NEXT_PUBLIC_BUNNY_CDN_URL ใน .env.local")
  }

  // สร้างชื่อไฟล์ไม่ซ้ำ
  const ext = originalFilename.split(".").pop() ?? "jpg"
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `${folder}/${uniqueName}`

  const storageEndpoint = process.env.BUNNY_STORAGE_ENDPOINT ?? "storage.bunnycdn.com"

  const res = await fetch(
    `https://${storageEndpoint}/${zone}/${path}`,
    {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        "Content-Type": contentType,
      },
      body: buffer,
    }
  )

  if (!res.ok) {
    throw new Error(`Bunny.net upload failed: ${res.status} ${await res.text()}`)
  }

  return `${cdnUrl}/${path}`
}

/** ลบไฟล์จาก Bunny.net */
export async function deleteFromBunny(fileUrl: string): Promise<void> {
  const zone = process.env.BUNNY_STORAGE_ZONE
  const apiKey = process.env.BUNNY_STORAGE_API_KEY
  const cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL

  if (!zone || !apiKey || !cdnUrl) return

  // แปลง CDN URL → Storage path
  const path = fileUrl.replace(`${cdnUrl}/`, "")
  const storageEndpoint = process.env.BUNNY_STORAGE_ENDPOINT ?? "storage.bunnycdn.com"

  await fetch(`https://${storageEndpoint}/${zone}/${path}`, {
    method: "DELETE",
    headers: { AccessKey: apiKey },
  })
}
