"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  Settings,
  Home,
  Bookmark,
  List
} from "lucide-react"

interface ChapterContentProps {
  id: string
  title: string
  currentChapter: number
  totalChapters: number
  prevChapter: number | null
  nextChapter: number | null
}

export function ChapterContent({ 
  id, 
  title, 
  currentChapter, 
  totalChapters,
  prevChapter, 
  nextChapter 
}: ChapterContentProps) {
  const [showChapterList, setShowChapterList] = useState(false)
  const [canSwipe, setCanSwipe] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    setCanSwipe(isMobile)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!canSwipe) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > threshold && nextChapter) {
        window.location.href = `/truyen/${id}/${nextChapter}`
      } else if (diff < -threshold && prevChapter) {
        window.location.href = `/truyen/${id}/${prevChapter}`
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevChapter) {
        window.location.href = `/truyen/${id}/${prevChapter}`
      } else if (e.key === 'ArrowRight' && nextChapter) {
        window.location.href = `/truyen/${id}/${nextChapter}`
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [id, prevChapter, nextChapter])

  const getChapterContent = (chapterNum: number, storyTitle: string, totalChapters: number, nextChapter: number | null) => {
    const paragraphs = [
      `Ánh trăng le lói qua khe cửa sổ, chiếu những vệt sáng mờ ảo xuống sàn nhà gỗ. Nguyệt Nhi ngồi bên cạnh cửa sổ, đôi mắt cô hướng về phía xa xa, nơi có một bóng dáng mà cô đã chờ đợi suốt nhiều đêm.`,
      `"Nguyệt Nhi, con đang nghĩ gì vậy?" giọng mẹ vọng lên từ phía sau. "Con... không có gì ạ." cô đáp, giọng run rẩy. Cô biết mình không thể nói cho mẹ nghe về mối tình đầu đau đớn ấy.`,
      `Tại biệt thự hoàng gia, Vương Gia đang ngồi trong phòng làm việc, đối mặt với một chồng giấy tờ đầy ắp. Hắn là người đàn ông quyền lực nhất vương quốc, nhưng trong lòng hắn lại trống rỗng như vậy.`,
      `"Vương gia, có người muốn gặp ngài." thị vệ báo. "Ai?" "Nguyệt Nhi - cô ấy đã trở lại." Vương Gia đứng phắt dậy, đôi mắt hắn mở to.`,
      `Ba năm, hắn đã tìm kiếm khắp nơi nhưng không thấy bóng dáng của cô. Và bây giờ, cô lại xuất hiện trước cửa như một cơn gió.`,
      `"Nguyệt Nhi, tại sao cô lại quay lại?" hắn hỏi, giọng đầy mâu thuẫn. Cô mỉm cười, nụ cười đau đớn nhưng vẫn kiên cường.`,
      `"Vì tôi chưa bao giờ rời bỏ anh, Vương Gia. Dù anh đã phản bội tôi, dù tất cả nói rằng tôi ngu ngốc... tôi vẫn yêu anh." Nước mắt cô rơi, nhưng cô không khóc.`,
      `Cô mạnh mẽ hơn bao giờ hết. Cô đã qua bao nhiêu đêm mất ngủ, bao nhiêu lần tự hỏi rằng tình yêu này có xứng đáng không.`,
      `"Em biết không," hắn nói, giọng run, "ta đã hối hận suốt ba năm. Ta đã sai khi bỏ rơi em, ta đã sai khi nghe theo lời mẹ ta."`,
      `"Nhưng em... em có thể tha thứ cho ta không?" Nguyệt Nhi lặng lẽ nhìn hắn. Trong ánh mắt ấy, có đau thương, có tình yêu, và cũng có sự chấp nhận.`,
      `"Anh à," cô thì thầm, "ta không thể quay lại như trước. Nhưng ta có thể bắt đầu lại."`,
      `"Không phải vì tình yêu, mà vì ta đã đủ trưởng thành để hiểu rằng... cuộc đời này quá ngắn để giận hờn."`,
      `Vương Gia ôm chầm lấy cô, hắn run rẩy như một đứa trẻ. Hắn không xin lỗi bằng lời, mà bằng hành động.`,
      `Hắn sẽ chứng minh bằng cả cuộc đời còn lại rằng cô là tất cả của hắn. Không còn gì có thể ngăn cản họ được ở bên nhau.`,
      `Ngoài cửa sổ, ánh trăng vẫn sáng như ba năm trước. Nhưng lần này, họ không còn cô đơn.`,
      `Mọi thứ đã thay đổi. Không còn là những đêm cô ngồi một mình với ly trà nguội lạnh, không còn là những tin nhắn không được trả lời.`,
      `Bây giờ, họ đã ở bên nhau. Và đó là tất cả những gì cô từng mong muốn.`,
      `Đêm đó, họ ngồi bên nhau cho đến khi bình minh ló dạng. Không ai nói gì, nhưng cả hai đều hiểu rằng... đây mới là khởi đầu.`,
      `"Chương ${chapterNum} kết thúc tại đây. Hãy đón đọc chương tiếp theo để tiếp tục câu chuyện của họ."`
    ]
    
    const content = [
      `${"=".repeat(40)}`,
      `Chương ${chapterNum}: ${storyTitle}`,
      `Phần ${chapterNum} / ${totalChapters} chương`,
      `${"=".repeat(40)}`,
      "",
      ...paragraphs.slice(0, Math.min(8 + (chapterNum % 5), paragraphs.length)),
      "",
      `${"-".repeat(40)}`,
      `Hết chương ${chapterNum}`,
      `${"-".repeat(40)}`,
      "",
      `Chương sau: ${nextChapter ? `Chương ${nextChapter}` : "Hết truyện"}`
    ]
    
    return content.join('\n')
  }
  
  const mockContent = getChapterContent(currentChapter, title, totalChapters, nextChapter)

  return (
    <>
      {/* Chapter Navigation Bar */}
      <div className="sticky top-16 z-20 bg-[#0d0a1a]/95 backdrop-blur-sm border-b border-[#2d1f4a]">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#9ca3af] hover:text-[#a855f7] transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4 text-[#6b7280]" />
              <Link href={`/truyen/${id}`} className="text-[#9ca3af] hover:text-[#a855f7] transition-colors truncate max-w-[150px]">
                {title}
              </Link>
              <ChevronRight className="w-4 h-4 text-[#6b7280]" />
              <span className="text-[#a855f7] font-medium">Chương {currentChapter}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowChapterList(!showChapterList)}
                className="p-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-[#2d1f4a] transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-[#2d1f4a] transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] hover:bg-[#2d1f4a] transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List Modal */}
      {showChapterList && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1428] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-[#2d1f4a]">
            <div className="p-4 border-b border-[#2d1f4a] flex items-center justify-between">
              <h3 className="font-semibold text-[#f5f5f7]">Danh sách chương</h3>
              <button 
                onClick={() => setShowChapterList(false)}
                className="text-[#9ca3af] hover:text-[#f5f5f7]"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-2 space-y-1">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                <Link
                  key={ch}
                  href={`/truyen/${id}/${ch}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    ch === currentChapter 
                      ? "bg-[#a855f7]/20 text-[#a855f7]" 
                      : "text-[#9ca3af] hover:bg-[#2d1f4a] hover:text-[#f5f5f7]"
                  }`}
                >
                  Chương {ch}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swipe Hint */}
      {canSwipe && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-10 text-[#6b7280] text-xs bg-[#1a1428]/80 px-3 py-1 rounded-full animate-pulse">
          ← Vuốt sang trái/phải để chuyển chương →
        </div>
      )}

      {/* Story Info */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#f5f5f7] mb-2">{title}</h1>
          <p className="text-[#9ca3af]">Chương {currentChapter} / {totalChapters}</p>
        </div>

        {/* Chapter Content with Touch Events */}
        <div 
          ref={contentRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="bg-[#1a1428]/50 rounded-2xl p-6 md:p-8 border border-[#2d1f4a]/50 select-none"
        >
          <div className="prose prose-invert max-w-none">
            {mockContent.split('\n').map((line, idx) => {
              if (line.trim() === '') return <br key={idx} />
              if (line.startsWith('=')) return null
              if (line.startsWith('*')) return <p key={idx} className="text-center text-[#6b7280] my-4">{line}</p>
              if (line.startsWith('***')) return <hr key={idx} className="my-6 border-[#2d1f4a]" />
              return (
                <p key={idx} className="text-[#d1d5db] leading-relaxed mb-4">
                  {line}
                </p>
              )
            })}
          </div>
        </div>

        {/* Chapter Navigation - Desktop */}
        <div className="hidden md:flex items-center justify-between mt-8 gap-4">
          {prevChapter ? (
            <Link 
              href={`/truyen/${id}/${prevChapter}`}
              className="flex-1 flex items-center gap-3 px-6 py-4 rounded-xl bg-[#1a1428] hover:bg-[#2d1f4a] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <ChevronLeft className="w-6 h-6 text-[#a855f7] group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <p className="text-xs text-[#9ca3af]">Chương trước</p>
                <p className="text-base text-[#f5f5f7] font-semibold">Chương {prevChapter}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          
          <div className="px-6 py-2 rounded-full bg-[#1a1428] text-[#9ca3af] text-sm font-medium border border-[#2d1f4a]/50">
            {currentChapter} / {totalChapters}
          </div>
          
          {nextChapter ? (
            <Link 
              href={`/truyen/${id}/${nextChapter}`}
              className="flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-xl bg-[#1a1428] hover:bg-[#2d1f4a] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group"
            >
              <div className="text-right">
                <p className="text-xs text-[#9ca3af]">Chương tiếp</p>
                <p className="text-base text-[#f5f5f7] font-semibold">Chương {nextChapter}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#a855f7] group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Chapter Navigation - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 flex md:hidden z-20 bg-gradient-to-t from-[#0d0a1a] via-[#0d0a1a] to-transparent pt-4 pb-4 px-4">
          <div className="flex gap-2 w-full">
            {prevChapter && (
              <Link 
                href={`/truyen/${id}/${prevChapter}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#1a1428]/95 backdrop-blur border border-[#2d1f4a]/50 text-[#f5f5f7] font-semibold shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Chương {prevChapter}</span>
              </Link>
            )}
            {nextChapter && (
              <Link 
                href={`/truyen/${id}/${nextChapter}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-semibold shadow-lg"
              >
                <span>Chương {nextChapter}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="hidden md:block text-center mt-4 text-sm text-[#6b7280]">
          ← → Dùng phím mũi tên để chuyển chương
        </div>

        {/* Comment Section */}
        <div className="mt-20 md:mt-10 pb-24 md:pb-8">
          <h3 className="text-lg font-bold text-[#f5f5f7] mb-4">Bình luận</h3>
          <div className="bg-[#1a1428]/50 rounded-xl p-4 border border-[#2d1f4a]/50">
            <textarea 
              placeholder="Viết bình luận của bạn..."
              className="w-full bg-transparent border-none outline-none text-[#d1d5db] placeholder-[#6b7280] resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}