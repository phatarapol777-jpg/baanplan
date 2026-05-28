import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BaanPlan | แปลนบ้านคุณภาพ",
  description: "เลือกซื้อแบบบ้านคุณภาพสูง หลากหลายสไตล์ พร้อมก่อสร้างได้ทันที",
  keywords: "แปลนบ้าน, แบบบ้าน, ขายแปลนบ้าน, แบบบ้านโมเดิร์น, แบบบ้านสวย",
  openGraph: {
    title: "BaanPlan | แปลนบ้านคุณภาพ",
    description: "เลือกซื้อแบบบ้านคุณภาพสูง หลากหลายสไตล์ พร้อมก่อสร้างได้ทันที",
    type: "website",
    locale: "th_TH",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="bg-dark text-white antialiased">{children}</body>
    </html>
  )
}
