'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import MarkdownEditor from '@/components/MarkdownEditor'

interface Category {
  id: string
  name: string
  slug: string
}

interface NewsFormProps {
  categories: Category[]
  news?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null  // excerptに変更
    category_id: string | null
    thumbnail_url: string | null
    published: boolean  // publishedに変更
    published_at: string | null
  }
}

export default function NewsForm({ categories, news }: NewsFormProps) {
  const [title, setTitle] = useState(news?.title || '')
  const [slug, setSlug] = useState(news?.slug || '')
  const [content, setContent] = useState(news?.content || '')
  const [summary, setSummary] = useState(news?.excerpt || '')  // excerptに変更
  const [categoryId, setCategoryId] = useState(news?.category_id || '')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(news?.thumbnail_url || '')
  const [isPublished, setIsPublished] = useState(news?.published || false)  // publishedに変更
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    if (!news) {
      setSlug(generateSlug(value))
    }
  }

  const handleThumbnailUpload = async (file: File): Promise<string | null> => {
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('news-thumbnails')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('news-thumbnails')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('タイトル、スラッグ、本文は必須です')
      setIsSubmitting(false)
      return
    }

    try {
      let finalThumbnailUrl = thumbnailUrl

      // サムネイル画像のアップロード
      if (thumbnailFile) {
        const uploadedUrl = await handleThumbnailUpload(thumbnailFile)
        if (uploadedUrl) {
          finalThumbnailUrl = uploadedUrl
        }
      }

      const newsData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt: summary.trim() || null,  // excerptに変更
        category_id: categoryId || null,
        thumbnail_url: finalThumbnailUrl || null,
        published: isPublished,  // publishedに変更
        published_at: isPublished ? (news?.published_at || new Date().toISOString()) : null,
        updated_at: new Date().toISOString()
      }

      if (news) {
        // 更新
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', news.id)

        if (error) {
          setError('お知らせの更新に失敗しました')
          console.error('Error updating news:', error)
        } else {
          router.push('/admin/news')
          router.refresh()
        }
      } else {
        // 新規作成
        const { error } = await supabase
          .from('news')
          .insert([newsData])  // 配列で渡す

        if (error) {
          console.error('Error creating news:', error)
          if (error.code === '23505') {
            setError('このスラッグは既に使用されています')
          } else {
            setError(`お知らせの作成に失敗しました: ${error.message || 'Unknown error'}`)
          }
        } else {
          router.push('/admin/news')
          router.refresh()
        }
      }
    } catch (err) {
      setError('エラーが発生しました')
      console.error('Error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-2">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent text-gray-900"
          placeholder="お知らせのタイトル"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-800 mb-2">
          スラッグ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent text-gray-900"
          placeholder="news-title"
          pattern="[a-z0-9-]+"
          title="小文字の英数字とハイフンのみ使用可能です"
          required
        />
        <p className="mt-1 text-sm text-gray-600">
          URLに使用されます: /news/{slug || 'slug'}
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-2">
          カテゴリ
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent text-gray-900"
        >
          <option value="">カテゴリを選択</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-800 mb-2">
          概要
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent text-gray-900"
          placeholder="一覧ページに表示される概要文（省略可）"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-800 mb-2">
          本文 <span className="text-red-500">*</span>
        </label>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="マークダウンで記事を書いてください..."
        />
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-800 mb-2">
          サムネイル画像
        </label>
        {thumbnailUrl && (
          <div className="mb-2">
            <img
              src={thumbnailUrl}
              alt="現在のサムネイル"
              className="w-48 h-36 object-cover rounded border"
            />
          </div>
        )}
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent text-gray-700"
        />
        <p className="mt-1 text-sm text-gray-600">
          推奨サイズ: 1200x630px
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 text-[#5fbcd4] border-gray-300 rounded focus:ring-[#5fbcd4]"
        />
        <label htmlFor="published" className="ml-2 text-sm text-gray-800">
          公開する
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#5fbcd4] text-white font-medium rounded-md hover:bg-[#4a9bb5] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : news ? '更新する' : '作成する'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}