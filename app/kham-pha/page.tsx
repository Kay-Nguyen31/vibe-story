import Image from "next/image"
import Link from "next/link"
import { 
  Star, 
  Heart, 
  Sparkles, 
  Wand2, 
  Building, 
  Monitor, 
  Clock, 
  Sword, 
  Search, 
  Ghost, 
  Castle, 
  Scroll, 
  Rocket,
  ChevronRight
} from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryCard, StoryListItem } from "@/components/story-card"
import { Button } from "@/components/ui/button"
import { 
  fetchHome, 
  fetchList, 
  fetchCategories, 
  getComicThumbUrl, 
  getComicRating,
  type ComicItem 
} from "@/lib/otruyen-api"

const iconMap: Record<string, React.ElementType> = {
  Heart, Sparkles, Wand2, Building, Monitor, Clock, Sword, Search, Ghost, Castle, Scroll, Rocket
}

export default async function HomePage() {
  const [{ items: homeItems }, { items: newItems }, { items: topItems }, { items: trendingItems }, categories] = await Promise.all([
    fetchHome(),
    fetchList('truyen-moi', 1),
    fetchList('dang-phat-hanh', 1),
    fetchList('truyen-moi', 2),
    fetchCategories(),
  ])

  const released = homeItems.filter(c => c.chaptersLatest?.length > 0)
  const recommended = released.slice(0, 4)
  const ranking = topItems.slice(0, 10)
  const recent = newItems.slice(0, 8)
  const hot = released.slice(0, 8)
  const upcomingRaw = trendingItems.filter(c => !c.chaptersLatest?.length)
  const upcoming = upcomingRaw.length > 0 ? upcomingRaw.slice(0, 8) : trendingItems.slice(0, 8)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          
          {/* Hero Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Khám phá truyện hay</h2>
              <div className="hidden md:flex items-center gap-2 text-sm text-[#9ca3af]">
                <span>Tất cả thể loại</span>
                <span>•</span>
                <span>Tất cả trạng thái</span>
                <span>•</span>
                <span>Sắp xếp: Mới nhất</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#9ca3af] mb-4">Đề cử dành cho bạn</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommended.map((item) => (
                    <StoryCard
                      key={item._id}
                      id={item.slug}
                      title={item.name}
                      cover={getComicThumbUrl(item.thumb_url)}
                      genre={item.category?.[0]?.name || 'Khác'}
                      rating={getComicRating(item._id)}
                      isHot={item.status === 'ongoing'}
                    />
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:flex items-center justify-center w-48">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/section-ON3YlYo5VeOClFy9NAGPA095mjXZyc.png"
                  alt="Vibe Truyện"
                  width={150}
                  height={150}
                  className="opacity-80"
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
            </div>
          </section>

          {/* Bảng xếp hạng */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Bảng xếp hạng</h2>
              <Link href="/bang-xep-hang" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex gap-4 mb-4">
              {["Ngày", "Tuần", "Tháng", "Tất cả"].map((tab, idx) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    idx === 0 
                      ? "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white" 
                      : "text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-[#1a1428]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-[#1a1428]/50 rounded-2xl p-4">
              {ranking.map((item, idx) => (
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

          {/* Thể loại phổ biến */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Thể loại phổ biến</h2>
              <Link href="/the-loai" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
              {categories.slice(0, 12).map((genre) => {
                const Icon = iconMap[genre.name] || Star
                return (
                  <Link
                    key={genre._id}
                    href={`/the-loai/${genre.slug}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1428] hover:bg-[#2d1f4a] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2d1f4a] flex items-center justify-center group-hover:bg-[#a855f7]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#a855f7]" />
                    </div>
                    <span className="text-xs text-[#9ca3af] group-hover:text-[#f5f5f7] text-center transition-colors">
                      {genre.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Truyện mới cập nhật */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Truyện mới cập nhật</h2>
              <Link href="/moi-cap-nhat" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#1a1428]/50 rounded-2xl p-4 space-y-1">
              {recent.map((item, idx) => (
                <StoryListItem
                  key={item._id}
                  id={item.slug}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  chapter={item.chaptersLatest?.[0] ? `Ch. ${item.chaptersLatest[0].chapter_name}` : undefined}
                  rating={getComicRating(item._id)}
                  timeAgo={getTimeAgo(item.updatedAt)}
                />
              ))}
            </div>
          </section>

          {/* Truyện Hot */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Truyện Hot</h2>
              <Link href="/truyen-hot" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {hot.map((item) => (
                <StoryCard
                  key={item._id}
                  id={item.slug}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  rating={getComicRating(item._id)}
                  isHot={true}
                />
              ))}
            </div>
          </section>

          {/* Sắp ra mắt */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#f5f5f7]">Truện Nhiều người đọc</h2>
              <span className="text-sm text-[#9ca3af] flex items-center gap-1">
                Những truyện sắp được phát hành
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {upcoming.map((item) => (
                <StoryCard
                  key={item._id}
                  id={item.slug}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={item.category?.[0]?.name || 'Khác'}
                  rating={getComicRating(item._id)}
                />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-10">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1428] to-[#2d1f4a] p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#f5f5f7] mb-4">
                    Đọc truyện theo vibe của bạn
                  </h2>
                  <p className="text-[#9ca3af] mb-6">
                    Khám phá thế giới truyện tranh đa sắc màu
                  </p>
                  <Button className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-90 text-white rounded-full px-8">
                    Khám phá ngay
                  </Button>
                </div>
                <div className="w-48 lg:w-64">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/section1-P6NRii2u8qnMzwBTI3kdgZf7glLCqZ.png"
                    alt="Community"
                    style={{ width: '256px', height: '256px' }}
                    className="object-contain"
                  />
                </div>
              </div>
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