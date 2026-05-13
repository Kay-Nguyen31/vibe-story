"use client"

import Link from "next/link"
import { Play, BookOpen } from "lucide-react"
import { useReadingHistory } from "@/hooks/use-reading-history"
import { getComicThumbUrl } from "@/lib/otruyen-api"

export function ContinueReading() {
  const { history } = useReadingHistory()

  if (history.length === 0) return null

  const latest = history[0]

  return (
    <section className="max-w-[1400px] mx-auto px-4 pb-8 pt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#f5f5f7] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#a855f7]" /> Đọc tiếp
        </h2>
        <Link href="/lich-su-doc" className="text-sm text-[#a855f7] hover:underline">Xem tất cả</Link>
      </div>

      <Link
        href={`/truyen/${latest.slug}/${latest.chapter}`}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#a855f7]/20 to-[#ec4899]/10 border border-[#a855f7]/30 hover:border-[#a855f7]/50 transition-all group"
      >
        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#2d1f4a] shrink-0">
          <img
            src={getComicThumbUrl(latest.thumbUrl)}
            alt={latest.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#f5f5f7] group-hover:text-[#a855f7] transition-colors truncate">{latest.title}</p>
          <p className="text-sm text-[#9ca3af] mt-1">Chapter {latest.chapter} / {latest.totalChapters}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] flex items-center justify-center shrink-0">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </div>
      </Link>

      {history.length > 1 && (
        <div className="mt-3 space-y-2">
          {history.slice(1, 4).map(item => (
            <Link
              key={item.slug}
              href={`/truyen/${item.slug}/${item.chapter}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1428]/50 hover:bg-[#2d1f4a]/50 border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#2d1f4a] shrink-0">
                <img src={getComicThumbUrl(item.thumbUrl)} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f5f5f7] truncate group-hover:text-[#a855f7]">{item.title}</p>
                <p className="text-xs text-[#9ca3af]">Ch. {item.chapter}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}