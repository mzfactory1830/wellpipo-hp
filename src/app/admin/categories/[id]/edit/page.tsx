import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/utils/supabase/admin"
import CategoryForm from "../../CategoryForm"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !category) {
    redirect('/admin/categories')
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-8">カテゴリ編集</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <CategoryForm category={category} />
      </div>
    </div>
  )
}