import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uuid, title, cover, genre, author, rating, views, chapters, status, is_hot, is_new, description } = body
    
    await query(
      `INSERT INTO stories (uuid, title, cover, genre, author, rating, views, chapters, status, is_hot, is_new, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [uuid, title, cover, genre, author, rating, views, chapters || 0, status, is_hot || false, is_new || false, description || '']
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create story error:', error)
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}