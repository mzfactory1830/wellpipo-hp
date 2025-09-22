import Link from "next/link"
import { notFound } from "next/navigation"

// 静的コンテンツなので長い間隔で再検証
export const revalidate = 3600 // 1時間

const services = {
  consulting: {
    title: "コンサルティング",
    description: "ビジネス戦略の立案から実行まで、包括的なコンサルティングサービス",
    icon: "lightbulb",
    color: "blue",
    features: [
      "経営戦略立案",
      "業務プロセス改善",
      "組織変革支援",
      "DX推進コンサルティング",
      "マーケティング戦略"
    ],
    details: `
      私たちのコンサルティングサービスは、お客様のビジネス課題を深く理解し、
      最適な解決策を提供します。豊富な経験と専門知識を持つコンサルタントが、
      戦略立案から実行まで一貫してサポートいたします。
    `,
    benefits: [
      {
        title: "専門性の高いコンサルタント",
        description: "各分野のエキスパートが、お客様の課題に最適なソリューションを提供"
      },
      {
        title: "実績に基づくアプローチ",
        description: "数多くの成功事例から導き出された効果的な方法論を活用"
      },
      {
        title: "継続的なサポート",
        description: "戦略実行後も定期的なフォローアップで成果を確実に"
      }
    ]
  },
  development: {
    title: "システム開発",
    description: "最新技術を活用した、高品質なシステム開発サービス",
    icon: "code",
    color: "green",
    features: [
      "Webアプリケーション開発",
      "モバイルアプリ開発",
      "クラウドシステム構築",
      "AI・機械学習システム",
      "レガシーシステム刷新"
    ],
    details: `
      最新の技術スタックを活用し、お客様のビジネスニーズに最適な
      システムを開発します。アジャイル開発手法により、迅速かつ柔軟な
      開発を実現し、高品質なシステムをお届けします。
    `,
    benefits: [
      {
        title: "最新技術の活用",
        description: "React、Next.js、クラウドネイティブ技術など最新の技術スタックを採用"
      },
      {
        title: "アジャイル開発",
        description: "迅速な開発と柔軟な変更対応で、ビジネススピードに対応"
      },
      {
        title: "品質保証",
        description: "徹底したテストとレビューにより、高品質なシステムを提供"
      }
    ]
  },
  support: {
    title: "サポート",
    description: "24時間365日の充実したサポート体制",
    icon: "support",
    color: "purple",
    features: [
      "24時間365日サポート",
      "システム運用保守",
      "トラブルシューティング",
      "パフォーマンス最適化",
      "セキュリティ監視"
    ],
    details: `
      システムの安定稼働を支える包括的なサポートサービスを提供します。
      経験豊富なエンジニアが24時間365日体制で監視・対応し、
      お客様のビジネスを止めません。
    `,
    benefits: [
      {
        title: "24時間365日対応",
        description: "いつでも迅速に対応可能な体制で、ビジネスの継続性を確保"
      },
      {
        title: "予防的メンテナンス",
        description: "問題が発生する前に検知・対応し、システムの安定性を維持"
      },
      {
        title: "専門チーム",
        description: "各分野の専門家が連携し、複雑な問題も迅速に解決"
      }
    ]
  }
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({
    slug,
  }))
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]
  
  if (!service) {
    notFound()
  }

  const getIcon = () => {
    switch (service.icon) {
      case 'lightbulb':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case 'code':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )
      case 'support':
        return (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600"
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-300/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-orange-200/20 to-pink-300/10 rounded-full blur-2xl"></div>
      
      <div className="relative container mx-auto px-4 py-16 z-10">
        <div className="mb-12">
          <Link 
            href="/service"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-600 hover:text-blue-700 rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            サービス一覧
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <div className={`inline-flex p-6 rounded-3xl mb-8 shadow-lg ${colorClasses[service.color as keyof typeof colorClasses]} bg-opacity-20 backdrop-blur-sm border border-white/50`}>
              {getIcon()}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">{service.title}</h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">{service.description}</p>
            </div>
          </header>

          <section className="mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-gray-100/50">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                {service.details.trim()}
              </p>
            </div>
          </section>

          <section className="mb-16">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-2 bg-green-100/80 backdrop-blur-sm text-green-800 text-sm font-medium rounded-full mb-4 border border-green-200/50">
                ✨ Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">提供サービス</h2>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100/50">
              <div className="grid md:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50/50 to-teal-50/50 rounded-2xl border border-green-100/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-2 bg-purple-100/80 backdrop-blur-sm text-purple-800 text-sm font-medium rounded-full mb-4 border border-purple-200/50">
                🏆 Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">選ばれる理由</h2>
            </div>
            <div className="space-y-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        index === 0 ? 'from-blue-500 to-cyan-400' :
                        index === 1 ? 'from-orange-500 to-pink-400' :
                        'from-green-500 to-teal-400'
                      } rounded-2xl flex items-center justify-center text-white font-bold text-lg`}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-3xl p-10 text-center shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6">お問い合わせ</h2>
          <p className="mb-8 text-xl opacity-90">
            {service.title}サービスについて、詳しくはお問い合わせください
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg">
            お問い合わせはこちら
          </button>
        </section>
      </div>
    </div>
  )
}