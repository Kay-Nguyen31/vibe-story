"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, 
  ChevronRight, 
  Home,
  List,
} from "lucide-react"
import { useReadingHistory } from "@/hooks/use-reading-history"

interface ChapterReaderProps {
  comicSlug: string
  comicTitle: string
  comicThumb: string
  currentChapter: number
  totalChapters: number
  prevChapter: number | null
  nextChapter: number | null
  images: string[]
}

export function ChapterReader({
  comicSlug,
  comicTitle,
  comicThumb,
  currentChapter,
  totalChapters,
  prevChapter,
  nextChapter,
  images
}: ChapterReaderProps) {
  const router = useRouter()
  const { saveProgress } = useReadingHistory()
  const [loaded, setLoaded] = useState<Set<number>>(new Set())
  const [showSwipeBanner, setShowSwipeBanner] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const lastImageRef = useRef<HTMLDivElement>(null)

  // Save reading progress
  useEffect(() => {
    saveProgress({
      slug: comicSlug,
      title: comicTitle,
      thumbUrl: comicThumb,
      chapter: currentChapter,
      totalChapters,
      lastRead: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }, [comicSlug, currentChapter])

  // IntersectionObserver to detect last image
  useEffect(() => {
    const el = lastImageRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShowSwipeBanner(true)
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [images])

  const goToChapter = useCallback((ch: number) => {
    router.push(`/truyen/${comicSlug}/${ch}`)
  }, [comicSlug, router])

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoaded(new Set())
  }, [currentChapter])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevChapter) {
        goToChapter(prevChapter)
      } else if (e.key === 'ArrowRight' && nextChapter) {
        goToChapter(nextChapter)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevChapter, nextChapter, goToChapter])

  // Touch swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 80

    if (Math.abs(diff) > threshold) {
      if (diff > threshold && nextChapter) {
        goToChapter(nextChapter)
      } else if (diff < -threshold && prevChapter) {
        goToChapter(prevChapter)
      }
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-16 z-20 bg-[#0d0a1a]/95 backdrop-blur-sm border-b border-[#2d1f4a]">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Link href="/" className="text-[#9ca3af] hover:text-[#a855f7] shrink-0">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4 text-[#6b7280] shrink-0" />
              <Link href={`/truyen/${comicSlug}`} className="text-[#9ca3af] hover:text-[#a855f7] truncate">
                {comicTitle}
              </Link>
              <ChevronRight className="w-4 h-4 text-[#6b7280] shrink-0" />
              <span className="text-[#a855f7] font-medium shrink-0">Chap {currentChapter}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/truyen/${comicSlug}`}
                className="p-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] transition-colors"
                title="Danh sách chương"
              >
                <List className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comic Images with Touch Events */}
      <div 
        className="max-w-4xl mx-auto px-4 py-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#f5f5f7]">{comicTitle}</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Chapter {currentChapter} / {totalChapters}</p>
        </div>

        {/* Images */}
          {images.map((src, idx) => (
            <div 
              key={idx}
              ref={idx === images.length - 1 ? lastImageRef : null}
              className="bg-[#1a1428]/30 overflow-hidden"
            >
              <img
                src={src}
                alt={`${comicTitle} - Chapter ${currentChapter} - Page ${idx + 1}`}
                className="w-full h-auto mx-auto"
                loading="lazy"
                onLoad={() => setLoaded(prev => new Set(prev).add(idx))}
                style={{ minHeight: loaded.has(idx) ? undefined : '200px' }}
              />
            </div>
          ))}

        {/* Desktop Chapter Navigation */}
        <div className="hidden md:flex items-center justify-between mt-10 gap-4">
          {prevChapter ? (
            <Link 
              href={`/truyen/${comicSlug}/${prevChapter}`}
              className="flex-1 flex items-center gap-3 px-6 py-4 rounded-xl bg-[#1a1428] hover:bg-[#2d1f4a] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <ChevronLeft className="w-6 h-6 text-[#a855f7]" />
              <div className="text-left">
                <p className="text-xs text-[#9ca3af]">Chương trước</p>
                <p className="text-base text-[#f5f5f7] font-semibold">Chapter {prevChapter}</p>
              </div>
            </Link>
          ) : <div className="flex-1" />}
          
          <div className="px-6 py-2 rounded-full bg-[#1a1428] text-[#9ca3af] text-sm border border-[#2d1f4a]/50">
            {currentChapter} / {totalChapters}
          </div>
          
          {nextChapter ? (
            <Link 
              href={`/truyen/${comicSlug}/${nextChapter}`}
              className="flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-xl bg-[#1a1428] hover:bg-[#2d1f4a] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <div className="text-right">
                <p className="text-xs text-[#9ca3af]">Chương tiếp</p>
                <p className="text-base text-[#f5f5f7] font-semibold">Chapter {nextChapter}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#a855f7]" />
            </Link>
          ) : <div className="flex-1" />}
        </div>

        {/* Keyboard hint */}
        <div className="hidden md:flex justify-center mt-6">
          <span className="text-xs text-[#6b7280] bg-[#1a1428]/50 px-3 py-1.5 rounded-full flex items-center gap-4">
            <span><ChevronLeft className="w-3 h-3 inline" /> <ChevronRight className="w-3 h-3 inline" /> Phím mũi tên</span>
            <span>← → Chuyển chương</span>
          </span>
        </div>

        {/* Mobile - end of chapter notification */}
        <div className={`md:hidden transition-all duration-500 ${
          showSwipeBanner 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center py-4 mt-2 mb-16">
            <div className="inline-flex flex-col items-center gap-2 px-5 py-3 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50">
              <span className="text-xs text-[#9ca3af]">— Hết chương —</span>
              <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                {prevChapter && <span>← Chap {prevChapter}</span>}
                <span className="text-[#a855f7]">•</span>
                {nextChapter && <span>Chap {nextChapter} →</span>}
              </div>
              <span className="text-[10px] text-[#6b7280]">Vuốt ngang để chuyển chương</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20" />
    </>
  )
}