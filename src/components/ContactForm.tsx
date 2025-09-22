'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    agree: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // フォーム送信処理をここに実装
    console.log('Form submitted:', formData)
    alert('お問い合わせを受け付けました。2営業日以内にご返信させていただきます。')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-3 block flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              お名前 <span className="text-base text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-6 py-4 text-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="田中 太郎"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-3 block flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-400">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              会社名
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-6 py-4 text-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="株式会社サンプル"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-3 block flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-400">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              メールアドレス <span className="text-base text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-6 py-4 text-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-3 block flex items-center gap-2 text-lg font-semibold text-gray-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-400">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/50 px-6 py-4 text-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="090-1234-5678"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-3 block flex items-center gap-2 text-lg font-semibold text-gray-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-400">
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            お問い合わせ内容 <span className="text-base text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white/50 px-6 py-4 text-lg backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="お問い合わせ内容をご記入ください..."
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-6">
            <a
              href="/privacy"
              className="text-lg font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              📋 プライバシーポリシーを確認する
            </a>
          </div>

          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              required
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-lg leading-relaxed text-gray-700">
              プライバシーポリシーに同意する
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="transform rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-12 py-5 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl"
          >
            <span className="flex items-center gap-3">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              送信する
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
