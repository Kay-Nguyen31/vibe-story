import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { uuid, title, cover, genre, author, rating, views, chapters, status, is_hot, is_new, description } = body
    
    await query(
      `UPDATE stories SET uuid=$1, title=$2, cover=$3, genre=$4, author=$5, rating=$6, views=$7, chapters=$8, status=$9, is_hot=$10, is_new=$11, description=$12 WHERE id=$13`,
      [uuid, title, cover, genre, author, rating, views, chapters, status, is_hot, is_new, description, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update story error:', error)
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await query('DELETE FROM stories WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete story error:', error)
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
}