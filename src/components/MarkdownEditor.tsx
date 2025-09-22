'use client'

import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/utils/supabase/client'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      alert('画像は5MB以下にしてください')
      return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    setIsUploading(true)

    try {
      // ユニークなファイル名を生成
      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
      const filePath = `${fileName}`

      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from('news-content')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        // より詳細なエラーメッセージ
        if (uploadError.message.includes('row level security')) {
          alert('画像のアップロードに失敗しました。認証エラーです。')
        } else if (uploadError.message.includes('already exists')) {
          alert('同じファイル名の画像が既に存在します。')
        } else {
          alert(`画像のアップロードに失敗しました: ${uploadError.message}`)
        }
        return
      }

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from('news-content').getPublicUrl(filePath)

      // カーソル位置に画像マークダウンを挿入
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const imageMarkdown = `![${file.name}](${publicUrl})`

        const newText = text.substring(0, start) + imageMarkdown + text.substring(end)
        onChange(newText)

        // カーソル位置を画像マークダウンの後に設定
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length
          textarea.focus()
        }, 0)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('画像のアップロードに失敗しました')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const insertMarkdown = (
    prefix: string,
    suffix: string = '',
    defaultText: string = 'テキスト'
  ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const selectedText = text.substring(start, end) || defaultText

      const newText =
        text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
      onChange(newText)

      // カーソル位置を調整
      setTimeout(() => {
        textarea.selectionStart = start + prefix.length
        textarea.selectionEnd = start + prefix.length + selectedText.length
        textarea.focus()
      }, 0)
    }
  }

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' '
    insertMarkdown(prefix, '', '見出し')
    setShowHeadingMenu(false)
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-300">
      {/* ツールバー */}
      <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 p-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            className="rounded px-3 py-1 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
            title="太字"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            className="rounded px-3 py-1 text-sm text-gray-700 italic transition-colors hover:bg-gray-200"
            title="斜体"
          >
            I
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="flex items-center gap-1 rounded px-3 py-1 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
              title="見出し"
            >
              H
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showHeadingMenu && (
              <div className="absolute top-full left-0 z-10 mt-1 w-40 rounded border border-gray-300 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => insertHeading(2)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-lg font-semibold">H2 大見出し</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertHeading(3)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-base font-semibold">H3 中見出し</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertHeading(4)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-sm font-semibold">H4 小見出し</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => insertMarkdown('- ')}
            className="rounded px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            title="リスト"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            className="rounded px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            title="リンク"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('> ', '', '引用文')}
            className="rounded px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            title="引用"
          >
            ❝
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown('```javascript\n', '\n```', '// コードをここに記述')}
            className="rounded px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            title="コードブロック"
          >
            {'</>'}
          </button>
          <div className="mx-1 h-6 w-px bg-gray-300" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
            title="画像を挿入"
          >
            {isUploading ? '📤' : '📷'} 画像
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              !isPreview ? 'bg-[#5fbcd4] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            編集
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              isPreview ? 'bg-[#5fbcd4] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            プレビュー
          </button>
        </div>
      </div>

      {/* エディタ/プレビュー */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="prose prose-sm prose-gray max-w-none p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*ここにプレビューが表示されます*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'マークダウンで記事を書いてください...'}
            className="min-h-[400px] w-full resize-y p-4 text-gray-900 placeholder-gray-500 focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}
