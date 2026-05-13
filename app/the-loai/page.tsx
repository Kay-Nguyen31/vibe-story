import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryCard } from "@/components/story-card"
import { fetchCategories, fetchList, getComicThumbUrl, getComicRating } from "@/lib/otruyen-api"

export default async function TheLoaiPage() {
  const [categories, { items: comics }] = await Promise.all([
    fetchCategories(),
    fetchList('truyen-moi', 1),
  ])

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2">Thể loại</h1>
            <p className="text-[#9ca3af]">Khám phá truyện theo thể loại yêu thích của bạn</p>
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">Tất cả thể loại</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {categories.map((genre) => (
                <Link
                  key={genre._id}
                  href={`/the-loai/${genre.slug}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#1a1428] hover:bg-[#2d1f4a] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7 text-[#a855f7]" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-[#f5f5f7] group-hover:text-[#a855f7] transition-colors">
                      {genre.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">Gợi ý cho bạn</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {comics.slice(0, 6).map(item => (
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
        </div>
        <Footer />
      </main>
    </div>
  )
}