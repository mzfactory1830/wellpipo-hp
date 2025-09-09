import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/utils/supabase/admin"
import CategoryForm from "../../../../components/CategoryForm"

export default async function NewCategoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-8">新規カテゴリ作成</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  )
}