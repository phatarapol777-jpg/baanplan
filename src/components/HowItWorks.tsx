const steps = [
  {
    step: "01",
    title: "เลือกแบบบ้าน",
    desc: "เลือกจากคลัง 100+ แบบ กรองตามสไตล์ ขนาด และงบประมาณ",
    color: "bg-amber-50 border-amber-100",
  },
  {
    step: "02",
    title: "ดูรายละเอียด",
    desc: "ตรวจสอบสเปค รูปภาพ แผนผัง ทุกมุมมองก่อนตัดสินใจ",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    step: "03",
    title: "ชำระเงิน",
    desc: "โอนเงิน บัตรเครดิต หรือพร้อมเพย์ — รวดเร็ว ปลอดภัย",
    color: "bg-sky-50 border-sky-100",
  },
  {
    step: "04",
    title: "รับไฟล์ทันที",
    desc: "PDF + CAD ครบชุด ส่งตรงอีเมล ภายใน 5 นาทีหลังชำระ",
    color: "bg-violet-50 border-violet-100",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-2">ง่าย รวดเร็ว ครบชุด</p>
          <h2 className="section-heading">วิธีสั่งซื้อแบบบ้าน</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className={`rounded-2xl border p-7 ${s.color} relative overflow-hidden`}>
              <span className="absolute top-4 right-5 font-display font-black text-5xl text-black/5 select-none">
                {s.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
                <span className="font-display font-bold text-sm text-gold">{s.step}</span>
              </div>
              <h3 className="font-display font-bold text-ink text-lg mb-2">{s.title}</h3>
              <p className="text-ink/55 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
