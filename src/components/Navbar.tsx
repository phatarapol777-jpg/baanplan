"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home } from "lucide-react"
import clsx from "clsx"

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/plans", label: "แบบบ้านทั้งหมด" },
  { href: "/blog", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "ติดต่อ" },
]

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [transparent])

  const isLight = !transparent || scrolled

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
        isLight
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              isLight ? "bg-ink" : "bg-white"
            )}>
              <Home className={clsx("w-4.5 h-4.5", isLight ? "text-white" : "text-ink")} size={17} />
            </div>
            <span className={clsx(
              "font-display font-bold text-[1.15rem] transition-colors",
              isLight ? "text-ink" : "text-white"
            )}>
              Baan<span className="text-gold">Plan</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  pathname === link.href
                    ? isLight ? "text-gold" : "text-gold"
                    : isLight ? "text-ink/70 hover:text-ink" : "text-white/85 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className={clsx(
                "text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200",
                isLight
                  ? "bg-ink text-white hover:bg-ink/80"
                  : "bg-white text-ink hover:bg-white/90"
              )}
            >
              ติดต่อเรา
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={clsx(
              "md:hidden transition-colors p-1",
              isLight ? "text-ink" : "text-white"
            )}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-1 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-sm font-medium text-ink/70 hover:text-ink hover:bg-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-dark block text-center">
                ติดต่อเรา
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
