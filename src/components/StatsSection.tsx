interface StatsSectionProps {
  planCount: number
  styleCount: number
}

export default function StatsSection({ planCount, styleCount }: StatsSectionProps) {
  const stats = [
    { value: `${planCount}+`, label: "แบบบ้าน", desc: "พร้อมสร้างได้ทันที" },
    { value: `${styleCount}`, label: "สไตล์บ้าน", desc: "ครบทุกไลฟ์สไตล์" },
  ]

  return (
    <section className="py-20 bg-ink">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-center gap-0 divide-x divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="text-center px-16 sm:px-24">
              <p className="font-display font-black text-6xl text-gradient-gold">{s.value}</p>
              <p className="text-white font-semibold mt-3 text-[0.95rem]">{s.label}</p>
              <p className="text-white/35 text-sm mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
