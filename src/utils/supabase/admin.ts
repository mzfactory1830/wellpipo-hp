import { createClient } from '@/utils/supabase/server'

export async function isAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('admin_users')
    .select('is_admin')
    .eq('user_id', userId)
    .single()

  return !error && data?.is_admin === true
}

export async function checkAdminAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  return await isAdmin(user.id)
}
