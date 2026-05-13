"use client"

import { useState, useEffect, useCallback } from "react"

interface ReadingItem {
  slug: string
  title: string
  thumbUrl: string
  chapter: number
  totalChapters: number
  lastRead: string
  updatedAt: string
}

const STORAGE_KEY = 'vibe-reading-history'

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const saveProgress = useCallback((item: ReadingItem) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.slug !== item.slug)
      const updated = [item, ...filtered].slice(0, 30)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { history, saveProgress, clearHistory }
}