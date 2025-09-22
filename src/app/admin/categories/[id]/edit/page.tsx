import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkAdminAccess } from '@/utils/supabase/admin'
import CategoryForm from '../../../../../components/CategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    redirect('/')
  }

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    redirect('/admin/categories')
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium text-gray-800">カテゴリ編集</h1>
      <div className="max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
        <CategoryForm category={category} />
      </div>
    </div>
  )
}
