import Link from "next/link"
import PlanForm from "@/components/admin/PlanForm"
import { ChevronLeft } from "lucide-react"

export const metadata = { title: "เพิ่มแบบบ้านใหม่ — Admin" }

export default function NewPlanPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/plans" className="inline-flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink transition-colors mb-4">
          <ChevronLeft size={16} /> กลับ
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink">เพิ่มแบบบ้านใหม่</h1>
        <p className="text-ink/40 text-sm mt-1">กรอกข้อมูลและอัพโหลดรูปภาพแบบบ้าน</p>
      </div>
      <PlanForm />
    </div>
  )
}
