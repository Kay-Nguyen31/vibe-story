import Link from "next/link"
import { Flame, TrendingUp, Clock, Star, Eye, Medal } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryListItem } from "@/components/story-card"
import { fetchHome, fetchList, getComicThumbUrl, getComicRating } from "@/lib/otruyen-api"

export default async function BangXepHangPage() {
  const [{ items: homeItems }] = await Promise.all([
    fetchHome(),
  ])

  const topComics = homeItems.slice(0, 10)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2">Bảng xếp hạng</h1>
            <p className="text-[#9ca3af]">Top truyện được đọc nhiều nhất và được yêu thích nhất</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "doc-nhieu", label: "Đọc nhiều", icon: Eye },
              { id: "yeu-thich", label: "Yêu thích", icon: Flame },
              { id: "dang-doc", label: "Đang đọc", icon: Clock },
              { id: "top", label: "Top", icon: Medal },
            ].map((rank, idx) => {
              const Icon = rank.icon
              return (
                <button key={rank.id} className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all ${idx === 0 ? "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white" : "bg-[#1a1428] text-[#9ca3af] hover:bg-[#2d1f4a] hover:text-[#f5f5f7]"}`}>
                  <Icon className="w-4 h-4" /> {rank.label}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2 mb-8">
            {["Ngày", "Tuần", "Tháng", "Tất cả"].map((tab, idx) => (
              <button key={tab} className={`px-4 py-2 text-sm rounded-full transition-colors ${idx === 0 ? "bg-[#2d1f4a] text-[#f5f5f7] border border-[#a855f7]/30" : "bg-transparent text-[#9ca3af] hover:text-[#f5f5f7]"}`}>
                {tab}
              </button>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">🏆 Top 3 tuần này</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topComics.slice(0, 3).map((item, idx) => (
                <Link key={item._id} href={`/truyen/${item.slug}`} className={`relative group p-6 rounded-2xl border transition-all hover:scale-[1.02] ${idx === 0 ? "bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 border-[#a855f7]/50" : "bg-[#1a1428] border-[#2d1f4a]/50"}`}>
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-white font-bold shadow-lg">{idx + 1}</div>
                  <div className="flex gap-4 mt-2">
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#2d1f4a]">
                      <img src={getComicThumbUrl(item.thumb_url)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#f5f5f7] group-hover:text-[#a855f7] line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-[#9ca3af] mt-1">{item.category?.[0]?.name || 'Khác'}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-yellow-500"><Star className="w-4 h-4 fill-current" />4.5</span>
                        <span className="flex items-center gap-1 text-sm text-[#9ca3af]"><Eye className="w-4 h-4" />{Math.floor(Math.random() * 50 + 10)}K</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">📊 Bảng xếp hạng đầy đủ</h2>
            <div className="bg-[#1a1428]/50 rounded-2xl p-4 space-y-1 border border-[#2d1f4a]/50">
              {topComics.map((item, idx) => (
                <StoryListItem
                  key={item._id}
                  id={item.slug}
                  rank={idx + 1}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  rating={getComicRating(item._id)}
                  views={`${Math.floor(Math.random() * 50 + 10)}K`}
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