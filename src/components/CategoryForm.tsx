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
          updated_at: new Date().toISOString()
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
      const { error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          slug: slug.trim()
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
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent"
          placeholder="例: お知らせ"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
          スラッグ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5fbcd4] focus:border-transparent"
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
          className="px-6 py-3 bg-[#5fbcd4] text-white font-medium rounded-md hover:bg-[#4a9bb5] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : category ? '更新する' : '作成する'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}