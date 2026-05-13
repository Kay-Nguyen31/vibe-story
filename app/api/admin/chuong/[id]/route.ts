import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { chapter_number, title, content, is_new } = body

    await query(
      `UPDATE chapters SET chapter_number=$1, title=$2, content=$3, is_new=$4 WHERE id=$5`,
      [chapter_number, title, content, is_new || false, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update chapter error:', error)
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get story_id before deleting
    const ch = await query('SELECT story_id FROM chapters WHERE id = $1', [id])
    const storyId = ch.rows[0]?.story_id

    await query('DELETE FROM chapters WHERE id = $1', [id])

    // Update story chapter count
    if (storyId) {
      await query(
        `UPDATE stories SET chapters = (SELECT COUNT(*) FROM chapters WHERE story_id = $1) WHERE id = $1`,
        [storyId]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chapter error:', error)
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 })
  }
}