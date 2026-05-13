import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT r.*, s.title as story_title 
      FROM reviews r 
      LEFT JOIN stories s ON r.story_id = s.id 
      ORDER BY r.created_at DESC
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Fetch reviews error:', error)
    return NextResponse.json([])
  }
}