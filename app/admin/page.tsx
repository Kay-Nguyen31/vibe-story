"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Tags, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Eye,
  Star
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/setup').catch(() => {})
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const cards = [
    { icon: BookOpen, label: "Truyện", count: stats?.stories || 0, color: "from-[#a855f7] to-[#ec4899]", href: "/admin/truyen" },
    { icon: Tags, label: "Thể loại", count: stats?.genres || 0, color: "from-blue-500 to-cyan-500", href: "/admin/the-loai" },
    { icon: FileText, label: "Chương", count: stats?.chapters || 0, color: "from-green-500 to-emerald-500", href: "/admin/chuong" },
    { icon: MessageSquare, label: "Bình luận", count: stats?.reviews || 0, color: "from-orange-500 to-amber-500", href: "/admin/binhluan" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#f5f5f7]">Tổng quan</h1>
        <p className="text-[#9ca3af] mt-1">Quản lý nội dung website</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="p-5 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} p-2.5`}>
                  <Icon className="w-full h-full text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#f5f5f7]">{card.count}</p>
              <p className="text-sm text-[#9ca3af] mt-1">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Recent Stories */}
      <div className="bg-[#1a1428] rounded-2xl border border-[#2d1f4a]/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#f5f5f7]">Truyện gần đây</h2>
          <Link href="/admin/truyen" className="text-sm text-[#a855f7] hover:underline">Xem tất cả</Link>
        </div>
        <div className="space-y-3">
          {stats?.recentStories?.map((story: any) => (
            <div key={story.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2d1f4a] transition-colors">
              <div className="w-10 h-14 rounded-lg bg-[#2d1f4a] overflow-hidden shrink-0">
                <img src={story.cover} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#f5f5f7] truncate">{story.title}</p>
                <p className="text-xs text-[#9ca3af]">{story.author} • {story.genre}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{story.views}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{story.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}