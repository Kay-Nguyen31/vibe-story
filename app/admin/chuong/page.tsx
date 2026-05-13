"use client"

import { useEffect, useState, Suspense } from "react"
import { Plus, Edit, Trash2, ArrowLeft, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Story {
  id: number
  uuid: string
  title: string
  chapters: number
}

interface Chapter {
  id: number
  story_id: number
  chapter_number: number
  title: string
  content: string
  is_new: boolean
  created_at: string
}

function AdminChuongContent() {
  const searchParams = useSearchParams()
  const storyUuid = searchParams.get('story')
  const [stories, setStories] = useState<Story[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editChapter, setEditChapter] = useState<any>(null)
  const [form, setForm] = useState({ chapter_number: 1, title: "", content: "" })

  const fetchStories = () => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data || [])
        if (storyUuid) {
          const s = (data || []).find((st: any) => st.uuid === storyUuid)
          if (s) selectStory(s)
        }
      })
  }

  useEffect(() => { fetchStories() }, [storyUuid])

  const fetchChapters = async (uuid: string) => {
    const res = await fetch(`/api/stories/${uuid}/chapters`)
    const data = await res.json()
    setChapters(data || [])
  }

  const selectStory = (story: any) => {
    setSelectedStory(story)
    fetchChapters(story.uuid)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editChapter ? 'PUT' : 'POST'
    const url = editChapter 
      ? `/api/admin/chuong/${editChapter.id}` 
      : '/api/admin/chuong'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        story_id: selectedStory.id,
        is_new: true,
      }),
    })
    
    setShowForm(false)
    setEditChapter(null)
    setForm({ chapter_number: 1, title: "", content: "" })
    fetchChapters(selectedStory.uuid)
    // Update story chapter count if adding new
    if (method === 'POST') {
      await fetch(`/api/admin/truyen/${selectedStory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: selectedStory.uuid,
          title: selectedStory.title,
          cover: selectedStory.cover,
          genre: selectedStory.genre,
          author: selectedStory.author,
          rating: selectedStory.rating,
          views: selectedStory.views,
          chapters: (selectedStory.chapters || 0) + 1,
          status: selectedStory.status,
          is_hot: selectedStory.is_hot,
          is_new: selectedStory.is_new,
          description: selectedStory.description || '',
        }),
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá chương này?')) return
    await fetch(`/api/admin/chuong/${id}`, { method: 'DELETE' })
    fetchChapters(selectedStory.uuid)
  }

  const openEdit = (chapter: Chapter) => {
    setEditChapter(chapter)
    setForm({
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      content: chapter.content,
    })
    setShowForm(true)
  }

  const openAdd = () => {
    const maxNum = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) : 0
    setEditChapter(null)
    setForm({ chapter_number: maxNum + 1, title: `Chương ${maxNum + 1}`, content: "" })
    setShowForm(true)
  }

  // Story selector
  if (!selectedStory) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#f5f5f7]">Quản lý Chương</h1>
          <p className="text-[#9ca3af] mt-1">Chọn truyện để quản lý chương</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {stories.map(story => (
            <button
              key={story.id}
              onClick={() => selectStory(story)}
              className="p-5 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 text-left transition-all"
            >
              <div className="text-[#f5f5f7] font-medium truncate">{story.title}</div>
              <div className="text-xs text-[#9ca3af] mt-2">{story.chapters} chương</div>
              <div className="text-xs text-[#a855f7] mt-1">Quản lý →</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => { setSelectedStory(null); setChapters([]) }}
            className="flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#a855f7] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Chọn truyện khác
          </button>
          <h1 className="text-2xl font-bold text-[#f5f5f7]">{selectedStory.title}</h1>
          <p className="text-[#9ca3af] mt-1">{chapters.length} chương</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Thêm chương
        </button>
      </div>

      {/* Chapter Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1428] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2d1f4a]">
            <div className="p-4 border-b border-[#2d1f4a] flex items-center justify-between">
              <h3 className="font-semibold text-[#f5f5f7]">
                {editChapter ? 'Sửa chương' : 'Thêm chương mới'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-[#9ca3af] hover:text-[#f5f5f7]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Số chương</label>
                  <input 
                    type="number" min="1"
                    value={form.chapter_number}
                    onChange={e => setForm({...form, chapter_number: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Tiêu đề</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Nội dung</label>
                <textarea
                  rows={15}
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50 resize-y font-mono text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-[#9ca3af] hover:bg-[#2d1f4a] transition-colors">Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity">
                  {editChapter ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="bg-[#1a1428] rounded-2xl border border-[#2d1f4a]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d1f4a]/50">
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase w-16">Số</th>
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase">Tiêu đề</th>
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase hidden md:table-cell">Nội dung</th>
                <th className="text-center p-3 text-xs font-medium text-[#9ca3af] uppercase w-20">Trạng thái</th>
                <th className="text-right p-3 text-xs font-medium text-[#9ca3af] uppercase w-24">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {[...chapters].sort((a, b) => b.chapter_number - a.chapter_number).map(ch => (
                <tr key={ch.id} className="border-b border-[#2d1f4a]/30 hover:bg-[#2d1f4a]/30 transition-colors">
                  <td className="p-3 text-sm text-[#f5f5f7] font-medium">{ch.chapter_number}</td>
                  <td className="p-3 text-sm text-[#f5f5f7]">{ch.title}</td>
                  <td className="p-3 text-sm text-[#6b7280] hidden md:table-cell truncate max-w-[300px]">
                    {ch.content?.substring(0, 80)}...
                  </td>
                  <td className="p-3 text-center">
                    {ch.is_new ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">Mới</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2d1f4a] text-[#6b7280]">Cũ</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(ch)} className="p-2 rounded-lg hover:bg-[#0d0a1a] text-[#9ca3af] hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ch.id)} className="p-2 rounded-lg hover:bg-[#0d0a1a] text-[#9ca3af] hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b7280]">
                    Chưa có chương nào. Nhấn "Thêm chương" để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {chapters.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Trang trước
          </button>
          <span className="text-sm text-[#6b7280]">Trang 1 / 1</span>
          <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1a1428] text-[#9ca3af] hover:text-[#f5f5f7] transition-colors text-sm">
            Trang sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminChuongPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0a1a] flex items-center justify-center">
        <div className="text-[#9ca3af]">Đang tải...</div>
      </div>
    }>
      <AdminChuongContent />
    </Suspense>
  )
}