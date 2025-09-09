'use client'

import { useEffect, useMemo, useState } from 'react'
import "@blocknote/core/fonts/inter.css"
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { createClient } from '@/utils/supabase/client'

interface BlockNoteEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  editable?: boolean
}

export default function BlockNoteEditorComponent({ 
  value, 
  onChange, 
  placeholder = "記事を書き始める...", 
  editable = true 
}: BlockNoteEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
  const supabase = createClient()

  // Markdown を BlockNote のブロック形式に変換
  useEffect(() => {
    const loadInitialContent = async () => {
      if (value) {
        try {
          const blocks = await editor.tryParseMarkdownToBlocks(value)
          setInitialContent(blocks)
        } catch (error) {
          console.error('Error parsing markdown:', error)
        }
      }
    }
    if (editor) {
      loadInitialContent()
    }
  }, [])

  // 画像アップロード処理
  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true)
    
    try {
      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        alert('画像は5MB以下にしてください')
        throw new Error('File too large')
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください')
        throw new Error('Not an image file')
      }

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
        alert('画像のアップロードに失敗しました')
        throw uploadError
      }

      // 公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from('news-content')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // BlockNote エディターインスタンスを作成
  const editor = useMemo(() => {
    const noteEditor = BlockNoteEditor.create({
      uploadFile,
      initialContent: initialContent,
    })
    return noteEditor
  }, [initialContent])

  // コンテンツが変更されたときの処理
  const handleChange = async () => {
    // ブロックをMarkdownに変換
    const markdown = await editor.blocksToMarkdownLossy(editor.document)
    onChange(markdown)
  }

  // 初期コンテンツを設定
  useEffect(() => {
    if (initialContent && editor) {
      editor.replaceBlocks(editor.document, initialContent)
    }
  }, [initialContent, editor])

  return (
    <div className="blocknote-wrapper">
      <BlockNoteView 
        editor={editor} 
        editable={editable}
        onChange={handleChange}
        theme="light"
        data-theming-css-variables-theme="light"
      />
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          画像をアップロード中...
        </div>
      )}
      <style jsx global>{`
        .blocknote-wrapper {
          min-height: 500px;
        }
        
        .blocknote-wrapper .bn-container {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
        }
        
        .blocknote-wrapper .bn-editor {
          min-height: 400px;
          padding: 1rem;
        }

        /* スラッシュメニューのスタイル */
        .blocknote-wrapper .bn-slash-menu {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* ツールバーのスタイル */
        .blocknote-wrapper .bn-toolbar {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* コードブロックのスタイル */
        .blocknote-wrapper .bn-code-block {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: 'Courier New', monospace;
        }

        /* プレースホルダーのスタイル */
        .blocknote-wrapper [data-is-empty="true"]:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }

        /* リンクのスタイル */
        .blocknote-wrapper a {
          color: #5fbcd4;
          text-decoration: underline;
        }

        /* 引用のスタイル */
        .blocknote-wrapper blockquote {
          border-left: 4px solid #5fbcd4;
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}