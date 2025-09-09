export interface WPPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: unknown[]
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: unknown[]
}

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2'

export async function getPosts(params?: {
  per_page?: number
  page?: number
  categories?: number
  orderby?: string
  order?: 'asc' | 'desc'
  _embed?: boolean
}): Promise<WPPost[]> {
  const queryParams = new URLSearchParams()
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.categories) queryParams.append('categories', params.categories.toString())
  if (params?.orderby) queryParams.append('orderby', params.orderby)
  if (params?.order) queryParams.append('order', params.order)
  if (params?._embed) queryParams.append('_embed', '')

  const response = await fetch(`${WP_API_URL}/posts?${queryParams.toString()}`, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

export async function getPost(slug: string): Promise<WPPost> {
  const response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }

  const posts = await response.json()
  
  if (!posts || posts.length === 0) {
    throw new Error('Post not found')
  }

  return posts[0]
}

export async function getCategories(): Promise<WPCategory[]> {
  const response = await fetch(`${WP_API_URL}/categories`, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export async function getCategory(slug: string): Promise<WPCategory> {
  const response = await fetch(`${WP_API_URL}/categories?slug=${slug}`, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch category')
  }

  const categories = await response.json()
  
  if (!categories || categories.length === 0) {
    throw new Error('Category not found')
  }

  return categories[0]
}

export async function getPostsByCategory(categorySlug: string, params?: {
  per_page?: number
  page?: number
}): Promise<WPPost[]> {
  const category = await getCategory(categorySlug)
  
  return getPosts({
    ...params,
    categories: category.id,
    _embed: true
  })
}