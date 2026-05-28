const stats = [
  { value: "100+", label: "แบบบ้าน", desc: "อัพเดทสม่ำเสมอ" },
  { value: "500+", label: "ลูกค้าพึงพอใจ", desc: "ทั่วประเทศ" },
  { value: "6", label: "สไตล์บ้าน", desc: "ครบทุกไลฟ์สไตล์" },
  { value: "5 ปี", label: "ประสบการณ์", desc: "ออกแบบและจำหน่าย" },
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-ink">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="text-center lg:px-10">
              <p className="font-display font-black text-5xl text-gradient-gold">{s.value}</p>
              <p className="text-white font-semibold mt-3 text-[0.95rem]">{s.label}</p>
              <p className="text-white/35 text-sm mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
