import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from './CopyButton'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // 画像のスタイリング - spanを使用してインライン要素として扱う
          img: ({ src, alt }) => {
            if (!src || typeof src !== 'string') return null

            // Supabase StorageのURLの場合は外部画像として扱う
            const isExternal = src.startsWith('http') || src.startsWith('https')

            return (
              <span className="relative my-8 block w-full">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-lg shadow-lg"
                  style={{ objectFit: 'cover' }}
                  {...(isExternal && { unoptimized: true })}
                />
              </span>
            )
          },
          // リンクのスタイリング
          a: ({ ...props }) => (
            <a
              {...props}
              className="text-[#5fbcd4] transition-opacity hover:opacity-70"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          // コードブロックのスタイリング
          pre: ({ children }) => {
            return <div className="not-prose">{children}</div>
          },
          // インラインコードとコードブロックのスタイリング
          code: ({ children, className, node, ...props }) => {
            // BlockNote形式の言語判定（class="language-javascript"形式）
            const match = /language-(\w+)/.exec(className || '')
            let language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')

            // 言語のエイリアス処理とBlockNote特有の言語名対応
            const languageMap: { [key: string]: string } = {
              js: 'javascript',
              ts: 'typescript',
              tsx: 'typescript',
              jsx: 'javascript',
              py: 'python',
              rb: 'ruby',
              yml: 'yaml',
              sh: 'bash',
              shell: 'bash',
              plain: 'plaintext',
              text: 'plaintext',
              md: 'markdown',
              json: 'json',
              xml: 'xml',
              sql: 'sql',
              php: 'php',
              go: 'go',
              rust: 'rust',
              swift: 'swift',
              kotlin: 'kotlin',
              java: 'java',
              c: 'c',
              cpp: 'cpp',
              cs: 'csharp',
              vue: 'vue',
              scss: 'scss',
              sass: 'sass',
              less: 'less',
              stylus: 'stylus',
            }

            if (language && languageMap[language]) {
              language = languageMap[language]
            }

            // BlockNoteで生成されるコードブロックの判定
            // 1. classNameで言語が指定されている
            // 2. または、pre要素の子要素のcode
            const isCodeBlock = !!(
              language ||
              (node &&
                typeof node === 'object' &&
                'parentElement' in node &&
                (node as unknown as Element).parentElement?.tagName === 'PRE')
            )

            // コードブロックの場合
            if (isCodeBlock) {
              // BlockNoteで生成される言語名を正規化
              const normalizedLanguage = language || 'plaintext'
              const displayLanguage =
                normalizedLanguage === 'plaintext'
                  ? 'Text'
                  : normalizedLanguage.charAt(0).toUpperCase() + normalizedLanguage.slice(1)

              return (
                <div className="relative my-8 w-full">
                  <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#1e1e1e] shadow-lg">
                    {/* ヘッダー部分 - BlockNote風 */}
                    <div className="flex items-center justify-between border-b border-[#3e3e3e] bg-[#2d2d2d] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="ml-2 font-mono text-xs text-gray-400">
                          {displayLanguage}
                        </span>
                      </div>
                      <CopyButton code={codeString} />
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
                          fontFamily:
                            "'Fira Code', 'JetBrains Mono', 'Monaco', 'Consolas', monospace",
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
                className="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800"
                style={{ fontSize: '0.875em' }}
              >
                {children}
              </code>
            )
          },
          // 見出しのスタイリング
          h1: ({ ...props }) => (
            <h1
              {...props}
              className="mt-8 mb-4 border-b border-gray-200 pb-2 text-3xl font-bold text-gray-900"
            />
          ),
          h2: ({ ...props }) => (
            <h2 {...props} className="mt-8 mb-4 text-2xl font-semibold text-gray-800" />
          ),
          h3: ({ ...props }) => (
            <h3 {...props} className="mt-6 mb-3 text-xl font-semibold text-gray-800" />
          ),
          h4: ({ ...props }) => (
            <h4 {...props} className="mt-4 mb-2 text-lg font-medium text-gray-800" />
          ),
          h5: ({ ...props }) => (
            <h5 {...props} className="mt-3 mb-2 text-base font-medium text-gray-800" />
          ),
          h6: ({ ...props }) => (
            <h6
              {...props}
              className="mt-3 mb-2 text-sm font-medium tracking-wide text-gray-700 uppercase"
            />
          ),
          // 段落のスタイリング
          p: ({ children, ...props }) => {
            // 画像が含まれている場合はdivでラップ
            const hasImage =
              children &&
              Array.isArray(children) &&
              children.some((child) => child?.type?.name === 'img')

            if (hasImage) {
              return <div className="mb-4 leading-relaxed text-gray-700">{children}</div>
            }

            return (
              <p {...props} className="mb-4 leading-relaxed text-gray-700">
                {children}
              </p>
            )
          },
          // リストのスタイリング
          ul: ({ children, ...props }) => (
            <ul {...props} className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // チェックボックスリストの処理
            const hasCheckbox =
              children &&
              Array.isArray(children) &&
              children.some((child) => child?.props?.type === 'checkbox')

            if (hasCheckbox) {
              return (
                <li {...props} className="-ml-6 flex list-none items-start space-x-2 text-gray-700">
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
          input: ({ type, checked, ...props }) => {
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
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="my-6 rounded-r-lg border-l-4 border-[#5fbcd4] bg-gray-50 py-3 pr-4 pl-4 italic"
            >
              <div className="text-gray-700">{children}</div>
            </blockquote>
          ),
          // テーブルのスタイリング
          table: ({ ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table
                {...props}
                className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200"
              />
            </div>
          ),
          thead: ({ ...props }) => <thead {...props} className="bg-gray-50" />,
          tbody: ({ ...props }) => (
            <tbody {...props} className="divide-y divide-gray-200 bg-white" />
          ),
          tr: ({ ...props }) => <tr {...props} className="transition-colors hover:bg-gray-50" />,
          th: ({ ...props }) => (
            <th
              {...props}
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
            />
          ),
          td: ({ ...props }) => (
            <td {...props} className="px-6 py-4 text-sm whitespace-nowrap text-gray-700" />
          ),
          // 水平線のスタイリング
          hr: ({ ...props }) => <hr {...props} className="my-8 border-t border-gray-200" />,
          // 強調のスタイリング
          strong: ({ ...props }) => <strong {...props} className="font-semibold text-gray-900" />,
          em: ({ ...props }) => <em {...props} className="text-gray-800 italic" />,
          // 取り消し線のスタイリング
          del: ({ ...props }) => <del {...props} className="text-gray-500 line-through" />,
          // マークのスタイリング
          mark: ({ ...props }) => <mark {...props} className="rounded bg-yellow-200 px-1" />,
          // 脚注のスタイリング
          sup: ({ children, ...props }) => {
            // 脚注参照の処理
            if (children && typeof children === 'string' && children.startsWith('[')) {
              return (
                <sup {...props} className="ml-1 text-xs text-[#5fbcd4]">
                  {children}
                </sup>
              )
            }
            return <sup {...props}>{children}</sup>
          },
          // 定義リストのスタイリング
          dl: ({ ...props }) => <dl {...props} className="my-4 space-y-2" />,
          dt: ({ ...props }) => <dt {...props} className="font-semibold text-gray-800" />,
          dd: ({ ...props }) => <dd {...props} className="ml-6 text-gray-700" />,
          // キーボードのスタイリング
          kbd: ({ ...props }) => (
            <kbd
              {...props}
              className="rounded border border-gray-300 bg-gray-100 px-2 py-1 font-mono text-xs shadow-sm"
            />
          ),
          // 略語のスタイリング
          abbr: ({ ...props }) => (
            <abbr {...props} className="cursor-help underline decoration-dotted" />
          ),
          // 詳細/サマリー（折りたたみ）のスタイリング
          details: ({ ...props }) => (
            <details {...props} className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4" />
          ),
          summary: ({ ...props }) => (
            <summary
              {...props}
              className="cursor-pointer font-medium text-gray-800 transition-colors hover:text-[#5fbcd4]"
            />
          ),
          // 数式のスタイリング（インライン）
          span: ({ children, className, ...props }) => {
            // KaTeX数式の処理
            if (className && className.includes('math')) {
              return (
                <span {...props} className={`${className} text-gray-800`}>
                  {children}
                </span>
              )
            }
            return <span {...props}>{children}</span>
          },
          // ビデオ埋め込みのスタイリング
          iframe: ({ src, ...props }) => {
            // YouTube/Vimeoなどの埋め込み
            if (src && (src.includes('youtube') || src.includes('vimeo'))) {
              return (
                <div className="relative my-6 w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    {...props}
                    src={src}
                    className="absolute top-0 left-0 h-full w-full rounded-lg shadow-lg"
                    allowFullScreen
                  />
                </div>
              )
            }
            return <iframe src={src} {...props} />
          },
          // フィギュアとキャプションのスタイリング
          figure: ({ ...props }) => <figure {...props} className="my-8 text-center" />,
          figcaption: ({ ...props }) => (
            <figcaption {...props} className="mt-2 text-sm text-gray-600 italic" />
          ),
          // アラート/注意ブロックのスタイリング（カスタムdiv）
          div: ({ children, className, ...props }) => {
            // 情報ブロック
            if (className && className.includes('info')) {
              return (
                <div
                  {...props}
                  className="my-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4"
                >
                  <div className="flex items-start">
                    <svg
                      className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // 警告ブロック
            if (className && className.includes('warning')) {
              return (
                <div
                  {...props}
                  className="my-4 rounded-r-lg border-l-4 border-yellow-500 bg-yellow-50 p-4"
                >
                  <div className="flex items-start">
                    <svg
                      className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // エラーブロック
            if (className && className.includes('error')) {
              return (
                <div
                  {...props}
                  className="my-4 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4"
                >
                  <div className="flex items-start">
                    <svg
                      className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // 成功ブロック
            if (className && className.includes('success')) {
              return (
                <div
                  {...props}
                  className="my-4 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-4"
                >
                  <div className="flex items-start">
                    <svg
                      className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-gray-700">{children}</div>
                  </div>
                </div>
              )
            }
            // デフォルトのdiv
            return (
              <div {...props} className={className}>
                {children}
              </div>
            )
          },
          // セクションのスタイリング
          section: ({ ...props }) => <section {...props} className="my-8" />,
          // 記事のスタイリング
          article: ({ ...props }) => (
            <article
              {...props}
              className="my-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
            />
          ),
          // ナビゲーションのスタイリング
          nav: ({ ...props }) => <nav {...props} className="my-4 rounded-lg bg-gray-50 p-4" />,
          // アサイドのスタイリング
          aside: ({ ...props }) => (
            <aside
              {...props}
              className="my-6 rounded-r-lg border-l-4 border-gray-300 bg-gray-50 p-4 text-sm text-gray-700"
            />
          ),
          // フッターのスタイリング
          footer: ({ ...props }) => (
            <footer
              {...props}
              className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-600"
            />
          ),
          // ヘッダーのスタイリング
          header: ({ ...props }) => (
            <header {...props} className="mb-6 border-b border-gray-200 pb-4" />
          ),
          // 時間のスタイリング
          time: ({ ...props }) => <time {...props} className="text-sm text-gray-600" />,
          // アドレスのスタイリング
          address: ({ ...props }) => (
            <address {...props} className="my-4 text-gray-700 not-italic" />
          ),
          // サンプル出力のスタイリング
          samp: ({ ...props }) => (
            <samp {...props} className="rounded bg-gray-100 px-2 py-1 font-mono text-sm" />
          ),
          // 変数のスタイリング
          var: ({ ...props }) => (
            <var {...props} className="font-mono text-sm text-gray-800 italic" />
          ),
          // 引用元のスタイリング
          cite: ({ ...props }) => <cite {...props} className="text-gray-600 italic" />,
          // 略記のスタイリング
          s: ({ ...props }) => <s {...props} className="text-gray-500 line-through" />,
          // 小さいテキストのスタイリング
          small: ({ ...props }) => <small {...props} className="text-sm text-gray-600" />,
          // 下線のスタイリング
          u: ({ ...props }) => <u {...props} className="underline decoration-gray-400" />,
          // サブスクリプトのスタイリング
          sub: ({ ...props }) => <sub {...props} className="text-xs" />,
          // 引用のスタイリング
          q: ({ ...props }) => <q {...props} className="text-gray-700 italic" />,
          // 改行のスタイリング
          br: () => <br />,
          // ルビのスタイリング
          ruby: ({ ...props }) => <ruby {...props} />,
          rt: ({ ...props }) => <rt {...props} className="text-xs" />,
          rp: ({ ...props }) => <rp {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
