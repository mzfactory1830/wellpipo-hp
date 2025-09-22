import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getNewsBySlug, getNews } from '@/lib/supabase'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { createBuildTimeClient } from '@/utils/supabase/server'

// ISR設定: 10秒ごとに再検証
export const revalidate = 10

export async function generateStaticParams() {
  const supabase = createBuildTimeClient()

  const { data: news } = await supabase
    .from('news')
    .select('slug')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50) // 最新50記事をビルド時に生成

  return (
    news?.map((item) => ({
      slug: item.slug,
    })) || []
  )
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const newsItem = await getNewsBySlug(slug)

  if (!newsItem) {
    notFound()
  }

  // 関連記事を取得（同じカテゴリの最新3件）
  const relatedNews = await getNews(3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e6f4f8] via-white to-[#fef5e7] py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-600">
                <li>
                  <Link href="/" className="transition-colors hover:text-[#5fbcd4]">
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/news" className="transition-colors hover:text-[#5fbcd4]">
                    お知らせ
                  </Link>
                </li>
                <li>/</li>
                <li className="max-w-xs truncate font-medium text-gray-800">{newsItem.title}</li>
              </ol>
            </nav>

            {/* Meta */}
            <div className="mb-6 flex items-center gap-4 text-sm">
              <time
                dateTime={newsItem.published_at || newsItem.created_at}
                className="text-gray-600"
              >
                {new Date(newsItem.published_at || newsItem.created_at).toLocaleDateString(
                  'ja-JP',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </time>
              {newsItem.category && (
                <span className="bg-[#f8bf79] px-3 py-1 text-xs tracking-wider text-white uppercase">
                  {newsItem.category.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-medium text-gray-800 md:text-4xl">{newsItem.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Thumbnail */}
            {newsItem.thumbnail_url && (
              <div className="relative mb-12 aspect-[16/9] w-full">
                <Image
                  src={newsItem.thumbnail_url}
                  alt={newsItem.title}
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  unoptimized
                />
              </div>
            )}

            {/* Article Content */}
            <MarkdownRenderer content={newsItem.content} />

            {/* Back Link */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <Link
                href="/news"
                className="inline-flex items-center text-[#5fbcd4] transition-opacity hover:opacity-70"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                お知らせ一覧へ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-center text-2xl font-medium text-gray-800">関連記事</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {relatedNews
                  .filter((item) => item.id !== newsItem.id)
                  .slice(0, 3)
                  .map((item) => (
                    <article key={item.id} className="group">
                      <Link href={`/news/${item.slug}`}>
                        <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-gray-100">
                          {item.thumbnail_url ? (
                            <Image
                              src={item.thumbnail_url}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <svg
                                className="h-12 w-12 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="mb-2 flex items-center gap-3 text-xs text-gray-600">
                            <time dateTime={item.published_at || item.created_at}>
                              {new Date(item.published_at || item.created_at)
                                .toLocaleDateString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                })
                                .replace(/\//g, '.')}
                            </time>
                            {item.category && (
                              <>
                                <span>/</span>
                                <span className="tracking-wider text-[#f8bf79] uppercase">
                                  {item.category.name}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="line-clamp-2 text-base font-medium text-gray-800 transition-colors group-hover:text-[#5fbcd4]">
                            {item.title}
                          </h3>
                        </div>
                      </Link>
                    </article>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
