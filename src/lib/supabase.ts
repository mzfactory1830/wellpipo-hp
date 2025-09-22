// Note: This file exports types and helper functions.
// For client instances, use:
// - Browser: import { createClient } from '@/utils/supabase/client'
// - Server: import { createClient } from '@/utils/supabase/server'

import { createClient } from '@/utils/supabase/server'

// Types
export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  thumbnail_url: string | null
  category_id: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface NewsImage {
  id: string
  news_id: string
  image_url: string
  alt_text: string | null
  created_at: string
}

// API Functions
// Note: These functions should be called from Server Components

export async function getNews(limit: number = 6) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news')
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data as News[]
}

export async function getNewsBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news')
    .select(
      `
      *,
      category:categories(*),
      images:news_images(*)
    `
    )
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  return data
}

export async function getAllNews(page: number = 1, perPage: number = 12) {
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from('news')
    .select(
      `
      *,
      category:categories(*)
    `,
      { count: 'exact' }
    )
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching all news:', error)
    return { news: [], total: 0 }
  }

  return { news: data as News[], total: count || 0 }
}

export async function getNewsByCategory(
  categorySlug: string,
  page: number = 1,
  perPage: number = 12
) {
  const supabase = await createClient()
  // First get the category
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError)
    return { news: [], total: 0 }
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from('news')
    .select(
      `
      *,
      category:categories(*)
    `,
      { count: 'exact' }
    )
    .eq('published', true)
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching news by category:', error)
    return { news: [], total: 0 }
  }

  return { news: data as News[], total: count || 0 }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}
