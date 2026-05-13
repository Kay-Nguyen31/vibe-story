"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Search, X, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryListItem, StoryCard } from "@/components/story-card"
import { fetchSearch, getComicThumbUrl, getComicRating, type ComicItem } from "@/lib/otruyen-api"
import { useSearchParams } from "next/navigation"

function SearchContent() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const [query, setQuery] = useState(keyword)
  const [results, setResults] = useState<ComicItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!keyword) return
    setLoading(true)
    fetchSearch(keyword).then(({ items }) => {
      setResults(items)
      setLoading(false)
    })
  }, [keyword])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `/tim-kiem?keyword=${encodeURIComponent(query.trim())}`
  }

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              suppressHydrationWarning
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm truyện, tác giả..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50 text-[#f5f5f7] placeholder-[#6b7280] outline-none focus:border-[#a855f7]/50 transition-colors text-base"
              autoFocus
            />
            {query && (
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#f5f5f7]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Results */}
          {keyword && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#f5f5f7]">
                Kết quả tìm kiếm: &quot;{keyword}&quot;
              </h2>
              <p className="text-sm text-[#9ca3af] mt-1">{results.length} kết quả</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#9ca3af]">Đang tìm kiếm...</p>
            </div>
          ) : keyword && results.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-[#2d1f4a] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#f5f5f7] mb-2">Không tìm thấy kết quả</h3>
              <p className="text-[#9ca3af]">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : results.length > 0 ? (
            <div className="bg-[#1a1428]/50 rounded-2xl p-4 border border-[#2d1f4a]/50">
              <div className="space-y-1">
                {results.map((item, idx) => (
                  <StoryListItem
                    key={item._id}
                    id={item.slug}
                    title={item.name}
                    cover={getComicThumbUrl(item.thumb_url)}
                    genre={item.category?.[0]?.name || 'Khác'}
                    rating={getComicRating(item._id)}
                    chapter={item.chaptersLatest?.[0] ? `Ch. ${item.chaptersLatest[0].chapter_name}` : undefined}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-[#2d1f4a] mx-auto mb-4" />
              <p className="text-[#9ca3af]">Nhập từ khóa để tìm kiếm</p>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0a1a] flex items-center justify-center">
        <div className="text-[#9ca3af]">Đang tải...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}