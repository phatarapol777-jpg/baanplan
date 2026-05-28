import Link from "next/link"
import { Home, Phone, Mail, MapPin, ChevronRight } from "lucide-react"

const footerLinks = {
  แบบบ้าน: [
    { label: "โมเดิร์น", href: "/plans?category=modern" },
    { label: "ทรอปิคอล", href: "/plans?category=tropical" },
    { label: "มินิมอล", href: "/plans?category=minimalist" },
    { label: "ดูทั้งหมด", href: "/plans" },
  ],
  ข้อมูล: [
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "วิธีสั่งซื้อ", href: "/#how" },
    { label: "คำถามที่พบบ่อย", href: "/faq" },
    { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Main */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                <Home size={17} className="text-ink" />
              </div>
              <span className="font-display font-bold text-lg">
                Baan<span className="text-gold">Plan</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              คลังแบบบ้านคุณภาพสูงกว่า 100 แบบ ออกแบบโดยสถาปนิกมืออาชีพ
              พร้อม PDF + CAD ไฟล์ครบชุด ส่งทันทีหลังชำระเงิน
            </p>
            <div className="space-y-2.5 pt-1">
              {[
                { icon: <Phone size={14} />, text: "082-XXX-XXXX" },
                { icon: <Mail size={14} />, text: "contact@baanplan.com" },
                { icon: <MapPin size={14} />, text: "กรุงเทพมหานคร, ประเทศไทย" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-white/40 text-sm">
                  <span className="text-gold flex-shrink-0">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white text-sm mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-sm hover:text-gold transition-colors inline-flex items-center gap-1 group"
                    >
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0 duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-xs">
          <p>© 2025 BaanPlan. สงวนลิขสิทธิ์ทุกประการ</p>
          <p>ออกแบบสำหรับคนไทย 🏠</p>
        </div>
      </div>
    </footer>
  )
}
