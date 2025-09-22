import { createClient } from '@/utils/supabase/server'
import { isAdmin } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // ユーザー情報を取得
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 管理者権限チェック
      if (user && redirectTo?.startsWith('/admin')) {
        const hasAdminAccess = await isAdmin(user.id)
        if (!hasAdminAccess) {
          // 管理者権限がない場合はホームページへ
          return NextResponse.redirect(`${origin}/`)
        }
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // デフォルトはホームページへ
  return NextResponse.redirect(`${origin}/`)
}
