import { cookies } from "next/headers"

const COOKIE_NAME = "admin_token"

/** ตรวจสอบว่า login อยู่หรือเปล่า (ใช้ใน Server Components) */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return token === process.env.ADMIN_PASSWORD
}

export { COOKIE_NAME }
