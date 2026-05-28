"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutDashboard, BookImage, Tag, LogOut } from "lucide-react"
import clsx from "clsx"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, exact: true },
  { href: "/admin/plans", label: "แบบบ้าน", icon: <BookImage size={18} /> },
  { href: "/admin/categories", label: "หมวดหมู่", icon: <Tag size={18} /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-60 min-h-screen bg-ink flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Home size={15} className="text-ink" />
          </div>
          <span className="font-display font-bold text-white text-[1rem]">
            Baan<span className="text-gold">Plan</span>
          </span>
        </Link>
        <p className="text-white/30 text-[11px] mt-1.5 ml-10">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/12 text-white"
                  : "text-white/45 hover:text-white/80 hover:bg-white/6"
              )}
            >
              <span className={active ? "text-gold" : ""}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all"
        >
          <LogOut size={17} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
