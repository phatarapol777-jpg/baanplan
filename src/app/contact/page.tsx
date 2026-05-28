import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[70px]">
        {/* Header */}
        <div className="bg-cream border-b border-gray-100 py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <p className="section-label mb-2">พร้อมช่วยเหลือ</p>
            <h1 className="section-heading">ติดต่อเรา</h1>
            <p className="text-ink/50 mt-4 max-w-md mx-auto text-sm">
              มีคำถามหรืออยากปรึกษาก่อนตัดสินใจ ทีมงานพร้อมช่วยเหลือทุกวัน
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl text-ink mb-6">ช่องทางติดต่อ</h2>
              {[
                { icon: <Phone size={18} />, label: "โทรศัพท์", value: "082-XXX-XXXX", sub: "จันทร์-เสาร์ 9:00-18:00" },
                { icon: <Mail size={18} />, label: "อีเมล", value: "contact@baanplan.com", sub: "ตอบกลับภายใน 24 ชั่วโมง" },
                { icon: <MapPin size={18} />, label: "ที่ตั้ง", value: "กรุงเทพมหานคร", sub: "ประเทศไทย" },
                { icon: <Clock size={18} />, label: "เวลาทำการ", value: "จันทร์ – เสาร์", sub: "09:00 – 18:00 น." },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-5 bg-cream rounded-2xl">
                  <div className="text-gold mt-0.5 flex-shrink-0">{info.icon}</div>
                  <div>
                    <p className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold">{info.label}</p>
                    <p className="text-ink font-semibold mt-0.5">{info.value}</p>
                    <p className="text-ink/50 text-sm">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card p-8">
              <h2 className="font-display font-bold text-2xl text-ink mb-6">ส่งข้อความหาเรา</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">ชื่อ</label>
                    <input type="text" placeholder="ชื่อของคุณ" className="input-light" />
                  </div>
                  <div>
                    <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">นามสกุล</label>
                    <input type="text" placeholder="นามสกุลของคุณ" className="input-light" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">อีเมล</label>
                  <input type="email" placeholder="email@example.com" className="input-light" />
                </div>
                <div>
                  <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">เบอร์โทรศัพท์</label>
                  <input type="tel" placeholder="08X-XXX-XXXX" className="input-light" />
                </div>
                <div>
                  <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">แบบบ้านที่สนใจ</label>
                  <input type="text" placeholder="เช่น บ้านโมเดิร์น 2 ชั้น 3 ห้องนอน" className="input-light" />
                </div>
                <div>
                  <label className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold block mb-1.5">ข้อความ</label>
                  <textarea rows={4} placeholder="บอกเราเกี่ยวกับแบบบ้านที่คุณต้องการ..." className="input-light resize-none" />
                </div>
                <button type="submit" className="btn-dark w-full py-4 text-base">ส่งข้อความ</button>
                <p className="text-[11px] text-ink/30 text-center">ข้อมูลของคุณจะถูกเก็บเป็นความลับ</p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
