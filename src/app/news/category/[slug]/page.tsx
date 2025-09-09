import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostsByCategory, getCategory, getCategories } from "@/lib/wordpress"

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch {
    return []
  }
}

export default async function NewsCategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  let posts: any[] = []
  let category
  let categories: any[] = []
  
  try {
    category = await getCategory(params.slug)
    posts = await getPostsByCategory(params.slug, { per_page: 10 })
    categories = await getCategories()
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/news"
          className="text-blue-600 hover:underline text-sm"
        >
          ← お知らせ一覧
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/news/${post.slug}`}>
                    <div className="flex items-start justify-between mb-4">
                      <time className="text-sm text-gray-600" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                    <h2 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">
                      {post.title.rendered.replace(/&#(\d+);/g, (match: string, dec: string) => String.fromCharCode(parseInt(dec)))}
                    </h2>
                    <div 
                      className="text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: post.excerpt.rendered.replace(/<[^>]*>/g, '') 
                      }}
                    />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              このカテゴリの記事はまだありません
            </div>
          )}
        </div>
        
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">カテゴリ</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/news/category/${cat.slug}`}
                    className={`flex justify-between items-center transition-colors ${
                      cat.id === category.id 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600'
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
  )
}