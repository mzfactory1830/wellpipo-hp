import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkAdminAccess } from '@/utils/supabase/admin'
import NewsForm from '../../../../../components/NewsForm'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const [newsResult, categoriesResult] = await Promise.all([
    supabase.from('news').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (newsResult.error || !newsResult.data) {
    redirect('/admin/news')
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium text-gray-800">お知らせ編集</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <NewsForm categories={categoriesResult.data || []} news={newsResult.data} />
      </div>
    </div>
  )
}
