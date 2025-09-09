'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`「${categoryName}」を削除してもよろしいですか？\n関連するお知らせのカテゴリも解除されます。`)) {
      return
    }

    setIsDeleting(true)
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Error deleting category:', error)
      alert('カテゴリの削除に失敗しました')
    } else {
      router.refresh()
    }
    
    setIsDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:opacity-70 transition-opacity disabled:opacity-50"
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  )
}