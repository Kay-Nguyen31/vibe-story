import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const storiesCount = await query('SELECT COUNT(*) FROM stories')
    const genresCount = await query('SELECT COUNT(*) FROM genres')
    const chaptersCount = await query('SELECT COUNT(*) FROM chapters')
    const reviewsCount = await query('SELECT COUNT(*) FROM reviews')
    const recentStories = await query('SELECT * FROM stories ORDER BY created_at DESC LIMIT 5')

    return NextResponse.json({
      stories: parseInt(storiesCount.rows[0].count),
      genres: parseInt(genresCount.rows[0].count),
      chapters: parseInt(chaptersCount.rows[0].count),
      reviews: parseInt(reviewsCount.rows[0].count),
      recentStories: recentStories.rows,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ stories: 0, genres: 0, chapters: 0, reviews: 0, recentStories: [] })
  }
}