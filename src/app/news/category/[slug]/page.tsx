import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}


export async function generateStaticParams() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
  
  return categories?.map((category) => ({
    slug: category.slug,
  })) || []
}

export default async function NewsCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
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
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', category.id)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(20)
  
  if (postsError) {
    console.error('Error fetching posts:', postsError)
    return notFound()
  }
  
  // 全カテゴリを取得（サイドバー用）
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
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
        count: count || 0
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e6f4f8] via-white to-[#fef5e7] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
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
                <li className="text-gray-800 font-medium">
                  {category.name}
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-medium text-gray-800 mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Posts */}
            <div className="lg:col-span-2">
              {posts && posts.length > 0 ? (
                <div className="space-y-8">
                  {posts.map((post) => (
                    <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/news/${post.slug}`}>
                        <div className="flex flex-col md:flex-row">
                          {post.thumbnail_url && (
                            <div className="relative w-full md:w-48 h-48 md:h-36 flex-shrink-0">
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
                          <div className="p-6 flex-grow">
                            <time 
                              dateTime={post.published_at || post.created_at} 
                              className="text-xs text-gray-500"
                            >
                              {new Date(post.published_at || post.created_at).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              }).replace(/\//g, '.')}
                            </time>
                            <h2 className="text-xl font-medium mt-2 mb-3 text-gray-800 hover:text-[#5fbcd4] transition-colors">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="text-gray-600 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="text-gray-500">このカテゴリの記事はまだありません</p>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-medium mb-4 text-gray-800">カテゴリ</h3>
                <ul className="space-y-3">
                  {categoriesWithCount.map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        href={`/news/category/${cat.slug}`}
                        className={`flex justify-between items-center transition-colors ${
                          cat.id === category.id 
                            ? 'text-[#5fbcd4] font-medium' 
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