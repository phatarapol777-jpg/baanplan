import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { USE_MOCK_DATA } from "@/lib/mockData"

export const revalidate = 60

async function getContactSettings() {
  if (USE_MOCK_DATA) return {}
  try {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("key, value")
      .in("key", ["contact_phone", "contact_email", "contact_line_url", "contact_location", "contact_hours"])
    const result: Record<string, string> = {}
    data?.forEach(r => { result[r.key] = r.value ?? "" })
    return result
  } catch { return {} }
}

export default async function ContactPage() {
  const s = await getContactSettings()

  const contacts = [
    {
      icon: <Phone size={20} />,
      label: "โทรศัพท์",
      value: s.contact_phone || "082-XXX-XXXX",
      sub: "จันทร์-เสาร์ 9:00-18:00",
      href: s.contact_phone ? `tel:${s.contact_phone.replace(/-/g, "")}` : undefined,
    },
    {
      icon: <MessageCircle size={20} />,
      label: "LINE",
      value: "เพิ่มเพื่อน LINE",
      sub: "คลิกเพื่อแชทได้เลย",
      href: s.contact_line_url || undefined,
      highlight: true,
    },
    {
      icon: <Mail size={20} />,
      label: "อีเมล",
      value: s.contact_email || "contact@baanplan.com",
      sub: "ตอบกลับภายใน 24 ชั่วโมง",
      href: s.contact_email ? `mailto:${s.contact_email}` : undefined,
    },
    {
      icon: <MapPin size={20} />,
      label: "ที่ตั้ง",
      value: s.contact_location || "กรุงเทพมหานคร",
      sub: "ประเทศไทย",
    },
    {
      icon: <Clock size={20} />,
      label: "เวลาทำการ",
      value: s.contact_hours || "จันทร์ – เสาร์",
      sub: "09:00 – 18:00 น.",
    },
  ]

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

        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-display font-bold text-2xl text-ink mb-8 text-center">ช่องทางติดต่อ</h2>
          <div className="space-y-4">
            {contacts.map((info) =>
              info.href ? (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all group ${
                    info.highlight
                      ? "bg-[#06C755] hover:bg-[#05b34c]"
                      : "bg-cream hover:bg-gray-100"
                  }`}
                >
                  <div className={`flex-shrink-0 ${info.highlight ? "text-white" : "text-gold"}`}>
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[11px] uppercase tracking-widest font-semibold ${info.highlight ? "text-white/70" : "text-ink/40"}`}>
                      {info.label}
                    </p>
                    <p className={`font-semibold mt-0.5 ${info.highlight ? "text-white" : "text-ink"}`}>
                      {info.value}
                    </p>
                    <p className={`text-sm ${info.highlight ? "text-white/70" : "text-ink/50"}`}>
                      {info.sub}
                    </p>
                  </div>
                  <ExternalLink size={16} className={`flex-shrink-0 ${info.highlight ? "text-white/70" : "text-ink/30"} group-hover:opacity-100 opacity-60`} />
                </a>
              ) : (
                <div key={info.label} className="flex items-center gap-4 p-5 bg-cream rounded-2xl">
                  <div className="text-gold flex-shrink-0">{info.icon}</div>
                  <div>
                    <p className="text-[11px] text-ink/40 uppercase tracking-widest font-semibold">{info.label}</p>
                    <p className="text-ink font-semibold mt-0.5">{info.value}</p>
                    <p className="text-ink/50 text-sm">{info.sub}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
