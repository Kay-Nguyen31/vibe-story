"use client"

import { useEffect, useState } from "react"
import { Trash2, Star, ThumbsUp, MessageCircle } from "lucide-react"

export default function AdminBinhluanPage() {
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/binhluan')
      .then(res => res.json())
      .then(setReviews)
      .catch(() => {})
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá bình luận này?')) return
    await fetch(`/api/admin/binhluan/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#f5f5f7]">Quản lý Bình luận</h1>
        <p className="text-[#9ca3af] mt-1">{reviews.length} bình luận</p>
      </div>

      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="p-4 rounded-2xl bg-[#1a1428] border border-[#2d1f4a]/50 hover:border-[#a855f7]/30 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2d1f4a] overflow-hidden">
                  {review.avatar ? (
                    <img src={review.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9ca3af] font-medium">
                      {review.user_name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#f5f5f7]">{review.user_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-[#6b7280]">{review.time_ago}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-2 rounded-lg hover:bg-[#0d0a1a] text-[#9ca3af] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#d1d5db] mt-3">{review.content}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {review.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}