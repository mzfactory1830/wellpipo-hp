import Link from 'next/link'

// 静的コンテンツなので長い間隔で再検証
export const revalidate = 3600 // 1時間

export default function ServicePage() {
  const services = [
    {
      slug: 'consulting',
      title: 'コンサルティング',
      description: 'ビジネス戦略の立案から実行まで、包括的なコンサルティングサービスを提供します。',
      icon: 'lightbulb',
      color: 'blue',
    },
    {
      slug: 'development',
      title: 'システム開発',
      description: '最新技術を活用した、高品質なシステム開発サービスを提供します。',
      icon: 'code',
      color: 'green',
    },
    {
      slug: 'support',
      title: 'サポート',
      description: '24時間365日の充実したサポート体制で、お客様のビジネスを支えます。',
      icon: 'support',
      color: 'purple',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'lightbulb':
        return (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        )
      case 'code':
        return (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        )
      case 'support':
        return (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">サービス</h1>
        <p className="text-xl text-gray-600">
          お客様のニーズに合わせた最適なソリューションを提供します
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.slug}
            className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="p-8">
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${colorClasses[service.color as keyof typeof colorClasses]}`}
              >
                {getIcon(service.icon)}
              </div>
              <h2 className="mb-4 text-2xl font-semibold">{service.title}</h2>
              <p className="mb-6 text-gray-600">{service.description}</p>
              <Link
                href={`/service/${service.slug}`}
                className="inline-flex items-center font-medium text-blue-600 hover:underline"
              >
                詳しく見る
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
