import ContactForm from '@/components/ContactForm'
import ScrollLink from '@/components/ScrollLink'
import ScrollHandler from '@/components/ScrollHandler'
import Link from 'next/link'
import Image from 'next/image'
import { getNews } from '@/lib/supabase'

// ホームページは最新ニュースを表示するので短い間隔で再検証
export const revalidate = 300 // 5分

export default async function HomePage() {
  const recentNews = await getNews(6)
  return (
    <>
      <ScrollHandler />
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-200/30 to-blue-300/20 blur-xl"></div>
        <div className="absolute right-32 bottom-32 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-orange-200/30 to-orange-300/20 blur-xl delay-700"></div>
        <div className="absolute top-1/3 right-1/4 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-indigo-200/20 to-indigo-300/10 blur-xl delay-1000"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl">
            <div className="mb-6 inline-block rounded-full border border-blue-200/50 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 backdrop-blur-sm">
              ✨ 住み慣れた地域で安心の暮らしを
            </div>
            <h1 className="mb-8 text-4xl leading-tight font-bold text-gray-900 md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                住み慣れた家で、
              </span>
              <br />
              <span className="text-gray-800">
                最期まで自分らしく
                <span className="ml-2 inline-block text-orange-500">暮らす</span>
              </span>
            </h1>
            <p className="mb-12 max-w-3xl text-xl leading-relaxed font-light text-gray-600 md:text-2xl">
              私たちウェルピポは、地域に支え合いの土壌を育て、
              <br className="hidden md:block" />
              <span className="font-medium text-gray-700">
                誰もが安心して暮らせる社会を創ります
              </span>
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <ScrollLink
                href="/#about"
                className="group flex transform items-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span>私たちについて</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </ScrollLink>
              <ScrollLink
                href="/#contact"
                className="group flex transform items-center space-x-2 rounded-2xl border-2 border-gray-200 bg-white/90 px-8 py-4 font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
              >
                <span>お問い合わせ</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:scale-110"
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
              </ScrollLink>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
          <div className="animate-bounce">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* お知らせ Section */}
      <section className="bg-gradient-to-b from-white to-blue-50/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full border border-blue-200/50 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800">
              📰 最新情報
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">お知らせ</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              最新のニュースやお知らせをお届けします
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentNews.length > 0 ? (
              recentNews.map((news, index) => (
                <article key={news.id} className="group">
                  <Link href={`/news/${news.slug}`}>
                    <div
                      className={`transform overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50 hover:shadow-xl ${index % 3 === 1 ? 'md:translate-y-8' : ''}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                        {news.thumbnail_url ? (
                          <Image
                            src={news.thumbnail_url}
                            alt={news.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-200/50 to-indigo-200/50">
                              <svg
                                className="h-10 w-10 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="rounded-full border border-white/50 bg-white/90 px-3 py-1 font-medium text-gray-700 backdrop-blur-sm">
                              <time dateTime={news.published_at || news.created_at}>
                                {new Date(news.published_at || news.created_at).toLocaleDateString(
                                  'ja-JP',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </time>
                            </div>
                            {news.category && (
                              <div className="rounded-full border border-orange-200/50 bg-orange-100/90 px-3 py-1 font-medium text-orange-700 backdrop-blur-sm">
                                {news.category.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {news.title}
                        </h3>
                        {news.excerpt && (
                          <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
                            {news.excerpt}
                          </p>
                        )}
                        <div className="flex items-center font-medium text-blue-600">
                          <span className="text-sm">続きを読む</span>
                          <svg
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-500">お知らせはまだありません</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/news"
              className="inline-flex transform items-center rounded-2xl border-2 border-blue-200 bg-white px-8 py-4 font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
            >
              <span>すべてのお知らせを見る</span>
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ウェルピポについて Section */}
      <section
        id="about"
        className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50/20 py-32"
      >
        <div className="absolute top-32 right-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/20 to-blue-300/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-16 h-32 w-32 rounded-full bg-gradient-to-br from-orange-200/20 to-orange-300/10 blur-xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-block rounded-full border border-blue-200/50 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 backdrop-blur-sm">
              💡 About Us
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              ウェルピポについて
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              私たちの想いと価値観をお伝えします
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
            {/* PURPOSE */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-700">Purpose</h3>
              </div>
              <p className="text-xl leading-relaxed font-medium text-gray-800">
                住み慣れた家で、
                <br />
                最期まで自分らしく暮らせる社会を創る。
              </p>
            </div>

            {/* VISION */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-400">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-orange-700">Vision</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-800">
                誰もが「支える人」であり「支えられる人」になる。
                世代を超えた「活躍」と「ありがとう」の輪が、 地域全体を温かく見守る社会。
              </p>
            </div>

            {/* MISSION */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-400">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-700">Mission</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-800">
                一人ひとりと深く向き合う。
                <br />
                人と人、人と機会をつなぐをデザインする。
              </p>
            </div>

            {/* VALUE */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-400">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-700">Value</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: '感謝', gradient: 'from-red-400 to-pink-400' },
                  { text: '挑戦', gradient: 'from-blue-400 to-cyan-400' },
                  { text: '発見', gradient: 'from-yellow-400 to-orange-400' },
                  { text: '成長', gradient: 'from-green-400 to-teal-400' },
                  { text: '笑顔', gradient: 'from-pink-400 to-purple-400' },
                  { text: '主役', gradient: 'from-indigo-400 to-blue-400' },
                ].map((value) => (
                  <span
                    key={value.text}
                    className={`bg-gradient-to-r px-4 py-2 ${value.gradient} transform rounded-full text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    全員『{value.text}』
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ご挨拶 Section */}
      <section
        id="greeting"
        className="relative overflow-hidden bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/50 py-32"
      >
        <div className="absolute top-20 left-20 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-300/10 blur-2xl"></div>
        <div className="absolute right-32 bottom-32 h-28 w-28 rounded-full bg-gradient-to-br from-orange-200/20 to-pink-300/10 blur-xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <div className="mb-6 inline-block rounded-full border border-cyan-200/50 bg-cyan-100/80 px-4 py-2 text-sm font-medium text-cyan-800 backdrop-blur-sm">
                🤝 Greeting
              </div>
              <h2 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl">ご挨拶</h2>
              <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                <p className="text-xl leading-relaxed font-medium text-gray-800 md:text-2xl">
                  自宅で暮らし続けるための
                  <span className="font-semibold text-blue-600">&ldquo;仕組み&rdquo;</span>を創る。
                  <br />
                  私たちは、地域に
                  <span className="font-semibold text-orange-600">
                    &ldquo;支え合いの土壌&rdquo;
                  </span>
                  を育てます。
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-10 shadow-lg backdrop-blur-sm">
              <div className="space-y-8 text-lg leading-relaxed text-gray-700">
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-sm font-semibold text-white">
                    1
                  </span>
                  私は理学療法士として約20年間、医療・介護の現場に向き合ってきました。
                  その中で強く感じてきたのは、「住み慣れた家で暮らし続けたい」という当たり前の願いが、いまだ社会全体で十分に支えられていないという現実です。
                </p>
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-400 text-sm font-semibold text-white">
                    2
                  </span>
                  特に、独居や老老介護のご家庭では、日々の小さな異変に
                  <strong className="text-red-600">&ldquo;気づけない&rdquo;</strong>
                  こと自体が大きなリスクとなり、発見が遅れてしまうことで命に関わるケースも少なくありません。
                </p>
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-400 text-sm font-semibold text-white">
                    3
                  </span>
                  だからこそ私たちは、まずは人と人とのつながりを取り戻すことから始めています。
                  顔の見える関係性の中で、「何かあったら知らせよう」「少し気になるから声をかけよう」といった
                  <strong className="text-blue-600">&ldquo;気づき合い&rdquo;</strong>
                  が生まれること。 それが、もっとも自然で効果的な予防になると信じているからです。
                </p>
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 text-sm font-semibold text-white">
                    4
                  </span>
                  そして、支えられるだけでなく、高齢者ご自身が「地域を支える側」になれるような、役割や出番のある
                  <strong className="text-green-600">「活躍の場」</strong>
                  をつくることにも力を入れています。
                </p>
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-400 text-sm font-semibold text-white">
                    5
                  </span>
                  今後は、地域の誰もが関わり合いながら支え合える、高齢者が主役となるプラットフォームの形成を目指しています。
                </p>
                <p className="flex items-start">
                  <span className="mt-1 mr-4 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-400 text-sm font-semibold text-white">
                    6
                  </span>
                  近所の人がさりげなく声をかけ合い、「ちょっといつもと違うな」と感じたときに、自然に支援につなげられる。そんな地域の中の
                  <strong className="text-purple-600">&ldquo;つながり&rdquo;</strong>
                  こそが、暮らしの安心を支える力になるはずです。
                </p>
                <div className="rounded-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
                  <p className="font-medium text-gray-800">
                    「見守りの安心」と「人とのつながり」を、地域に少しずつ取り戻していけるように。
                    私たちは、信頼を築くことを大切にしながら、一人ひとりの暮らしに丁寧に寄り添っていきます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ブランド Section */}
      <section
        id="brand"
        className="relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white py-32"
      >
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-300/10 blur-2xl"></div>
        <div className="absolute bottom-32 left-20 h-40 w-40 rounded-full bg-gradient-to-br from-orange-200/20 to-yellow-300/10 blur-2xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-block rounded-full border border-gray-200/50 bg-gray-100/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm">
              🏢 Our Brands
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">ブランド</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              私たちが提供する3つのサービスブランドをご紹介します
            </p>
          </div>

          <div className="mx-auto max-w-6xl space-y-16">
            {/* ウェルピポ・コンシェルジュ */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
                    <span className="text-3xl font-bold text-white">01</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-700 md:text-3xl">
                      ウェルピポ・コンシェルジュ
                    </h3>
                  </div>
                  <div className="rounded-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      <strong className="text-blue-700">「ウェルピポ・コンシェルジュ」</strong>
                      は、公的保険や便利屋では解決できない、暮らしの中の
                      <span className="font-semibold text-blue-600">&ldquo;すき間&rdquo;</span>
                      にある、切実な悩みに、専門家の視点から応える、新しいサービスです。
                      私たちの最大の強みは、代表者を司令塔とした、多彩な専門家ネットワークです。各専門家チームが責任を持ってサポートします。
                      もう、あちこちに電話する必要はありません。
                      あなたの暮らしの全ての「困った」の、最初の、そして唯一の相談窓口となること。
                      それが、私たちの約束です。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ウェルピポ・ステージ */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-yellow-400 shadow-lg">
                    <span className="text-3xl font-bold text-white">02</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                      <svg
                        className="h-4 w-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-orange-700 md:text-3xl">
                      ウェルピポ・ステージ
                    </h3>
                  </div>
                  <div className="rounded-2xl border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      「まだまだ働きたい」「誰かの役に立ちたい」—。
                      <strong className="text-orange-700">「ウェルピポ・ステージ」</strong>
                      は、そんな、意欲あふれるシニアの皆様が、その人生で培った、かけがえのない
                      <span className="font-semibold text-orange-600">「経験と誇り」</span>
                      を、もう一度社会で輝かせるための、新しい活躍の舞台です。
                      私たちが提供するのは、単なる仕事のマッチングではありません。
                      元・教師の方には、地域の子供たちに教える喜びを。
                      元・経営者の方には、その知見で中小企業を救うやりがいを。
                      私たちは、サポーター一人ひとりの
                      <span className="font-semibold text-orange-600">
                        &ldquo;人生の物語&rdquo;
                      </span>
                      に敬意を払い、その人が最も輝ける「本当の出番」を丁寧に創造します。
                      これは、単なる労働力の提供ではありません。その人の「経験」を、社会の「希望」に変える、私たちの挑戦です。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ウェルピポ・ネットワーク */}
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-teal-400 shadow-lg">
                    <span className="text-3xl font-bold text-white">03</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 md:text-3xl">
                      ウェルピポ・ネットワーク
                    </h3>
                  </div>
                  <div className="rounded-2xl border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-teal-50 p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      <strong className="text-green-700">「ウェルピポ・ネットワーク」</strong>
                      は、地域に暮らす人々が、自然と支え合う、新しい見守りの形です。
                      これまで育んできた、世代を超えたコミュニティの繋がりを土台に、私たちは
                      <span className="font-semibold text-green-600">「人の目」と「技術の目」</span>
                      を組み合わせてそれを可能にしていきます。 この、
                      <span className="font-semibold text-green-600">「顔の見える安心感」</span>
                      に満ちた、持続可能な見守りネットワークを、この地域に完成させること。
                      それが、私たちの目標です。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会社情報 Section */}
      <section
        id="company"
        className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-yellow-50/50 py-32"
      >
        <div className="absolute top-24 right-24 h-36 w-36 rounded-full bg-gradient-to-br from-orange-200/20 to-amber-300/10 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-200/20 to-orange-300/10 blur-xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-block rounded-full border border-orange-200/50 bg-orange-100/80 px-4 py-2 text-sm font-medium text-orange-800 backdrop-blur-sm">
              🏢 Company Information
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">会社情報</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              株式会社ウェルピポの基本情報をご紹介します
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-gray-100/50 bg-white/80 p-10 shadow-lg backdrop-blur-sm">
              <dl className="space-y-10">
                <div className="flex flex-col gap-6 border-b border-gray-200/50 pb-8 md:flex-row md:items-start">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                      <svg
                        className="h-5 w-5 text-white"
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
                    <dt className="text-lg font-semibold text-blue-700">会社名</dt>
                  </div>
                  <dd className="text-lg font-medium text-gray-800">株式会社ウェルピポ</dd>
                </div>

                <div className="flex flex-col gap-6 border-b border-gray-200/50 pb-8 md:flex-row md:items-start">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-400">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <dt className="text-lg font-semibold text-orange-700">所在地</dt>
                  </div>
                  <dd className="text-lg leading-relaxed text-gray-800">
                    〒812-0011
                    <br />
                    福岡県福岡市博多区博多駅前1丁目23番2号
                    <br />
                    ParkFront博多駅前1丁目5F-B
                  </dd>
                </div>

                <div className="flex flex-col gap-6 border-b border-gray-200/50 pb-8 md:flex-row md:items-start">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-400">
                      <svg
                        className="h-5 w-5 text-white"
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
                    <dt className="text-lg font-semibold text-green-700">代表取締役</dt>
                  </div>
                  <dd className="text-lg font-medium text-gray-800">大野 正也</dd>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-400">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z"
                        />
                      </svg>
                    </div>
                    <dt className="text-lg font-semibold text-purple-700">事業内容</dt>
                  </div>
                  <dd className="text-lg text-gray-800">
                    <div className="grid gap-3">
                      {[
                        { text: '高齢者向け予防事業', icon: '🏥' },
                        { text: '生活支援事業', icon: '🤝' },
                        { text: '介護者支援事業', icon: '💙' },
                        { text: '地域マッチングサービス開発・運営事業', icon: '🌐' },
                        { text: 'IoTソリューション提供事業', icon: '📱' },
                        { text: '高齢者見守り事業', icon: '👁️' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-xl border border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 p-3"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* お問い合わせ Section */}
      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 py-32"
      >
        <div className="absolute top-32 left-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-300/10 blur-2xl"></div>
        <div className="absolute right-20 bottom-20 h-32 w-32 rounded-full bg-gradient-to-br from-orange-200/20 to-pink-300/10 blur-xl"></div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-block rounded-full border border-blue-200/50 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 backdrop-blur-sm">
              💬 Contact Us
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">お問い合わせ</h2>
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-gray-700">
                弊社へのお問い合わせはこちらよりお願い致します。
                <br />
                <span className="font-semibold text-blue-600">２営業日以内</span>
                にご返信させて頂きます。
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
