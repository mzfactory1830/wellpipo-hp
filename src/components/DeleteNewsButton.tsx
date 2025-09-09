'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

interface DeleteNewsButtonProps {
  newsId: string
  newsTitle: string
}

export default function DeleteNewsButton({ newsId, newsTitle }: DeleteNewsButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`「${newsTitle}」を削除してもよろしいですか？`)) {
      return
    }

    setIsDeleting(true)
    
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', newsId)

    if (error) {
      console.error('Error deleting news:', error)
      alert('お知らせの削除に失敗しました')
    } else {
      router.refresh()
    }
    
    setIsDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  )
}