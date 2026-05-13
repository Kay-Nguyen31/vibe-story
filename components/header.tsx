"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Search } from "lucide-react"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/kham-pha", label: "Khám phá" },
    { href: "/the-loai", label: "Thể loại" },
    { href: "/moi-cap-nhat", label: "Mới cập nhật" },
    { href: "/bang-xep-hang", label: "Bảng xếp hạng" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-32 bg-[#0d0a1a]/90 backdrop-blur-md border-b border-[#2d1f4a]/50 max-w-md:h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-8 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Image
            src="/logo.png"
            alt="Vibe Truyện Logo"
            width={106}
            height={106}
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-md font-medium transition-colors ${
                  isActive ? "text-[#a855f7]" : "text-[#9ca3af] hover:text-[#f5f5f7]"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
            <input
              suppressHydrationWarning
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm truyện, tác giả..."
              className="w-64 pl-10 pr-4 h-9 bg-[#1a1428]/80 border border-[#2d1f4a] text-[#f5f5f7] placeholder:text-[#9ca3af] focus:border-[#a855f7] outline-none rounded-full text-sm transition-colors"
            />
          </div>
          <Link
            href="/tim-kiem"
            className="md:hidden p-2 rounded-lg text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-[#1a1428] transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
