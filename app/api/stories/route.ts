import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const isHot = searchParams.get('isHot')
    const limit = searchParams.get('limit') || '20'
    const offset = searchParams.get('offset') || '0'

    let sql = 'SELECT * FROM stories WHERE 1=1'
    const params: unknown[] = []

    if (genre) {
      sql += ' AND genre = $' + (params.length + 1)
      params.push(genre)
    }

    if (isHot === 'true') {
      sql += ' AND is_hot = true'
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)

    const result = await query(sql, params)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}