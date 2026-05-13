import Link from "next/link"
import { Flame, TrendingUp, Star, Eye, ChevronRight, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryCard, StoryListItem } from "@/components/story-card"
import { fetchHome, fetchList, getComicThumbUrl, getComicRating } from "@/lib/otruyen-api"

export default async function TruyenHotPage() {
  const [{ items: homeItems }, { items: newItems }] = await Promise.all([
    fetchHome(),
    fetchList('dang-phat-hanh'),
  ])

  const hotComics = homeItems.slice(0, 8)
  const trendingComics = newItems.slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-[#a855f7]/20 via-[#ec4899]/10 to-transparent border border-[#a855f7]/30 overflow-hidden">
            <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2 flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500" /> Truyện Hot
            </h1>
            <p className="text-[#9ca3af]">Những truyện đang gây bão trong cộng đồng</p>
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#a855f7]">{hotComics.length}</p>
                <p className="text-sm text-[#9ca3af]">Truyện hot</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ec4899]">50K+</p>
                <p className="text-sm text-[#9ca3af]">Lượt đọc/ngày</p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Nổi bật nhất
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotComics.slice(0, 2).map(item => (
                <Link
                  key={item._id}
                  href={`/truyen/${item.slug}`}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/10 border border-[#a855f7]/20 hover:border-[#a855f7]/50 transition-all hover:scale-[1.02]"
                >
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-sm">
                      <Flame className="w-4 h-4" /> Hot
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-[#2d1f4a] shrink-0">
                      <img src={getComicThumbUrl(item.thumb_url)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#f5f5f7] group-hover:text-[#a855f7] line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-[#a855f7] mt-1">{item.category?.[0]?.name || 'Khác'}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-sm text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />4.5
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[#9ca3af]">
                          <Eye className="w-4 h-4" />{Math.floor(Math.random() * 50 + 10)}K
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">Tất cả truyện hot</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {hotComics.map(item => (
                <StoryCard
                  key={item._id}
                  id={item.slug}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  rating={getComicRating(item._id)}
                  isHot
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#a855f7]" /> Xu hướng
            </h2>
            <div className="bg-[#1a1428]/50 rounded-2xl p-4 space-y-1 border border-[#2d1f4a]/50">
              {trendingComics.map((item, idx) => (
                <StoryListItem
                  key={item._id}
                  id={item.slug}
                  rank={idx + 1}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  rating={getComicRating(item._id)}
                />
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  )
}