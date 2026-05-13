import Link from "next/link"
import { Star, Heart, TrendingUp, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { AnimatedSection } from "@/components/animated-section"
import { ContinueReading } from "@/components/continue-reading"
import { StoryListItem, StoryCard, FeaturedStoryCard } from "@/components/story-card"
import { fetchHome, fetchCategories, getComicThumbUrl, getComicRating } from "@/lib/otruyen-api"

export default async function Home() {
  const [{ items: comics }, categories] = await Promise.all([
    fetchHome(),
    fetchCategories(),
  ])

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />

      <main className="relative z-10 pt-32">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="relative w-full h-[320px] md:h-[450px]">
            <img 
              src="/banner.jpg" 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a1a]/90 via-[#0d0a1a]/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1400px] mx-auto px-4 w-full">
                <div className="max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-bold text-[#f5f5f7] mb-4">
                    Khám phá thế giới{' '}
                    <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                      Truyện Tranh
                    </span>
                  </h1>
                  <p className="text-[#d1d5db] text-base md:text-lg mb-6">
                    Hàng ngàn bộ truyện tranh hấp dẫn đang chờ bạn khám phá
                  </p>
                  <Link 
                    href="/kham-pha"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Khám phá ngay <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Reading */}
        <ContinueReading />

        {/* Hot Stories Section */}
        <AnimatedSection>
          <section className="max-w-[1400px] mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#f5f5f7] flex items-center gap-2">
                🔥 Truyện nổi bật
              </h2>
              <Link href="/kham-pha" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
              {comics.slice(0, 8).map((item) => (
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
          </section>
        </AnimatedSection>

        {/* Featured Story */}
        <AnimatedSection delay={100}>
          <section className="max-w-[1400px] mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#f5f5f7] flex items-center gap-2">
                📖 Đề cử cho bạn
              </h2>
            </div>
            {comics.length > 0 && (
              <FeaturedStoryCard
                id={comics[0].slug}
                title={comics[0].name}
                cover={getComicThumbUrl(comics[0].thumb_url)}
                genre={comics[0].category?.[0]?.name || 'Khác'}
                description={comics[0].origin_name?.join(', ') || comics[0].name}
                rating={getComicRating(comics[0]._id)}
                chapters={comics[0].chaptersLatest?.length || 0}
                tags={comics[0].category?.map(c => c.name) || []}
              />
            )}
          </section>
        </AnimatedSection>

        {/* Rankings Section */}
        <AnimatedSection delay={200} direction="fade">
          <section className="bg-gradient-to-b from-[#1a1428]/50 to-transparent py-12">
            <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#f5f5f7] flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#a855f7]" /> Bảng xếp hạng
                </h2>
                <Link href="/bang-xep-hang" className="text-sm text-[#a855f7] hover:underline flex items-center gap-1">
                  Xem tất cả <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-[#1a1428]/50 rounded-2xl p-4">
                {comics.slice(0, 10).map((item, idx) => (
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
            </div>
          </section>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection delay={300} direction="up">
          <section className="max-w-[1400px] mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Truyện hấp dẫn", value: `${comics.length}+` },
                { label: "Tác giả", value: "2.5K+" },
                { label: "Thành viên", value: "50K+" },
                { label: "Lượt đọc/ngày", value: "100K+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50">
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-[#9ca3af] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  )
}