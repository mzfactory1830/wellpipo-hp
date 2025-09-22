'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'

function AdminLoginContent() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'unauthorized') {
      setError('このアカウントは管理者として登録されていません')
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirect_to=/admin`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch {
      setError('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
      <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-200/30 to-blue-300/20 blur-xl"></div>
      <div className="absolute bottom-32 left-32 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-orange-200/30 to-orange-300/20 blur-xl delay-700"></div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-lg">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">管理者ログイン</h1>
          <p className="leading-relaxed text-gray-600">
            管理者として登録されているGoogleアカウントで
            <br />
            ログインしてください
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-sm">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full transform items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-lg">{loading ? 'ログイン中...' : 'Googleでログイン'}</span>
          </button>

          <div className="rounded-2xl border border-gray-100/50 bg-gray-50/50 p-4 text-center text-sm text-gray-500 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-center">
              <svg
                className="mr-2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-gray-600">ご注意</span>
            </div>
            <p className="leading-relaxed">
              管理者として登録されているアカウントのみログイン可能です
            </p>
            <p className="mt-2 text-xs">
              管理者登録が必要な場合は、システム管理者にお問い合わせください
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-lg">
            <div className="text-center">
              <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-lg font-medium text-gray-600">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  )
}
