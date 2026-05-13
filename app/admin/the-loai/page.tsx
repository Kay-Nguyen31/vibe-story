"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Star } from "lucide-react"

const genreIcons = ["Heart", "Sparkles", "Clock", "Wand2", "Search", "Ghost", "Star"]

export default function AdminTheLoaiPage() {
  const [genres, setGenres] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ name: "", icon: "Heart", count: "0" })

  const fetchGenres = () => {
    fetch('/api/admin/the-loai')
      .then(res => res.json())
      .then(setGenres)
      .catch(() => {})
  }

  useEffect(() => { fetchGenres() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editItem ? 'PUT' : 'POST'
    const url = editItem ? `/api/admin/the-loai/${editItem.id}` : '/api/admin/the-loai'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    
    setShowForm(false)
    setEditItem(null)
    setForm({ name: "", icon: "Heart", count: "0" })
    fetchGenres()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá thể loại này?')) return
    await fetch(`/api/admin/the-loai/${id}`, { method: 'DELETE' })
    fetchGenres()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f7]">Quản lý Thể loại</h1>
          <p className="text-[#9ca3af] mt-1">{genres.length} thể loại</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setForm({ name: "", icon: "Heart", count: "0" }); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Thêm thể loại
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1428] rounded-2xl w-full max-w-md border border-[#2d1f4a]">
            <div className="p-4 border-b border-[#2d1f4a] flex items-center justify-between">
              <h3 className="font-semibold text-[#f5f5f7]">{editItem ? 'Sửa' : 'Thêm'} thể loại</h3>
              <button onClick={() => setShowForm(false)} className="text-[#9ca3af] hover:text-[#f5f5f7]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Tên thể loại</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" required />
              </div>
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Icon</label>
                <select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50">
                  {genreIcons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#9ca3af] mb-1">Số lượng</label>
                <input value={form.count} onChange={e => setForm({...form, count: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0d0a1a] border border-[#2d1f4a] text-[#f5f5f7] outline-none focus:border-[#a855f7]/50" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-[#9ca3af] hover:bg-[#2d1f4a]">Huỷ</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-medium hover:opacity-90">{editItem ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map(genre => (
          <div key={genre.id} className="p-4 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2d1f4a] flex items-center justify-center">
                <Star className="w-5 h-5 text-[#a855f7]" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditItem(genre); setForm({ name: genre.name, icon: genre.icon, count: genre.count }); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[#0d0a1a] text-[#9ca3af] hover:text-blue-400">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(genre.id)} className="p-1.5 rounded-lg hover:bg-[#0d0a1a] text-[#9ca3af] hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="font-medium text-[#f5f5f7]">{genre.name}</h3>
            <p className="text-xs text-[#9ca3af] mt-1">{genre.count} truyện</p>
          </div>
        ))}
      </div>
    </div>
  )
}