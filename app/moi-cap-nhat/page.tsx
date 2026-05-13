import Link from "next/link"
import { Clock, RefreshCw, ChevronRight, BookOpen, Flame } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryListItem } from "@/components/story-card"
import { fetchList, getComicThumbUrl, getComicRating } from "@/lib/otruyen-api"

export default async function MoiCapNhatPage() {
  const { items: newComics } = await fetchList('truyen-moi', 1)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2">Mới cập nhật</h1>
            <p className="text-[#9ca3af]">Cập nhật chương mới nhất từ các tác giả</p>
          </div>

          <div className="flex items-center gap-2 mb-6 p-4 bg-[#1a1428]/50 rounded-xl border border-[#2d1f4a]/50">
            <RefreshCw className="w-5 h-5 text-[#a855f7]" />
            <span className="text-sm text-[#9ca3af]">
              Cập nhật lúc: <span className="text-[#f5f5f7]">{new Date().toLocaleTimeString('vi-VN')}</span>
            </span>
          </div>

          <section>
            <div className="space-y-2">
              {newComics.slice(0, 20).map((item, idx) => (
                <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a1428]/30 hover:bg-[#1a1428]/60 border border-transparent hover:border-[#a855f7]/20 transition-all group">
                  <div className="text-lg font-bold text-[#9ca3af] w-8 text-center">{String(idx + 1).padStart(2, '0')}</div>
                  <StoryListItem
                    id={item.slug}
                    title={item.name}
                    cover={getComicThumbUrl(item.thumb_url)}
                    genre={item.category?.[0]?.name || 'Khác'}
                    chapter={item.chaptersLatest?.[0] ? `Ch. ${item.chaptersLatest[0].chapter_name}` : undefined}
                    rating={getComicRating(item._id)}
                    timeAgo={getTimeAgo(item.updatedAt)}
                  />
                  {item.status === 'ongoing' && (
                    <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-orange-500">Hot</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  )
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}