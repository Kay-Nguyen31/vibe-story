const API_BASE = 'https://otruyenapi.com/v1/api'
const CDN_IMAGE = 'https://img.otruyenapi.com/uploads/comics'

export interface ComicItem {
  _id: string
  name: string
  slug: string
  origin_name: string[]
  status: string
  thumb_url: string
  sub_docquyen: boolean
  category: { id: string; name: string; slug: string }[]
  updatedAt: string
  chaptersLatest: {
    filename: string
    chapter_name: string
    chapter_title: string
    chapter_api_data: string
  }[]
}

export interface ComicDetail extends ComicItem {
  content: string
  author: string[]
  chapters: {
    server_name: string
    server_data: {
      filename: string
      chapter_name: string
      chapter_title: string
      chapter_api_data: string
    }[]
  }[]
}

export interface ChapterImages {
  status: string
  data: {
    domain_cdn: string
    item: {
      _id: string
      comic_name: string
      chapter_name: string
      chapter_path: string
      chapter_image: {
        image_page: number
        image_file: string
      }[]
    }
  }
}

export interface Category {
  _id: string
  name: string
  slug: string
}

function getImageUrl(thumbUrl: string) {
  if (thumbUrl.startsWith('http')) return thumbUrl
  return `${CDN_IMAGE}/${thumbUrl}`
}

function getFullImageUrl(thumbUrl: string) {
  if (thumbUrl.startsWith('http')) return thumbUrl
  return `${CDN_IMAGE}/${thumbUrl}`
}

export function getComicRating(id: string): number {
  let hash = 5381
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) + hash) + id.charCodeAt(i)
  }
  const normalized = Math.abs(hash) % 100
  return parseFloat((4.0 + normalized / 100).toFixed(1))
}

export async function fetchHome() {
  try {
    const res = await fetch(`${API_BASE}/home`, { next: { revalidate: 60 } })
    const data = await res.json()
    if (data.status === 'success') {
      return {
        items: data.data.items as ComicItem[],
        pagination: data.data.params.pagination,
      }
    }
    return { items: [], pagination: null }
  } catch (error) {
    console.error('fetchHome error:', error)
    return { items: [], pagination: null }
  }
}

export async function fetchComicBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/truyen-tranh/${slug}`, { next: { revalidate: 60 } })
    const data = await res.json()
    if (data.status === 'success') {
      return data.data.item as ComicDetail
    }
    return null
  } catch (error) {
    console.error('fetchComicBySlug error:', error)
    return null
  }
}

export async function fetchList(type: string = 'truyen-moi', page: number = 1) {
  try {
    const res = await fetch(`${API_BASE}/danh-sach/${type}?page=${page}`, { next: { revalidate: 60 } })
    const data = await res.json()
    if (data.status === 'success') {
      return {
        items: data.data.items as ComicItem[],
        pagination: data.data.params.pagination,
      }
    }
    return { items: [], pagination: null }
  } catch (error) {
    console.error('fetchList error:', error)
    return { items: [], pagination: null }
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/the-loai`, { next: { revalidate: 300 } })
    const data = await res.json()
    if (data.status === 'success') {
      return data.data.items as Category[]
    }
    return []
  } catch (error) {
    console.error('fetchCategories error:', error)
    return []
  }
}

export async function fetchComicsByCategory(slug: string, page: number = 1) {
  try {
    const res = await fetch(`${API_BASE}/the-loai/${slug}?page=${page}`, { next: { revalidate: 60 } })
    const data = await res.json()
    if (data.status === 'success') {
      return {
        items: data.data.items as ComicItem[],
        pagination: data.data.params.pagination,
      }
    }
    return { items: [], pagination: null }
  } catch (error) {
    console.error('fetchComicsByCategory error:', error)
    return { items: [], pagination: null }
  }
}

export async function fetchSearch(keyword: string) {
  try {
    const res = await fetch(`${API_BASE}/tim-kiem?keyword=${encodeURIComponent(keyword)}`, { next: { revalidate: 30 } })
    const data = await res.json()
    if (data.status === 'success') {
      return {
        items: data.data.items as ComicItem[],
        pagination: data.data.params.pagination,
      }
    }
    return { items: [], pagination: null }
  } catch (error) {
    console.error('fetchSearch error:', error)
    return { items: [], pagination: null }
  }
}

export async function fetchChapterImages(chapterApiData: string) {
  try {
    const res = await fetch(chapterApiData)
    const data = await res.json()
    if (data.status === 'success') {
      return data.data as ChapterImages['data']
    }
    return null
  } catch (error) {
    console.error('fetchChapterImages error:', error)
    return null
  }
}

export function getComicThumbUrl(thumbUrl: string) {
  return getImageUrl(thumbUrl)
}

export function getChapterImageUrl(domainCdn: string, chapterPath: string, imageFile: string) {
  return `${domainCdn}/${chapterPath}/${imageFile}`
}

export { getImageUrl }