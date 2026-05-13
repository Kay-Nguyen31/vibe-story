"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Compass, 
  Grid3X3, 
  TrendingUp, 
  Clock, 
  Flame, 
  Heart, 
  History 
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Compass, label: "Khám phá", href: "/kham-pha" },
  { icon: Grid3X3, label: "Thể loại", href: "/the-loai" },
  { icon: TrendingUp, label: "Bảng xếp hạng", href: "/bang-xep-hang" },
  { icon: Clock, label: "Mới cập nhật", href: "/moi-cap-nhat" },
  { icon: Flame, label: "Truyện Hot", href: "/truyen-hot" },
  { icon: Heart, label: "Yêu thích", href: "/yeu-thich" },
  { icon: History, label: "Lịch sử đọc", href: "/lich-su-doc" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-[#0d0a1a] border-r border-[#2d1f4a] overflow-y-auto hidden lg:block">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                isActive 
                  ? "bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/20 text-[#f5f5f7] border border-[#a855f7]/30" 
                  : "text-[#9ca3af] hover:bg-[#1a1428] hover:text-[#f5f5f7]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-[#a855f7]")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
