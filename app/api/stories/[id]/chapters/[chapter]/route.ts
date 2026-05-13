import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; chapter: string }> }
) {
  try {
    const { id, chapter } = await params
    const chapterNum = parseInt(chapter)
    
    // Get story id from uuid
    const storyResult = await query(
      'SELECT id FROM stories WHERE uuid = $1',
      [id]
    )

    if (storyResult.rows.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const storyId = storyResult.rows[0].id

    // Get specific chapter
    const chapterResult = await query(
      'SELECT * FROM chapters WHERE story_id = $1 AND chapter_number = $2',
      [storyId, chapterNum]
    )

    if (chapterResult.rows.length === 0) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json(chapterResult.rows[0])
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json({ error: 'Failed to fetch chapter' }, { status: 500 })
  }
}