const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export async function fetchStories() {
  try {
    const res = await fetch(`${API_BASE}/api/stories`)
    if (!res.ok) throw new Error('Failed to fetch stories')
    return await res.json()
  } catch (error) {
    console.error('Error fetching stories:', error)
    return []
  }
}

export async function fetchStory(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/stories/${id}`)
    if (!res.ok) throw new Error('Failed to fetch story')
    return await res.json()
  } catch (error) {
    console.error('Error fetching story:', error)
    return null
  }
}

export async function fetchChapters(storyId: string) {
  try {
    const res = await fetch(`${API_BASE}/api/stories/${storyId}/chapters`)
    if (!res.ok) throw new Error('Failed to fetch chapters')
    return await res.json()
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return []
  }
}

export async function fetchChapter(storyId: string, chapterNum: number) {
  try {
    const res = await fetch(`${API_BASE}/api/stories/${storyId}/chapters/${chapterNum}`)
    if (!res.ok) throw new Error('Failed to fetch chapter')
    return await res.json()
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return null
  }
}