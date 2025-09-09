import Link from "next/link"
import { notFound } from "next/navigation"

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

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const service = services[params.slug as keyof typeof services]
  
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/service"
          className="text-blue-600 hover:underline text-sm"
        >
          ← サービス一覧
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <div className={`inline-flex p-4 rounded-full mb-6 ${colorClasses[service.color as keyof typeof colorClasses]}`}>
            {getIcon()}
          </div>
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-gray-600">{service.description}</p>
        </header>

        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {service.details.trim()}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">提供サービス</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">選ばれる理由</h2>
          <div className="space-y-6">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
          <p className="mb-6">
            {service.title}サービスについて、詳しくはお問い合わせください
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            お問い合わせはこちら
          </button>
        </section>
      </div>
    </div>
  )
}