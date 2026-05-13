"use client"

import Link from "next/link"
import { History, Clock, Trash2, Play } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { useReadingHistory } from "@/hooks/use-reading-history"
import { getComicThumbUrl } from "@/lib/otruyen-api"

export default function LichSuDocPage() {
  const { history, clearHistory } = useReadingHistory()

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2 flex items-center gap-3">
                <History className="w-8 h-8 text-[#a855f7]" /> Lịch sử đọc
              </h1>
              <p className="text-[#9ca3af]">Những truyện bạn đã đọc gần đây</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ec4899]/20 text-[#ec4899] hover:bg-[#ec4899] hover:text-white transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" /> Xoá lịch sử
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <>
              {/* Continue reading banner */}
              <div className=" mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/10 border border-[#a855f7]/30">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-[#f5f5f7] mb-1">Tiếp tục đọc</h2>
                    <p className="text-[#9ca3af] text-sm truncate">{history[0].title}</p>
                  </div>
                  <Link
                    href={`/truyen/${history[0].slug}/${history[0].chapter}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity shrink-0"
                  >
                    <Play className="w-4 h-4" /> Đọc tiếp
                  </Link>
                </div>
              </div>

              {/* History list */}
              <section>
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a1428]/50 hover:bg-[#2d1f4a]/50 border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
                    >
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#2d1f4a] shrink-0">
                        <img src={getComicThumbUrl(item.thumbUrl)} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 right-1 text-xs text-white font-medium bg-black/60 px-1 rounded text-center">
                          Ch. {item.chapter}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/truyen/${item.slug}`} className="font-semibold text-[#f5f5f7] group-hover:text-[#a855f7] line-clamp-1">
                          {item.title}
                        </Link>
                        <p className="text-sm text-[#9ca3af] mt-1">Chapter {item.chapter} / {item.totalChapters}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[#9ca3af]">Tiến độ</span>
                            <span className="text-[#a855f7]">{Math.round((item.chapter / item.totalChapters) * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-[#2d1f4a] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full transition-all"
                              style={{ width: `${Math.round((item.chapter / item.totalChapters) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="flex items-center gap-1 text-xs text-[#9ca3af]">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(item.lastRead)}
                        </span>
                        <Link
                          href={`/truyen/${item.slug}/${item.chapter}`}
                          className="p-2 rounded-full bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a1428] flex items-center justify-center mb-6">
                <History className="w-10 h-10 text-[#9ca3af]" />
              </div>
              <h2 className="text-xl font-semibold text-[#f5f5f7] mb-2">Chưa có lịch sử đọc</h2>
              <p className="text-[#9ca3af] mb-6">Bắt đầu đọc truyện để xem lịch sử tại đây</p>
              <Link
                href="/kham-pha"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Khám phá truyện hay
              </Link>
            </div>
          )}
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