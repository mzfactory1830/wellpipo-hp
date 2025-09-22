'use client'

import { useState, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// BlockNoteEditorを動的インポート（クライアントサイドのみ）
const BlockNoteEditor = dynamic(() => import('@/components/BlockNoteEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-gray-300 p-8 text-center text-gray-500">
      エディターを読み込み中...
    </div>
  ),
})

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
    excerpt: string | null // excerptに変更
    category_id: string | null
    thumbnail_url: string | null
    published: boolean // publishedに変更
    published_at: string | null
  }
}

export default function NewsForm({ categories, news }: NewsFormProps) {
  const [title, setTitle] = useState(news?.title || '')
  const [slug, setSlug] = useState(news?.slug || '')
  const [content, setContent] = useState(news?.content || '')
  const [summary, setSummary] = useState(news?.excerpt || '') // excerptに変更
  const [categoryId, setCategoryId] = useState(news?.category_id || '')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState(news?.thumbnail_url || '')
  const [isPublished, setIsPublished] = useState(news?.published || false) // publishedに変更
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

    const {
      data: { publicUrl },
    } = supabase.storage.from('news-thumbnails').getPublicUrl(filePath)

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
        excerpt: summary.trim() || null, // excerptに変更
        category_id: categoryId || null,
        thumbnail_url: finalThumbnailUrl || null,
        published: isPublished, // publishedに変更
        published_at: isPublished ? news?.published_at || new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }

      if (news) {
        // 更新
        const { error } = await supabase.from('news').update(newsData).eq('id', news.id)

        if (error) {
          setError('お知らせの更新に失敗しました')
          console.error('Error updating news:', error)
        } else {
          router.push('/admin/news')
          router.refresh()
        }
      } else {
        // 新規作成
        const { error } = await supabase.from('news').insert([newsData]) // 配列で渡す

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
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-800">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
          placeholder="お知らせのタイトル"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-800">
          スラッグ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
          placeholder="news-title"
          pattern="[a-z0-9-]+"
          title="小文字の英数字とハイフンのみ使用可能です"
          required
        />
        <p className="mt-1 text-sm text-gray-600">URLに使用されます: /news/{slug || 'slug'}</p>
      </div>

      <div>
        <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-800">
          カテゴリ
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
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
        <label htmlFor="summary" className="mb-2 block text-sm font-medium text-gray-800">
          概要
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
          placeholder="一覧ページに表示される概要文（省略可）"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-800">
          本文 <span className="text-red-500">*</span>
        </label>
        <BlockNoteEditor value={content} onChange={setContent} placeholder="記事を書き始める..." />
      </div>

      <div>
        <label htmlFor="thumbnail" className="mb-2 block text-sm font-medium text-gray-800">
          サムネイル画像
        </label>
        {thumbnailUrl && (
          <div className="relative mb-2 h-36 w-48">
            <Image
              src={thumbnailUrl}
              alt="現在のサムネイル"
              fill
              className="rounded border object-cover"
              unoptimized
            />
          </div>
        )}
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
        />
        <p className="mt-1 text-sm text-gray-600">推奨サイズ: 1200x630px</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#5fbcd4] focus:ring-[#5fbcd4]"
        />
        <label htmlFor="published" className="ml-2 text-sm text-gray-800">
          公開する
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#5fbcd4] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a9bb5] disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : news ? '更新する' : '作成する'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
