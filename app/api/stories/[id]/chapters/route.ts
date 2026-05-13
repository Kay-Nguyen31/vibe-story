import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get story id from uuid
    const storyResult = await query(
      'SELECT id FROM stories WHERE uuid = $1',
      [id]
    )

    if (storyResult.rows.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const storyId = storyResult.rows[0].id

    // Get chapters
    const chaptersResult = await query(
      'SELECT * FROM chapters WHERE story_id = $1 ORDER BY chapter_number ASC',
      [storyId]
    )

    return NextResponse.json(chaptersResult.rows)
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 })
  }
}