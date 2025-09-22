'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ScrollHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // URLハッシュを確認
    const hash = window.location.hash

    if (hash) {
      // ハッシュからIDを取得（#を除去）
      const targetId = hash.substring(1)

      // 少し待ってからスクロール（ページの読み込み完了を待つ）
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 100)
    }
  }, [searchParams])

  return null // このコンポーネントは何も表示しない
}
