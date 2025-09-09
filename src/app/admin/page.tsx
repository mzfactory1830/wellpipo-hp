import Link from "next/link"
import { getAllNews, getCategories } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { checkAdminAccess } from "@/utils/supabase/admin"
export default async function AdminDashboard() {
   const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未ログインユーザーはホームページへリダイレクト
  if (!user) {
    redirect("/")
  }

   // 管理者権限チェック - 権限がない場合もホームページへ
  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }

  const { news, total } = await getAllNews(1, 5)
  const categories = await getCategories()

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-8">ダッシュボード</h1>
      
      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">公開中のお知らせ</h3>
          <p className="text-3xl font-medium text-[#5fbcd4]">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">カテゴリ数</h3>
          <p className="text-3xl font-medium text-[#f8bf79]">{categories.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm text-gray-600 mb-2">画像ストレージ</h3>
          <p className="text-3xl font-medium text-[#ed746b]">利用中</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">クイックアクション</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/news/new"
            className="px-6 py-3 bg-[#5fbcd4] text-white font-medium rounded-md hover:bg-[#4a9bb5] transition-colors"
          >
            新規お知らせ作成
          </Link>
          <Link
            href="/admin/categories"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            カテゴリ管理
          </Link>
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">最近のお知らせ</h2>
          <Link
            href="/admin/news"
            className="text-sm text-[#5fbcd4] hover:opacity-70 transition-opacity"
          >
            すべて見る →
          </Link>
        </div>
        <div className="space-y-3">
          {news.length > 0 ? (
            news.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <time dateTime={item.published_at || item.created_at}>
                      {new Date(item.published_at || item.created_at).toLocaleDateString('ja-JP')}
                    </time>
                    {item.category && (
                      <span className="px-2 py-1 bg-[#f8bf79] text-white rounded">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/news/${item.id}/edit`}
                  className="px-3 py-1 text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors rounded"
                >
                  編集
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">お知らせはまだありません</p>
          )}
        </div>
      </div>
    </div>
  )
}