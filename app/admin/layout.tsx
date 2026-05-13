"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  Tags, 
  FileText, 
  MessageSquare,
  ArrowLeft,
  Menu,
  X
} from "lucide-react"
import { ShootingStars } from "@/components/shooting-stars"
import { cn } from "@/lib/utils"
import { useState } from "react"

const adminMenu = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
  { icon: BookOpen, label: "Truyện", href: "/admin/truyen" },
  { icon: Tags, label: "Thể loại", href: "/admin/the-loai" },
  { icon: FileText, label: "Chương", href: "/admin/chuong" },
  { icon: MessageSquare, label: "Bình luận", href: "/admin/binhluan" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0d0a1a]/95 backdrop-blur-sm border-b border-[#2d1f4a] h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#1a1428] text-[#9ca3af]"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="font-semibold text-[#f5f5f7] hidden sm:block">Admin Dashboard</span>
            </Link>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-14 left-0 bottom-0 w-56 bg-[#0d0a1a] border-r border-[#2d1f4a] z-40 transition-transform duration-200",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-3 space-y-1 mt-2">
          {adminMenu.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive 
                    ? "bg-[#a855f7]/20 text-[#f5f5f7] border border-[#a855f7]/30" 
                    : "text-[#9ca3af] hover:bg-[#1a1428] hover:text-[#f5f5f7]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-[#a855f7]")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-14 lg:pl-56 relative z-10">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}