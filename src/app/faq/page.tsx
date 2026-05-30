"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "แบบบ้านและไฟล์",
    items: [
      {
        q: "ซื้อแบบบ้านแล้วได้ไฟล์อะไรบ้าง?",
        a: "ได้รับไฟล์ครบชุด ประกอบด้วย PDF แบบบ้านทุกชั้น, ไฟล์ CAD (.dwg) สำหรับช่างและสถาปนิก, และแบบ 3D มุมมองภายนอก ส่งทางอีเมลภายใน 24 ชั่วโมงหลังชำระเงิน",
      },
      {
        q: "แบบบ้านสามารถปรับแก้ได้ไหม?",
        a: "ได้ครับ เนื่องจากเราส่งไฟล์ CAD ให้ด้วย สถาปนิกหรือช่างของคุณสามารถนำไปปรับแก้ตามความต้องการได้เลย หรือจะให้ทีมเราช่วยแก้ไขก็สามารถติดต่อสอบถามราคาเพิ่มเติมได้",
      },
      {
        q: "แบบบ้านสามารถนำไปขออนุญาตก่อสร้างได้เลยไหม?",
        a: "แบบบ้านของเราเป็นแบบมาตรฐาน ก่อนยื่นขออนุญาตก่อสร้างควรให้สถาปนิกที่มีใบอนุญาตในพื้นที่ของคุณตรวจสอบและเซ็นรับรองก่อนนะครับ",
      },
    ],
  },
  {
    category: "การสั่งซื้อและชำระเงิน",
    items: [
      {
        q: "ชำระเงินได้ช่องทางไหนบ้าง?",
        a: "รับชำระผ่านการโอนเงินธนาคาร, พร้อมเพย์, และบัตรเครดิต/เดบิต ทุกช่องทางปลอดภัย 100%",
      },
      {
        q: "สั่งซื้อแล้วได้รับไฟล์เมื่อไหร่?",
        a: "หลังยืนยันการชำระเงิน ทีมงานจะส่งไฟล์ไปยังอีเมลที่ลงทะเบียนภายใน 24 ชั่วโมง (วันทำการ จันทร์–เสาร์)",
      },
      {
        q: "คืนเงินได้ไหมถ้าไม่พอใจ?",
        a: "เนื่องจากเป็นสินค้าดิจิทัล (ไฟล์) ที่ส่งได้ทันทีหลังชำระเงิน จึงไม่สามารถคืนเงินได้หลังจากส่งไฟล์แล้ว แนะนำให้ดูตัวอย่างแบบบ้านให้ครบก่อนสั่งซื้อครับ",
      },
    ],
  },
  {
    category: "การก่อสร้าง",
    items: [
      {
        q: "มีบริการรับสร้างบ้านด้วยไหม?",
        a: "มีครับ เรามีพาร์ทเนอร์บริษัทรับสร้างบ้านที่พร้อมให้คำปรึกษา สามารถติดต่อเราผ่าน LINE เพื่อพูดคุยรายละเอียดได้เลย",
      },
      {
        q: "ค่าก่อสร้างบ้านแต่ละแบบอยู่ที่เท่าไหร่?",
        a: "ค่าก่อสร้างขึ้นอยู่กับหลายปัจจัย เช่น วัสดุที่เลือกใช้ พื้นที่ก่อสร้าง และราคาค่าแรงในแต่ละจังหวัด โดยประมาณอยู่ที่ 8,000–15,000 บาท/ตร.ม. สามารถติดต่อเราเพื่อขอใบเสนอราคาได้ฟรี",
      },
      {
        q: "แบบบ้านรองรับการก่อสร้างทั่วประเทศไหม?",
        a: "ได้ครับ แบบบ้านทุกหลังออกแบบตามมาตรฐานโครงสร้างไทย สามารถก่อสร้างได้ทุกจังหวัด อย่างไรก็ตาม แนะนำให้ปรึกษาวิศวกรในพื้นที่เพื่อตรวจสอบสภาพดินและโครงสร้างเพิ่มเติม",
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${open ? "bg-white shadow-card" : "bg-white hover:border-gray-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-ink text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div className="h-px bg-gray-100 mb-4" />
          <p className="text-ink/60 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[70px]">
        {/* Header */}
        <div className="bg-cream border-b border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <p className="section-label mb-2">มีข้อสงสัย?</p>
            <h1 className="section-heading">คำถามที่พบบ่อย</h1>
            <p className="text-ink/50 mt-4 max-w-md mx-auto text-sm">
              รวมคำถามที่ลูกค้าถามบ่อย ถ้าไม่พบคำตอบที่ต้องการ ติดต่อเราได้เลยครับ
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-display font-bold text-lg text-ink mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold rounded-full inline-block" />
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-cream rounded-3xl p-8 text-center">
            <p className="font-display font-bold text-xl text-ink mb-2">ยังมีคำถามเพิ่มเติม?</p>
            <p className="text-ink/50 text-sm mb-6">ทีมงานพร้อมตอบทุกข้อสงสัย</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-ink text-white font-semibold px-8 py-3 rounded-full hover:bg-ink/80 transition-colors"
            >
              ติดต่อเรา
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
