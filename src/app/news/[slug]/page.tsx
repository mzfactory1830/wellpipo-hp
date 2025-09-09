import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getNewsBySlug, getNews } from "@/lib/supabase"
import MarkdownRenderer from "@/components/MarkdownRenderer"

export default async function NewsDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const newsItem = await getNewsBySlug(params.slug)
  
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
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm mb-8">
              <ol className="flex items-center space-x-2 text-gray-600">
                <li>
                  <Link href="/" className="hover:text-[#5fbcd4] transition-colors">
                    ホーム
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/news" className="hover:text-[#5fbcd4] transition-colors">
                    お知らせ
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-800 font-medium truncate max-w-xs">
                  {newsItem.title}
                </li>
              </ol>
            </nav>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <time dateTime={newsItem.published_at || newsItem.created_at} className="text-gray-600">
                {new Date(newsItem.published_at || newsItem.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {newsItem.category && (
                <span className="px-3 py-1 bg-[#f8bf79] text-white text-xs uppercase tracking-wider">
                  {newsItem.category.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-medium text-gray-800">
              {newsItem.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Thumbnail */}
            {newsItem.thumbnail_url && (
              <div className="relative w-full mb-12 aspect-[16/9]">
                <Image 
                  src={newsItem.thumbnail_url}
                  alt={newsItem.title}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  unoptimized
                />
              </div>
            )}

            {/* Article Content */}
            <MarkdownRenderer content={newsItem.content} />

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/news"
                className="inline-flex items-center text-[#5fbcd4] hover:opacity-70 transition-opacity"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                お知らせ一覧へ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-medium text-gray-800 mb-8 text-center">関連記事</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedNews.filter(item => item.id !== newsItem.id).slice(0, 3).map((item) => (
                  <article key={item.id} className="group">
                    <Link href={`/news/${item.slug}`}>
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden mb-4">
                        {item.thumbnail_url ? (
                          <Image 
                            src={item.thumbnail_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                          <time dateTime={item.published_at || item.created_at}>
                            {new Date(item.published_at || item.created_at).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\//g, '.')}
                          </time>
                          {item.category && (
                            <>
                              <span>/</span>
                              <span className="uppercase tracking-wider text-[#f8bf79]">
                                {item.category.name}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-medium text-base line-clamp-2 group-hover:text-[#5fbcd4] transition-colors text-gray-800">
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