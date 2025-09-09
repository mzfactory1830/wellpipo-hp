'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="prose prose-lg max-w-none prose-gray">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // 画像のスタイリング - spanを使用してインライン要素として扱う
          img: ({src, alt}) => {
            if (!src || typeof src !== 'string') return null
            
            // Supabase StorageのURLの場合は外部画像として扱う
            const isExternal = src.startsWith('http') || src.startsWith('https')
            
            return (
              <span className="block relative w-full my-8">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={1200}
                  height={800}
                  className="rounded-lg shadow-lg w-full h-auto"
                  style={{ objectFit: 'cover' }}
                  {...(isExternal && { unoptimized: true })}
                />
              </span>
            )
          },
          // リンクのスタイリング
          a: ({...props}) => (
            <a 
              {...props} 
              className="text-[#5fbcd4] hover:opacity-70 transition-opacity"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          // コードブロックのスタイリング
          pre: ({children}) => {
            return <div className="not-prose">{children}</div>
          },
          // インラインコードとコードブロックのスタイリング
          code: ({children, className, node, ...props}) => {
            const match = /language-(\w+)/.exec(className || '')
            let language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')
            
            // 言語のエイリアス処理
            const languageMap: { [key: string]: string } = {
              'js': 'javascript',
              'ts': 'typescript',
              'tsx': 'typescript',
              'jsx': 'javascript',
              'py': 'python',
              'rb': 'ruby',
              'yml': 'yaml',
              'sh': 'bash',
              'shell': 'bash',
            }
            
            if (language && languageMap[language]) {
              language = languageMap[language]
            }
            
            // parent がpreタグかどうかを判定（言語指定なしのコードブロック）
            const isCodeBlock = !!(node && typeof node === 'object' && 'parentElement' in node && 
              (node as unknown as Element).parentElement?.tagName === 'PRE')
            
            // コードブロックの場合（言語指定あり、または言語指定なし）
            if (language || isCodeBlock) {
              const displayLanguage = language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Text'
              const isCopied = copiedCode === codeString
              
              return (
                <div className="relative w-screen -ml-[50vw] left-[50%] my-8">
                  <div className="bg-[#1e1e1e] rounded-lg overflow-hidden mx-4 lg:mx-auto lg:max-w-6xl">
                    {/* ヘッダー部分 */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                      <span className="text-xs text-gray-400 font-mono">{displayLanguage}</span>
                      <button
                        onClick={() => copyToClipboard(codeString)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    {/* コード部分 */}
                    <div className="overflow-x-auto">
                      <SyntaxHighlighter
                        language={language || 'plaintext'}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          background: '#1e1e1e',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                        }}
                        showLineNumbers={false}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )
            }
            
            // インラインコード
            return (
              <code 
                {...props} 
                className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800"
              >
                {children}
              </code>
            )
          },
          // 見出しのスタイリング
          h2: ({...props}) => (
            <h2 
              {...props} 
              className="text-2xl font-medium text-gray-800 mt-8 mb-4"
            />
          ),
          h3: ({...props}) => (
            <h3 
              {...props} 
              className="text-xl font-medium text-gray-800 mt-6 mb-3"
            />
          ),
          h4: ({...props}) => (
            <h4 
              {...props} 
              className="text-lg font-medium text-gray-800 mt-4 mb-2"
            />
          ),
          // 段落のスタイリング
          p: ({children, ...props}) => {
            // 画像が含まれている場合はdivでラップ
            const hasImage = children && Array.isArray(children) && 
              children.some(child => child?.type?.name === 'img')
            
            if (hasImage) {
              return <div className="text-gray-700 leading-relaxed mb-4">{children}</div>
            }
            
            return (
              <p 
                {...props} 
                className="text-gray-700 leading-relaxed mb-4"
              >
                {children}
              </p>
            )
          },
          // リストのスタイリング
          ul: ({...props}) => (
            <ul 
              {...props} 
              className="list-disc list-inside mb-4 space-y-2 text-gray-700"
            />
          ),
          ol: ({...props}) => (
            <ol 
              {...props} 
              className="list-decimal list-inside mb-4 space-y-2 text-gray-700"
            />
          ),
          li: ({...props}) => (
            <li 
              {...props} 
              className="text-gray-700"
            />
          ),
          // 引用のスタイリング
          blockquote: ({children, ...props}) => (
            <blockquote 
              {...props} 
              className="border-l-4 border-[#5fbcd4] pl-4 my-6 italic"
            >
              <div className="text-gray-700">{children}</div>
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}