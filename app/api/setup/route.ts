import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        cover VARCHAR(500),
        genre VARCHAR(100),
        author VARCHAR(255),
        rating DECIMAL(3,1) DEFAULT 0,
        views VARCHAR(50) DEFAULT '0',
        chapters INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Đang ra',
        is_hot BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS story_tags (
        id SERIAL PRIMARY KEY,
        story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
        tag VARCHAR(100)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(100),
        count VARCHAR(50) DEFAULT '0'
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
        chapter_number INTEGER NOT NULL,
        title VARCHAR(255),
        content TEXT,
        rating DECIMAL(3,1) DEFAULT 0,
        time_ago VARCHAR(100),
        is_new BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
        user_name VARCHAR(255),
        avatar VARCHAR(500),
        rating INTEGER DEFAULT 5,
        content TEXT,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        time_ago VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, story_id)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS reading_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
        chapter_read INTEGER DEFAULT 1,
        progress INTEGER DEFAULT 0,
        last_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert sample stories
    await query(`
      INSERT INTO stories (uuid, title, cover, genre, author, rating, views, chapters, status, is_hot, is_new, description)
      VALUES 
        ('anh-trang-khong-thuoc-ve-ai', 'Ánh Trăng Không Thuộc Về Ai', '/story-img.webp', 'Ngôn tình', 'Cổ Linh', 4.9, '2.5K', 30, 'Đang ra', true, false, 'Một câu chuyện tình yêu bi thương giữa ánh trăng và bóng đêm, nơi hai trái tim tìm về nhau trong vô vọng.'),
        ('vuong-gia-tro-lai', 'Vương Gia Trở Lại', '/story-img.webp', 'Tiên hiệp', 'Mặc Hương Đồng Khứu', 4.8, '3.1K', 25, 'Đang ra', true, false, 'Vương gia quyền nghiêng thiên hạ trở về từ cõi chết, mang theo bí mật kinh thiên.'),
        ('toi-chi-la-mot-phao-hoi', 'Tôi Chỉ Là Một Pháo Hồi', '/story-img.webp', 'Xuyên không', 'Tiểu Thư Bạch', 4.7, '2.2K', 20, 'Đang ra', false, true, 'Xuyên thành pháo hồi trong tiểu thuyết, tôi quyết định viết lại vận mệnh của mình.'),
        ('so-tay-sinh-ton-cua-nu-phu', 'Sổ Tay Sinh Tồn Của Nữ Phụ', '/story-img.webp', 'Ngôn tình', 'Nghịch Thiên', 4.8, '3.7K', 28, 'Đang ra', true, false, 'Trở thành nữ phụ độc ác trong tiểu thuyết, tôi chỉ muốn sống sót thôi mà!'),
        ('bay-kiep-may-man', 'Bảy Kiếp May Mắn', '/story-img.webp', 'Đam mỹ', 'Phong Linh', 4.9, '2.8K', 22, 'Hoàn thành', true, false, 'Bảy kiếp luân hồi, hai linh hồn mãi mãi tìm về nhau.')
      ON CONFLICT (uuid) DO NOTHING
    `)

    // Insert genres
    await query(`
      INSERT INTO genres (name, icon, count)
      VALUES 
        ('Ngôn tình', 'Heart', '2.5k'),
        ('Tiên hiệp', 'Sparkles', '1.8k'),
        ('Xuyên không', 'Clock', '1.2k'),
        ('Đam mỹ', 'Heart', '1.1k'),
        ('Huyền huyễn', 'Wand2', '987'),
        ('Trinh thám', 'Search', '654'),
        ('Kinh dị', 'Ghost', '432'),
        ('Khác', 'Star', '1.5k')
      ON CONFLICT DO NOTHING
    `)

    // Insert chapters for each story
    await query(`
      INSERT INTO chapters (story_id, chapter_number, title, content, is_new)
      SELECT 
        s.id,
        c.num,
        'Chương ' || c.num,
        'Nội dung chương ' || c.num || ' của ' || s.title || '. Ánh trăng le lói qua khe cửa sổ, chiếu những vệt sáng mờ ảo xuống sàn nhà gỗ. ' || s.title || ' - Phần ' || c.num || '. Một câu chuyện đầy cảm xúc về tình yêu và sự hy sinh. Hãy đón đọc chương tiếp theo để hiểu thêm về số phận của các nhân vật.',
        c.num = s.chapters
      FROM stories s
      CROSS JOIN LATERAL (
        SELECT generate_series(1, s.chapters) AS num
      ) c
      WHERE NOT EXISTS (
        SELECT 1 FROM chapters ch WHERE ch.story_id = s.id AND ch.chapter_number = c.num
      )
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully!' 
    })
  } catch (error) {
    console.error('Setup error:', error)
    const err = error as Error
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 })
  }
}