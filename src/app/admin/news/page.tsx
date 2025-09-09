import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/utils/supabase/admin"
import DeleteNewsButton from "../../../components/DeleteNewsButton"

export default async function AdminNewsPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }
  
  // 全てのお知らせを取得（公開・非公開含む）
  const { data: news, count } = await supabase
    .from('news')
    .select(`
      *,
      category:categories(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / perPage)


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-800">お知らせ管理</h1>
        <Link
          href="/admin/news/new"
          className="px-6 py-2 bg-[#5fbcd4] text-white font-medium rounded-md hover:bg-[#4a9bb5] transition-colors"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {news && news.length > 0 ? (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /news/{item.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="px-2 py-1 text-xs bg-[#f8bf79] text-white rounded">
                          {item.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.is_published ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          公開中
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          下書き
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          表示
                        </Link>
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="text-[#5fbcd4] hover:text-[#4a9bb5]"
                        >
                          編集
                        </Link>
                        <DeleteNewsButton newsId={item.id} newsTitle={item.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    お知らせはまだありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/admin/news?page=${page - 1}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded"
              >
                前へ
              </Link>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/admin/news?page=${pageNum}`}
                className={`px-4 py-2 border transition-colors rounded ${
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
                href={`/admin/news?page=${page + 1}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded"
              >
                次へ
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}