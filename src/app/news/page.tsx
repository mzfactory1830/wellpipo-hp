import Link from "next/link"
import { getAllNews, getCategories } from "@/lib/supabase"

export default async function NewsPage({
  searchParams
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const { news, total } = await getAllNews(page, 12)
  const categories = await getCategories()
  const totalPages = Math.ceil(total / 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#e6f4f8] via-white to-[#fef5e7] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">News</p>
            <h1 className="text-4xl md:text-5xl font-medium text-gray-800 mb-4">お知らせ</h1>
            <p className="text-gray-700">最新の情報をお届けします</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            <Link
              href="/news"
              className={`px-4 py-2 text-sm border transition-colors ${
                !searchParams.category 
                  ? 'bg-[#5fbcd4] text-white border-[#5fbcd4]' 
                  : 'border-gray-300 text-gray-700 hover:border-[#5fbcd4] hover:text-[#5fbcd4]'
              }`}
            >
              すべて
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/news?category=${category.slug}`}
                className={`px-4 py-2 text-sm border transition-colors ${
                  searchParams.category === category.slug
                    ? 'bg-[#5fbcd4] text-white border-[#5fbcd4]' 
                    : 'border-gray-300 text-gray-700 hover:border-[#5fbcd4] hover:text-[#5fbcd4]'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.length > 0 ? (
              news.map((item) => (
                <article key={item.id} className="group bg-white">
                  <Link href={`/news/${item.slug}`}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {item.thumbnail_url ? (
                        <img 
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
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
                      <h3 className="font-medium text-lg line-clamp-2 group-hover:text-[#5fbcd4] transition-colors text-gray-800">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">お知らせはまだありません</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/news?page=${page - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  前へ
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/news?page=${pageNum}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className={`px-4 py-2 border transition-colors ${
                    pageNum === page
                      ? 'bg-[#5fbcd4] text-white border-[#5fbcd4]'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
              
              {page < totalPages && (
                <Link
                  href={`/news?page=${page + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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