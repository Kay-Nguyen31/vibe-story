import Link from "next/link"
import { Heart, BookOpen, Clock, Trash2, Eye } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { fetchHome, getComicThumbUrl } from "@/lib/otruyen-api"

export default async function YeuThichPage() {
  const { items: comics } = await fetchHome()
  const favorites = comics.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      <Sidebar />
      <main className="pt-32 lg:pl-56 relative z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f5f5f7] mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-[#ec4899]" /> Yêu thích
            </h1>
            <p className="text-[#9ca3af]">Danh sách truyện bạn đã lưu</p>
          </div>

          <div className="flex items-center gap-6 mb-8 p-4 bg-[#1a1428]/50 rounded-xl border border-[#2d1f4a]/50">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#a855f7]" />
              <span className="text-[#f5f5f7] font-medium">{favorites.length}</span>
              <span className="text-[#9ca3af]">truyện</span>
            </div>
          </div>

          <section>
            <div className="space-y-3">
              {favorites.map(item => (
                <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a1428]/50 hover:bg-[#2d1f4a]/50 border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#2d1f4a] shrink-0">
                    <img src={getComicThumbUrl(item.thumb_url)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/truyen/${item.slug}`} className="font-semibold text-[#f5f5f7] group-hover:text-[#a855f7] line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#a855f7]/20 text-[#a855f7]">{item.category?.[0]?.name || 'Khác'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/truyen/${item.slug}`} className="p-2 rounded-full bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-colors">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  )
}