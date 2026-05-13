"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Eye,
  ChevronRight,
  FileText
} from "lucide-react"

interface Story {
  id: number
  uuid: string
  title: string
  cover: string
  genre: string
  author: string
  rating: string
  views: string
  chapters: number
  status: string
  is_hot: boolean
  is_new: boolean
}

export default function AdminTruyenPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editStory, setEditStory] = useState<any>(null)
  const [form, setForm] = useState({
    uuid: "", title: "", cover: "/story-img.webp", genre: "Ngôn tình",
    author: "", rating: "5.0", views: "0", chapters: 1,
    status: "Đang ra", is_hot: false, is_new: false, description: ""
  })

  const fetchStories = () => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => setStories(data || []))
      .catch(() => {})
  }

  useEffect(() => { fetchStories() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editStory ? 'PUT' : 'POST'
    const url = editStory ? `/api/admin/truyen/${editStory.id}` : '/api/admin/truyen'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    
    setShowForm(false)
    setEditStory(null)
    setForm({ uuid: "", title: "", cover: "/story-img.webp", genre: "Ngôn tình", author: "", rating: "5.0", views: "0", chapters: 1, status: "Đang ra", is_hot: false, is_new: false, description: "" })
    fetchStories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá truyện này?')) return
    await fetch(`/api/admin/truyen/${id}`, { method: 'DELETE' })
    fetchStories()
  }

  const openEdit = (story: Story) => {
    setEditStory(story)
    setForm({
      uuid: story.uuid, title: story.title, cover: story.cover,
      genre: story.genre, author: story.author, rating: String(story.rating),
      views: story.views, chapters: story.chapters, status: story.status,
      is_hot: story.is_hot, is_new: story.is_new, description: ""
    })
    setShowForm(true)
  }

  const filtered = stories.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.author?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f7]">Quản lý Truyện</h1>
          <p className="text-[#9ca3af] mt-1">{stories.length} truyện</p>
        </div>
        <button
          onClick={() => { setEditStory(null); setForm({ uuid: "", title: "", cover: "/story-img.webp", genre: "Ngôn tình", author: "", rating: "5.0", views: "0", chapters: 1, status: "Đang ra", is_hot: false, is_new: false, description: "" }); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Thêm truyện
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm truyện..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1428] border border-[#2d1f4a]/50 text-[#f5f5f7] placeholder-[#6b7280] outline-none focus:border-[#a855f7]/50 transition-colors"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1428] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#2d1f4a]">
            <div className="p-4 border-b border-[#2d1f4a] flex items-center justify-between">
              <h3 className="font-semibold text-[#f5f5f7]">{editStory ? 'Sửa truyện' : 'Thêm truyện mới'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#9ca3af] hover:text-[#f5f5f7]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">ID (slug)</label>
                <input value={form.uuid} onChange={e => setForm({...form, uuid: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" required />
              </div>
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Tên truyện</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" required />
              </div>
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Ảnh bìa</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-lg bg-[#2d1f4a] overflow-hidden shrink-0">
                    {form.cover && <img src={form.cover} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const fd = new FormData()
                      fd.append('file', file)
                      const res = await fetch('/api/upload', { method: 'POST', body: fd })
                      const data = await res.json()
                      if (data.success) setForm({...form, cover: data.url})
                    }}
                    className="text-sm text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#2d1f4a] file:text-[#f5f5f7] file:text-sm file:cursor-pointer hover:file:bg-[#a855f7]/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Tác giả</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" />
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Thể loại</label>
                  <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50">
                    {['Ngôn tình','Tiên hiệp','Xuyên không','Đam mỹ','Huyền huyễn','Trinh thám','Kinh dị','Khác'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" />
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-1">Số chương</label>
                  <input type="number" value={form.chapters} onChange={e => setForm({...form, chapters: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-[#9ca3af]">
                  <input type="checkbox" checked={form.is_hot} onChange={e => setForm({...form, is_hot: e.target.checked})} className="accent-[#a855f7]" />
                  Hot
                </label>
                <label className="flex items-center gap-2 text-sm text-[#9ca3af]">
                  <input type="checkbox" checked={form.is_new} onChange={e => setForm({...form, is_new: e.target.checked})} className="accent-[#a855f7]" />
                  Mới
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-[#9ca3af] hover:bg-[#2d1f4a] transition-colors">Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity">
                  {editStory ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-[#1a1428] rounded-2xl border border-[#2d1f4a]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d1f4a]/50">
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase">Truyện</th>
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase hidden md:table-cell">Tác giả</th>
                <th className="text-left p-3 text-xs font-medium text-[#9ca3af] uppercase hidden md:table-cell">Thể loại</th>
                <th className="text-center p-3 text-xs font-medium text-[#9ca3af] uppercase">Rating</th>
                <th className="text-center p-3 text-xs font-medium text-[#9ca3af] uppercase hidden sm:table-cell">Chương</th>
                <th className="text-center p-3 text-xs font-medium text-[#9ca3af] uppercase">Trạng thái</th>
                <th className="text-right p-3 text-xs font-medium text-[#9ca3af] uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(story => (
                <tr key={story.id} className="border-b border-[#2d1f4a]/30 hover:bg-[#2d1f4a]/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg bg-[#2d1f4a] overflow-hidden shrink-0">
                        <img src={story.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-[#f5f5f7] text-sm truncate max-w-[200px]">{story.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {story.is_hot && <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500">Hot</span>}
                          {story.is_new && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">Mới</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-[#9ca3af] hidden md:table-cell">{story.author}</td>
                  <td className="p-3 text-sm text-[#9ca3af] hidden md:table-cell">{story.genre}</td>
                  <td className="p-3 text-center">
                    <span className="text-sm text-yellow-400 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />{story.rating}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-[#9ca3af] hidden sm:table-cell">{story.chapters}</td>
                  <td className="p-3 text-center text-sm">{story.status}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/chuong?story=${story.uuid}`} className="p-2 rounded-lg hover:bg-[#1a1428] text-[#9ca3af] hover:text-[#a855f7] transition-colors" title="Quản lý chương">
                        <FileText className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openEdit(story)} className="p-2 rounded-lg hover:bg-[#1a1428] text-[#9ca3af] hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(story.id)} className="p-2 rounded-lg hover:bg-[#1a1428] text-[#9ca3af] hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}