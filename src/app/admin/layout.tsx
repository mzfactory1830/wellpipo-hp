import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-medium text-gray-800">
                管理画面
              </Link>
              <nav className="flex items-center gap-6">
                <Link 
                  href="/admin/news" 
                  className="text-gray-600 hover:text-[#5fbcd4] transition-colors"
                >
                  お知らせ管理
                </Link>
                <Link 
                  href="/admin/categories" 
                  className="text-gray-600 hover:text-[#5fbcd4] transition-colors"
                >
                  カテゴリ管理
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}