'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
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
        remarkPlugins={[remarkGfm, remarkBreaks]}
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
            // BlockNote形式の言語判定（class="language-javascript"形式）
            const match = /language-(\w+)/.exec(className || '')
            let language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')
            
            // 言語のエイリアス処理とBlockNote特有の言語名対応
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
              'plain': 'plaintext',
              'text': 'plaintext',
              'md': 'markdown',
              'json': 'json',
              'xml': 'xml',
              'sql': 'sql',
              'php': 'php',
              'go': 'go',
              'rust': 'rust',
              'swift': 'swift',
              'kotlin': 'kotlin',
              'java': 'java',
              'c': 'c',
              'cpp': 'cpp',
              'cs': 'csharp',
              'vue': 'vue',
              'scss': 'scss',
              'sass': 'sass',
              'less': 'less',
              'stylus': 'stylus',
            }
            
            if (language && languageMap[language]) {
              language = languageMap[language]
            }
            
            // BlockNoteで生成されるコードブロックの判定
            // 1. classNameで言語が指定されている
            // 2. または、pre要素の子要素のcode
            const isCodeBlock = !!(
              language || 
              (node && typeof node === 'object' && 'parentElement' in node && 
                (node as unknown as Element).parentElement?.tagName === 'PRE')
            )
            
            // コードブロックの場合
            if (isCodeBlock) {
              // BlockNoteで生成される言語名を正規化
              const normalizedLanguage = language || 'plaintext'
              const displayLanguage = normalizedLanguage === 'plaintext' ? 'Text' : 
                normalizedLanguage.charAt(0).toUpperCase() + normalizedLanguage.slice(1)
              
              const isCopied = copiedCode === codeString
              
              return (
                <div className="relative w-full my-8">
                  <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg border border-gray-800">
                    {/* ヘッダー部分 - BlockNote風 */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono ml-2">{displayLanguage}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(codeString)}
                        className="flex items-center gap-2 px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
                        title="コードをコピー"
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
                        language={normalizedLanguage}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: '#1e1e1e',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', 'Consolas', monospace",
                        }}
                        showLineNumbers={codeString.split('\n').length > 5}
                        lineNumberStyle={{
                          color: '#555',
                          paddingRight: '1rem',
                          fontSize: '0.75rem',
                        }}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )
            }
            
            // インラインコード - BlockNote風
            return (
              <code 
                {...props} 
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm border border-gray-200"
                style={{ fontSize: '0.875em' }}
              >
                {children}
              </code>
            )
          },
          // 見出しのスタイリング
          h1: ({...props}) => (
            <h1 
              {...props} 
              className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200"
            />
          ),
          h2: ({...props}) => (
            <h2 
              {...props} 
              className="text-2xl font-semibold text-gray-800 mt-8 mb-4"
            />
          ),
          h3: ({...props}) => (
            <h3 
              {...props} 
              className="text-xl font-semibold text-gray-800 mt-6 mb-3"
            />
          ),
          h4: ({...props}) => (
            <h4 
              {...props} 
              className="text-lg font-medium text-gray-800 mt-4 mb-2"
            />
          ),
          h5: ({...props}) => (
            <h5 
              {...props} 
              className="text-base font-medium text-gray-800 mt-3 mb-2"
            />
          ),
          h6: ({...props}) => (
            <h6 
              {...props} 
              className="text-sm font-medium text-gray-700 mt-3 mb-2 uppercase tracking-wide"
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
          ul: ({children, ...props}) => (
            <ul 
              {...props} 
              className="list-disc pl-6 mb-4 space-y-2 text-gray-700"
            >
              {children}
            </ul>
          ),
          ol: ({children, ...props}) => (
            <ol 
              {...props} 
              className="list-decimal pl-6 mb-4 space-y-2 text-gray-700"
            >
              {children}
            </ol>
          ),
          li: ({children, ...props}) => {
            // チェックボックスリストの処理
            const hasCheckbox = children && Array.isArray(children) && 
              children.some(child => child?.props?.type === 'checkbox')
            
            if (hasCheckbox) {
              return (
                <li {...props} className="flex items-start space-x-2 text-gray-700 list-none -ml-6">
                  {children}
                </li>
              )
            }
            
            return (
              <li {...props} className="text-gray-700">
                {children}
              </li>
            )
          },
          input: ({type, checked, ...props}) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mt-1 rounded border-gray-300 text-[#5fbcd4] focus:ring-[#5fbcd4] disabled:opacity-100"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          },
          // 引用のスタイリング
          blockquote: ({children, ...props}) => (
            <blockquote 
              {...props} 
              className="border-l-4 border-[#5fbcd4] pl-4 my-6 italic bg-gray-50 py-3 pr-4 rounded-r-lg"
            >
              <div className="text-gray-700">{children}</div>
            </blockquote>
          ),
          // テーブルのスタイリング
          table: ({...props}) => (
            <div className="overflow-x-auto my-6">
              <table 
                {...props} 
                className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden"
              />
            </div>
          ),
          thead: ({...props}) => (
            <thead 
              {...props} 
              className="bg-gray-50"
            />
          ),
          tbody: ({...props}) => (
            <tbody 
              {...props} 
              className="bg-white divide-y divide-gray-200"
            />
          ),
          tr: ({...props}) => (
            <tr 
              {...props} 
              className="hover:bg-gray-50 transition-colors"
            />
          ),
          th: ({...props}) => (
            <th 
              {...props} 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            />
          ),
          td: ({...props}) => (
            <td 
              {...props} 
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            />
          ),
          // 水平線のスタイリング
          hr: ({...props}) => (
            <hr 
              {...props} 
              className="my-8 border-t border-gray-200"
            />
          ),
          // 強調のスタイリング
          strong: ({...props}) => (
            <strong 
              {...props} 
              className="font-semibold text-gray-900"
            />
          ),
          em: ({...props}) => (
            <em 
              {...props} 
              className="italic text-gray-800"
            />
          ),
          // 取り消し線のスタイリング
          del: ({...props}) => (
            <del 
              {...props} 
              className="line-through text-gray-500"
            />
          ),
          // マークのスタイリング
          mark: ({...props}) => (
            <mark 
              {...props} 
              className="bg-yellow-200 px-1 rounded"
            />
          ),
          // 脚注のスタイリング
          sup: ({children, ...props}) => {
            // 脚注参照の処理
            if (children && typeof children === 'string' && children.startsWith('[')) {
              return (
                <sup {...props} className="text-[#5fbcd4] text-xs ml-1">
                  {children}
                </sup>
              )
            }
            return <sup {...props}>{children}</sup>
          },
          // 定義リストのスタイリング
          dl: ({...props}) => (
            <dl {...props} className="my-4 space-y-2" />
          ),
          dt: ({...props}) => (
            <dt {...props} className="font-semibold text-gray-800" />
          ),
          dd: ({...props}) => (
            <dd {...props} className="ml-6 text-gray-700" />
          ),
          // キーボードのスタイリング
          kbd: ({...props}) => (
            <kbd 
              {...props} 
              className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded shadow-sm"
            />
          ),
          // 略語のスタイリング
          abbr: ({...props}) => (
            <abbr 
              {...props} 
              className="underline decoration-dotted cursor-help"
            />
          ),
          // 詳細/サマリー（折りたたみ）のスタイリング
          details: ({...props}) => (
            <details 
              {...props} 
              className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            />
          ),
          summary: ({...props}) => (
            <summary 
              {...props} 
              className="font-medium text-gray-800 cursor-pointer hover:text-[#5fbcd4] transition-colors"
            />
          ),
          // 数式のスタイリング（インライン）
          span: ({children, className, ...props}) => {
            // KaTeX数式の処理
            if (className && className.includes('math')) {
              return (
                <span 
                  {...props} 
                  className={`${className} text-gray-800`}
                >
                  {children}
                </span>
              )
            }
            return <span {...props}>{children}</span>
          },
          // ビデオ埋め込みのスタイリング
          iframe: ({src, ...props}) => {
            // YouTube/Vimeoなどの埋め込み
            if (src && (src.includes('youtube') || src.includes('vimeo'))) {
              return (
                <div className="relative w-full my-6" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    {...props}
                    src={src}
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    allowFullScreen
                  />
                </div>
              )
            }
            return <iframe src={src} {...props} />
          },
          // フィギュアとキャプションのスタイリング
          figure: ({...props}) => (
            <figure 
              {...props} 
              className="my-8 text-center"
            />
          ),
          figcaption: ({...props}) => (
            <figcaption 
              {...props} 
              className="mt-2 text-sm text-gray-600 italic"
            />
          ),
          // アラート/注意ブロックのスタイリング（カスタムdiv）
          div: ({children, className, ...props}) => {
            // 情報ブロック
            if (className && className.includes('info')) {
              return (
                <div {...props} className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // 警告ブロック
            if (className && className.includes('warning')) {
              return (
                <div {...props} className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // エラーブロック
            if (className && className.includes('error')) {
              return (
                <div {...props} className="my-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // 成功ブロック
            if (className && className.includes('success')) {
              return (
                <div {...props} className="my-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // デフォルトのdiv
            return <div {...props} className={className}>{children}</div>
          },
          // セクションのスタイリング
          section: ({...props}) => (
            <section {...props} className="my-8" />
          ),
          // 記事のスタイリング
          article: ({...props}) => (
            <article {...props} className="my-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100" />
          ),
          // ナビゲーションのスタイリング
          nav: ({...props}) => (
            <nav {...props} className="my-4 p-4 bg-gray-50 rounded-lg" />
          ),
          // アサイドのスタイリング
          aside: ({...props}) => (
            <aside {...props} className="my-6 p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg text-sm text-gray-700" />
          ),
          // フッターのスタイリング
          footer: ({...props}) => (
            <footer {...props} className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600" />
          ),
          // ヘッダーのスタイリング
          header: ({...props}) => (
            <header {...props} className="mb-6 pb-4 border-b border-gray-200" />
          ),
          // 時間のスタイリング
          time: ({...props}) => (
            <time {...props} className="text-gray-600 text-sm" />
          ),
          // アドレスのスタイリング
          address: ({...props}) => (
            <address {...props} className="not-italic text-gray-700 my-4" />
          ),
          // サンプル出力のスタイリング
          samp: ({...props}) => (
            <samp {...props} className="font-mono text-sm bg-gray-100 px-2 py-1 rounded" />
          ),
          // 変数のスタイリング
          var: ({...props}) => (
            <var {...props} className="font-mono text-sm italic text-gray-800" />
          ),
          // 引用元のスタイリング
          cite: ({...props}) => (
            <cite {...props} className="italic text-gray-600" />
          ),
          // 略記のスタイリング
          s: ({...props}) => (
            <s {...props} className="line-through text-gray-500" />
          ),
          // 小さいテキストのスタイリング
          small: ({...props}) => (
            <small {...props} className="text-sm text-gray-600" />
          ),
          // 下線のスタイリング
          u: ({...props}) => (
            <u {...props} className="underline decoration-gray-400" />
          ),
          // サブスクリプトのスタイリング
          sub: ({...props}) => (
            <sub {...props} className="text-xs" />
          ),
          // 引用のスタイリング
          q: ({...props}) => (
            <q {...props} className="italic text-gray-700" />
          ),
          // 改行のスタイリング
          br: () => <br />,
          // ルビのスタイリング
          ruby: ({...props}) => (
            <ruby {...props} />
          ),
          rt: ({...props}) => (
            <rt {...props} className="text-xs" />
          ),
          rp: ({...props}) => (
            <rp {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}