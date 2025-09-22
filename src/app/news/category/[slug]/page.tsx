import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient, createBuildTimeClient } from '@/utils/supabase/server'

// ISR設定: 30秒ごとに再検証
export const revalidate = 30

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export async function generateStaticParams() {
  const supabase = createBuildTimeClient()

  const { data: categories } = await supabase.from('categories').select('slug')

  return (
    categories?.map((category) => ({
      slug: category.slug,
    })) || []
  )
}

export default async function NewsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // カテゴリを取得
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // カテゴリに属する記事を取得
  const { data: posts, error: postsError } = await supabase
    .from('news')
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq('category_id', category.id)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  if (postsError) {
    console.error('Error fetching posts:', postsError)
    return notFound()
  }

  // 全カテゴリを取得（サイドバー用）
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  // 各カテゴリの記事数を取得
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('published', true)

      return {
        ...cat,
        count: count || 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e6f4f8] via-white to-[#fef5e7] py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
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
                <li className="font-medium text-gray-800">{category.name}</li>
              </ol>
            </nav>

            <h1 className="mb-4 text-3xl font-medium text-gray-800 md:text-4xl">{category.name}</h1>
            {category.description && <p className="text-gray-600">{category.description}</p>}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Posts */}
            <div className="lg:col-span-2">
              {posts && posts.length > 0 ? (
                <div className="space-y-8">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Link href={`/news/${post.slug}`}>
                        <div className="flex flex-col md:flex-row">
                          {post.thumbnail_url && (
                            <div className="relative h-48 w-full flex-shrink-0 md:h-36 md:w-48">
                              <Image
                                src={post.thumbnail_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 192px"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-grow p-6">
                            <time
                              dateTime={post.published_at || post.created_at}
                              className="text-xs text-gray-500"
                            >
                              {new Date(post.published_at || post.created_at)
                                .toLocaleDateString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                })
                                .replace(/\//g, '.')}
                            </time>
                            <h2 className="mt-2 mb-3 text-xl font-medium text-gray-800 transition-colors hover:text-[#5fbcd4]">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="line-clamp-2 text-gray-600">{post.excerpt}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-gray-300"
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
                  <p className="text-gray-500">このカテゴリの記事はまだありません</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-gray-800">カテゴリ</h3>
                <ul className="space-y-3">
                  {categoriesWithCount.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/news/category/${cat.slug}`}
                        className={`flex items-center justify-between transition-colors ${
                          cat.id === category.id
                            ? 'font-medium text-[#5fbcd4]'
                            : 'text-gray-700 hover:text-[#5fbcd4]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-sm text-gray-500">({cat.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
