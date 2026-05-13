import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShootingStars } from "@/components/shooting-stars"
import { ChapterReader } from "@/components/chapter-reader"
import { fetchComicBySlug, fetchChapterImages, getChapterImageUrl } from "@/lib/otruyen-api"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string; chapter: string }>
}

export default async function ChapterViewPage({ params }: PageProps) {
  const { id, chapter } = await params
  const chapterNum = parseInt(chapter)
  
  const comsic = await fetchComicBySlug(id)
  
  if (!comsic) notFound()

  const allChapters = comsic.chapters?.[0]?.server_data || []
  const chapterData = allChapters.find(ch => parseInt(ch.chapter_name) === chapterNum)
  const chapterIndex = allChapters.findIndex(ch => parseInt(ch.chapter_name) === chapterNum)

  if (!chapterData) notFound()

  const totalChapters = allChapters.length
  const hasPrev = chapterIndex > 0
  const hasNext = chapterIndex < totalChapters - 1
  const prevChapter = hasPrev ? parseInt(allChapters[chapterIndex - 1].chapter_name) : null
  const nextChapter = hasNext ? parseInt(allChapters[chapterIndex + 1].chapter_name) : null

  // Fetch chapter images (server-side)
  const imagesData = await fetchChapterImages(chapterData.chapter_api_data)
  const domainCdn = imagesData?.domain_cdn || ''
  const chapterPath = imagesData?.item?.chapter_path || ''
  const images = imagesData?.item?.chapter_image?.map(img => 
    getChapterImageUrl(domainCdn, chapterPath, img.image_file)
  ) || []

  return (
    <div className="min-h-screen bg-[#0d0a1a] relative overflow-hidden">
      <ShootingStars />
      <Header />
      
      <main className="pt-32 relative z-10">
        <ChapterReader
          comicSlug={id}
          comicTitle={comsic.name}
          comicThumb={comsic.thumb_url}
          currentChapter={chapterNum}
          totalChapters={totalChapters}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          images={images}
        />
      </main>
      
      <Footer />
    </div>
  )
}