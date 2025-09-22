import Link from 'next/link'
import Image from 'next/image'
import { getAllNews, getCategories } from '@/lib/supabase'

// ISR設定: 60秒ごとに再検証（一覧ページなので少し長めに）
export const revalidate = 60

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; category?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const { page: pageParam, category } = params
  const page = parseInt(pageParam || '1')
  const { news, total } = await getAllNews(page, 12)
  const categories = await getCategories()
  const totalPages = Math.ceil(total / 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden py-32">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/bg_pattern_01.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 400px',
            backgroundBlendMode: 'multiply',
            opacity: 0.15,
          }}
        ></div>
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/20 to-blue-300/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-gradient-to-br from-orange-200/20 to-orange-300/10 blur-xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full border border-blue-200/50 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 backdrop-blur-sm">
              📰 News & Updates
            </div>
            <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-6xl">
              お知らせ
            </h1>
            <p className="text-xl leading-relaxed text-gray-600">
              最新の情報やニュースをお届けします
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="mb-16 flex flex-wrap justify-center gap-3">
            <Link
              href="/news"
              className={`transform rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 ${
                !category
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'border-2 border-gray-200 bg-white text-gray-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
              }`}
            >
              すべて
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/news?category=${cat.slug}`}
                className={`transform rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 ${
                  category === cat.slug
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'border-2 border-gray-200 bg-white text-gray-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* News Grid */}
          <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.length > 0 ? (
              news.map((item, index) => (
                <article key={item.id} className="group">
                  <Link href={`/news/${item.slug}`}>
                    <div
                      className={`transform overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50 hover:shadow-xl ${index % 3 === 1 ? 'md:translate-y-4' : ''}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                        {item.thumbnail_url ? (
                          <Image
                            src={item.thumbnail_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-200/50 to-indigo-200/50">
                              <svg
                                className="h-10 w-10 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="rounded-full border border-white/50 bg-white/90 px-3 py-1 font-medium text-gray-700 backdrop-blur-sm">
                              <time dateTime={item.published_at || item.created_at}>
                                {new Date(item.published_at || item.created_at).toLocaleDateString(
                                  'ja-JP',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </time>
                            </div>
                            {item.category && (
                              <div className="rounded-full border border-orange-200/50 bg-orange-100/90 px-3 py-1 font-medium text-orange-700 backdrop-blur-sm">
                                {item.category.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="flex items-center font-medium text-blue-600">
                          <span className="text-sm">続きを読む</span>
                          <svg
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-600">お知らせはまだありません</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/news?page=${page - 1}${category ? `&category=${category}` : ''}`}
                  className="border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  前へ
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/news?page=${pageNum}${category ? `&category=${category}` : ''}`}
                  className={`border px-4 py-2 transition-colors ${
                    pageNum === page
                      ? 'border-[#5fbcd4] bg-[#5fbcd4] text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}

              {page < totalPages && (
                <Link
                  href={`/news?page=${page + 1}${category ? `&category=${category}` : ''}`}
                  className="border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  次へ
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
