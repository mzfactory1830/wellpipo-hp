'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
  }
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (!category) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!name.trim() || !slug.trim()) {
      setError('カテゴリ名とスラッグは必須です')
      setIsSubmitting(false)
      return
    }

    if (category) {
      // 更新
      const { error } = await supabase
        .from('categories')
        .update({
          name: name.trim(),
          slug: slug.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', category.id)

      if (error) {
        setError('カテゴリの更新に失敗しました')
        console.error('Error updating category:', error)
      } else {
        router.push('/admin/categories')
        router.refresh()
      }
    } else {
      // 新規作成
      const { error } = await supabase.from('categories').insert({
        name: name.trim(),
        slug: slug.trim(),
      })

      if (error) {
        if (error.code === '23505') {
          setError('このスラッグは既に使用されています')
        } else {
          setError('カテゴリの作成に失敗しました')
        }
        console.error('Error creating category:', error)
      } else {
        router.push('/admin/categories')
        router.refresh()
      }
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
          カテゴリ名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
          placeholder="例: お知らせ"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-700">
          スラッグ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#5fbcd4] focus:outline-none"
          placeholder="例: news"
          pattern="[a-z0-9-]+"
          title="小文字の英数字とハイフンのみ使用可能です"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          URLに使用される識別子です。小文字の英数字とハイフンのみ使用できます。
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-[#5fbcd4] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a9bb5] disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : category ? '更新する' : '作成する'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
