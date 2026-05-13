import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { StoryListItem, StoryCard } from "@/components/story-card"
import { fetchComicsByCategory, fetchCategories, getComicThumbUrl, getComicRating, type ComicItem } from "@/lib/otruyen-api"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [categories, { items: comics }] = await Promise.all([
    fetchCategories(),
    fetchComicsByCategory(slug),
  ])

  const category = categories.find(c => c.slug === slug)
  if (!category) notFound()

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6">
            <Link href="/" className="hover:text-[#a855f7]">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/the-loai" className="hover:text-[#a855f7]">Thể loại</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#f5f5f7]">{category.name}</span>
          </nav>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#f5f5f7]">{category.name}</h1>
            <p className="text-[#9ca3af] mt-1">{comics.length} truyện</p>
          </div>

          {comics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {comics.map(item => (
                <StoryCard
                  key={item._id}
                  id={item.slug}
                  title={item.name}
                  cover={getComicThumbUrl(item.thumb_url)}
                  genre={category.name}
                  rating={getComicRating(item._id)}
                  isHot={item.status === 'ongoing'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#9ca3af]">
              Không có truyện nào trong thể loại này
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  )
}