"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Eye, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StoryCardProps {
  id: string
  title: string
  cover: string
  genre: string
  rating: number
  views?: string
  chapters?: number
  isHot?: boolean
  isNew?: boolean
}

export function StoryCard({ id, title, cover, genre, rating, views, chapters, isHot, isNew }: StoryCardProps) {
  return (
    <Link href={`/truyen/${id}`} className="group block story-card">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1428] shadow-lg">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 story-card-image"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isHot && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-lg">
              Hot
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-lg">
              Mới
            </Badge>
          )}
        </div>
        {/* Views badge */}
        {views && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-white/80" />
            <span className="text-[10px] text-white/90 font-medium">{views}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-[#f5f5f7] text-sm line-clamp-2 mb-1 group-hover:text-[#a855f7] transition-colors">{title}</h3>
          <p className="text-xs text-[#9ca3af] mb-1.5">{genre}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">{rating.toFixed(1)}</span>
            </div>
            {chapters && (
              <span className="text-[10px] text-[#9ca3af]">Chương {chapters} &gt;</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface StoryListItemProps {
  id: string
  rank?: number
  title: string
  cover: string
  genre?: string
  chapter?: string
  rating: number
  views?: string
  timeAgo?: string
}

export function StoryListItem({ id, rank, title, cover, genre, chapter, rating, views, timeAgo }: StoryListItemProps) {
  return (
    <Link href={`/truyen/${id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1428]/80 transition-all duration-300 group">
      {rank !== undefined && (
        <span className={`w-6 text-center font-bold text-lg ${
          rank === 1 ? "text-yellow-400" : 
          rank === 2 ? "text-gray-300" : 
          rank === 3 ? "text-amber-600" : 
          "text-[#6b7280]"
        }`}>
          {rank}
        </span>
      )}
      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#1a1428] shrink-0 shadow-md">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#f5f5f7] text-sm truncate group-hover:text-[#a855f7] transition-colors">
          {title}
        </h4>
        {genre && <p className="text-xs text-[#9ca3af] mt-0.5">{genre}</p>}
        {chapter && (
          <p className="text-xs text-[#6b7280] mt-0.5">
            {chapter} {timeAgo && <span>• {timeAgo}</span>}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">{rating.toFixed(1)}</span>
        </div>
        {views && (
          <span className="text-[10px] text-[#6b7280]">{views}</span>
        )}
      </div>
    </Link>
  )
}

interface FeaturedStoryCardProps {
  id: string
  title: string
  cover: string
  genre: string
  description: string
  rating: number
  chapters?: number
  tags?: string[]
}

export function FeaturedStoryCard({ id, title, cover, genre, description, rating, chapters, tags }: FeaturedStoryCardProps) {
  return (
    <div className="bg-[#1a1428]/80 rounded-2xl overflow-hidden border border-[#2d1f4a]/50 hover:border-[#a855f7]/50 transition-all duration-300 hover-glow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-32 h-44 sm:h-auto shrink-0">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1428]/80 hidden sm:block" />
        </div>
        <div className="flex-1 p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags?.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-[#2d1f4a] text-[#a855f7] border-0 text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-bold text-[#f5f5f7] text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-[#9ca3af] line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-semibold">{rating.toFixed(1)}</span>
              </div>
              {chapters && (
                <span className="text-xs text-[#9ca3af]">Chương {chapters}</span>
              )}
            </div>
            <Link 
              href={`/truyen/${id}`}
              className="flex items-center gap-1 text-sm text-[#a855f7] hover:text-[#ec4899] transition-colors font-medium"
            >
              Đọc ngay
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
