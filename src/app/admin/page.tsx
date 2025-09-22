import Link from 'next/link'
import { getAllNews, getCategories } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { checkAdminAccess } from '@/utils/supabase/admin'
export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未ログインユーザーはホームページへリダイレクト
  if (!user) {
    redirect('/')
  }

  // 管理者権限チェック - 権限がない場合もホームページへ
  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect('/')
  }

  const { news, total } = await getAllNews(1, 5)
  const categories = await getCategories()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium text-gray-800">ダッシュボード</h1>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm text-gray-600">公開中のお知らせ</h3>
          <p className="text-3xl font-medium text-[#5fbcd4]">{total}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm text-gray-600">カテゴリ数</h3>
          <p className="text-3xl font-medium text-[#f8bf79]">{categories.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-sm text-gray-600">画像ストレージ</h3>
          <p className="text-3xl font-medium text-[#ed746b]">利用中</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-800">クイックアクション</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/news/new"
            className="rounded-md bg-[#5fbcd4] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a9bb5]"
          >
            新規お知らせ作成
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            カテゴリ管理
          </Link>
        </div>
      </div>

      {/* Recent News */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">最近のお知らせ</h2>
          <Link
            href="/admin/news"
            className="text-sm text-[#5fbcd4] transition-opacity hover:opacity-70"
          >
            すべて見る →
          </Link>
        </div>
        <div className="space-y-3">
          {news.length > 0 ? (
            news.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded bg-gray-50 p-3"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                    <time dateTime={item.published_at || item.created_at}>
                      {new Date(item.published_at || item.created_at).toLocaleDateString('ja-JP')}
                    </time>
                    {item.category && (
                      <span className="rounded bg-[#f8bf79] px-2 py-1 text-white">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/news/${item.id}/edit`}
                  className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  編集
                </Link>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">お知らせはまだありません</p>
          )}
        </div>
      </div>
    </div>
  )
}
