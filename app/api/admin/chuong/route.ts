import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { story_id, chapter_number, title, content, is_new } = body

    const result = await query(
      `INSERT INTO chapters (story_id, chapter_number, title, content, is_new)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [story_id, chapter_number, title, content, is_new || true]
    )

    // Update story chapter count
    await query(
      `UPDATE stories SET chapters = (SELECT COUNT(*) FROM chapters WHERE story_id = $1) WHERE id = $1`,
      [story_id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Create chapter error:', error)
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 })
  }
}