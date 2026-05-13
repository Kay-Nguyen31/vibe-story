import Link from "next/link"
import { 
  Star, 
  Eye, 
  BookOpen, 
  Heart, 
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { Badge } from "@/components/ui/badge"
import { StoryListItem } from "@/components/story-card"
import { fetchComicBySlug, fetchHome, getComicThumbUrl, getComicRating, getChapterImageUrl } from "@/lib/otruyen-api"
import { notFound, redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params
  const comsic = await fetchComicBySlug(id)
  
  if (!comsic) {
    notFound()
  }

  const { items: allComics } = await fetchHome()
  const relatedComics = allComics.filter(c => c.slug !== id).slice(0, 5)

  const allChapters = comsic.chapters?.[0]?.server_data || []
  const totalViews = Math.floor(Math.random() * 100000 + 5000)
  const rating = getComicRating(comsic._id).toFixed(1)
  const followers = Math.floor(Math.random() * 10000 + 500)

  const statusBadge = comsic.status === 'ongoing' ? 'Đang ra' : comsic.status === 'completed' ? 'Hoàn thành' : 'Sắp ra'

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      
      <main className="pt-32 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#a855f7] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/kham-pha" className="hover:text-[#a855f7] transition-colors">Khám phá</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#f5f5f7]">{comsic.name}</span>
          </nav>

          {/* Comic Info */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Cover */}
              <div className="relative w-full md:w-56 h-80 md:h-80 rounded-2xl overflow-hidden bg-[#1a1428] shadow-2xl shrink-0">
                <img 
                  src={getComicThumbUrl(comsic.thumb_url)} 
                  alt={comsic.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f5f7] mb-2">{comsic.name}</h1>
                {comsic.author?.length > 0 && comsic.author[0] && (
                  <p className="text-[#9ca3af] mb-3">Tác giả: {comsic.author.join(', ')}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {comsic.category?.map(cat => (
                    <Link 
                      key={cat.id}
                      href={`/the-loai/${cat.slug}`}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7]/30 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    comsic.status === 'ongoing' ? 'bg-green-500/20 text-green-500' :
                    comsic.status === 'completed' ? 'bg-blue-500/20 text-blue-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {statusBadge}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" /> {rating}
                  </span>
                  <span className="flex items-center gap-1 text-[#9ca3af]">
                    <Eye className="w-4 h-4" /> {totalViews.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-[#ec4899]">
                    <Heart className="w-4 h-4 fill-current" /> {followers.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-[#9ca3af]">
                    <BookOpen className="w-4 h-4" /> {allChapters.length} chương
                  </span>
                </div>

                <p className="text-[#d1d5db] leading-relaxed mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: comsic.content || '' }}
                />

                <div className="flex flex-wrap gap-3">
                  <Link 
                    href={`/truyen/${comsic.slug}/1`}
                    className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Đọc từ đầu
                  </Link>
                  <button className="h-10 px-5 rounded-full border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-white inline-flex items-center justify-center gap-2 text-sm font-medium transition-all">
                    <Heart className="w-4 h-4" /> Theo dõi
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Chapters & Related */}
          <section className="mb-8 scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Danh sách chương */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#f5f5f7]">Danh sách chương</h2>
                  <span className="text-sm text-[#a855f7]">{allChapters.length} chương</span>
                </div>
                
                <div className="bg-[#1a1428]/50 rounded-2xl p-4 space-y-2 border border-[#2d1f4a]/50 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a855f7]/50 [&::-webkit-scrollbar-track]:bg-transparent">
                  {[...allChapters].reverse().map((ch, idx) => (
                    <Link 
                      key={`${ch.chapter_name}-${idx}`}
                      href={`/truyen/${comsic.slug}/${ch.chapter_name}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#2d1f4a] transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#f5f5f7] group-hover:text-[#a855f7] transition-colors">
                          {comsic.name} [Chap {ch.chapter_name}]
                        </span>
                        {idx === 0 && (
                          <Badge className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white border-0 text-xs">
                            Mới
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6b7280] group-hover:text-[#a855f7] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Truyện liên quan */}
              <div>
                <h2 className="text-xl font-bold text-[#f5f5f7] mb-4">Truyện liên quan</h2>
                <div className="bg-[#1a1428]/50 rounded-2xl p-4 border border-[#2d1f4a]/50 space-y-1">
                  {relatedComics.map(item => (
                    <StoryListItem
                      key={item._id}
                      id={item.slug}
                      title={item.name}
                      cover={getComicThumbUrl(item.thumb_url)}
                      genre={item.category?.[0]?.name || 'Khác'}
                      rating={getComicRating(item._id)}
                    />
                  ))}
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