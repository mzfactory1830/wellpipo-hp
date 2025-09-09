import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/utils/supabase/admin"
import NewsForm from "../../../../components/NewsForm"

export default async function NewNewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-8">新規お知らせ作成</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <NewsForm categories={categories || []} />
      </div>
    </div>
  )
}