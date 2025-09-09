import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/utils/supabase/admin"
import NewsForm from "../../../../../components/NewsForm"

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }

  const [newsResult, categoriesResult] = await Promise.all([
    supabase
      .from('news')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('categories')
      .select('*')
      .order('name')
  ])

  if (newsResult.error || !newsResult.data) {
    redirect('/admin/news')
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-8">お知らせ編集</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <NewsForm 
          categories={categoriesResult.data || []} 
          news={newsResult.data}
        />
      </div>
    </div>
  )
}