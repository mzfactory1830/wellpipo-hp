import ContactForm from "@/components/ContactForm"
import ScrollLink from "@/components/ScrollLink"
import Link from "next/link"
import { getNews } from "@/lib/supabase"

export default async function HomePage() {
  const recentNews = await getNews(6)
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#e6f4f8] via-white to-[#fef5e7]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6">
              <span className="font-normal text-[#5fbcd4]">住み慣れた家で、</span><br />
              <span className="text-gray-700">最期まで自分らしく</span>
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl">
              私たちウェルピポは、地域に支え合いの土壌を育て、
              誰もが安心して暮らせる社会を創ります
            </p>
            <div className="flex gap-4">
              <ScrollLink 
                href="/#about"
                className="px-8 py-3 bg-[#5fbcd4] text-white hover:bg-[#4a9bb5] transition-colors rounded-sm"
              >
                私たちについて
              </ScrollLink>
              <ScrollLink 
                href="/#contact"
                className="px-8 py-3 border-2 border-[#5fbcd4] text-[#5fbcd4] hover:bg-[#5fbcd4] hover:text-white transition-colors rounded-sm"
              >
                お問い合わせ
              </ScrollLink>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-5 h-5 text-[#5fbcd4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* お知らせ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">News</p>
              <h2 className="text-4xl font-medium text-gray-800">お知らせ</h2>
            </div>
            <Link 
              href="/news" 
              className="text-sm border-b border-[#5fbcd4] text-[#5fbcd4] pb-1 hover:opacity-60 transition-opacity"
            >
              すべて見る
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.length > 0 ? (
              recentNews.map((news) => (
                <article key={news.id} className="group">
                  <Link href={`/news/${news.slug}`}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4">
                      {news.thumbnail_url ? (
                        <img 
                          src={news.thumbnail_url}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                        <time dateTime={news.published_at || news.created_at}>
                          {new Date(news.published_at || news.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\//g, '.')}
                        </time>
                        {news.category && (
                          <>
                            <span>/</span>
                            <span className="uppercase tracking-wider text-[#f8bf79]">
                              {news.category.name}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-light text-lg line-clamp-2 group-hover:opacity-60 transition-opacity text-gray-800">
                        {news.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">お知らせはまだありません</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ウェルピポについて Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">About</p>
            <h2 className="text-4xl font-medium text-gray-800">ウェルピポについて</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* PURPOSE */}
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-wider text-[#5fbcd4] mb-4">Purpose</h3>
              <p className="text-2xl font-light leading-relaxed text-gray-800">
                住み慣れた家で、<br />
                最期まで自分らしく暮らせる社会を創る。
              </p>
            </div>

            {/* VISION */}
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-wider text-[#5fbcd4] mb-4">Vision</h3>
              <p className="text-xl font-light leading-relaxed text-gray-800">
                誰もが「支える人」であり「支えられる人」になる。
                世代を超えた「活躍」と「ありがとう」の輪が、
                地域全体を温かく見守る社会。
              </p>
            </div>

            {/* MISSION */}
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-wider text-[#5fbcd4] mb-4">Mission</h3>
              <p className="text-xl font-light leading-relaxed text-gray-800">
                一人ひとりと深く向き合う。<br />
                人と人、人と機会をつなぐをデザインする。
              </p>
            </div>

            {/* VALUE */}
            <div className="text-center md:text-left">
              <h3 className="text-sm uppercase tracking-wider text-[#5fbcd4] mb-4">Value</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: '感謝', color: 'border-[#ed746b] text-[#ed746b]' },
                  { text: '挑戦', color: 'border-[#5fbcd4] text-[#5fbcd4]' },
                  { text: '発見', color: 'border-[#f8bf79] text-[#f8bf79]' },
                  { text: '成長', color: 'border-[#4a9bb5] text-[#4a9bb5]' },
                  { text: '笑顔', color: 'border-[#f8bf79] text-[#f8bf79]' },
                  { text: '主役', color: 'border-[#ed746b] text-[#ed746b]' }
                ].map((value) => (
                  <span key={value.text} className={`px-4 py-2 border ${value.color} text-sm`}>
                    全員『{value.text}』
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ご挨拶 Section */}
      <section id="greeting" className="py-24 bg-[#e6f4f8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">Greeting</p>
              <h2 className="text-4xl font-medium mb-8 text-gray-800">ご挨拶</h2>
              <p className="text-xl font-light text-gray-800">
                自宅で暮らし続けるための&ldquo;仕組み&rdquo;を創る。<br />
                私たちは、地域に&ldquo;支え合いの土壌&rdquo;を育てます。
              </p>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                私は理学療法士として約20年間、医療・介護の現場に向き合ってきました。
                その中で強く感じてきたのは、「住み慣れた家で暮らし続けたい」という当たり前の願いが、いまだ社会全体で十分に支えられていないという現実です。
              </p>
              <p>
                特に、独居や老老介護のご家庭では、日々の小さな異変に&ldquo;気づけない&rdquo;こと自体が大きなリスクとなり、発見が遅れてしまうことで命に関わるケースも少なくありません。
              </p>
              <p>
                だからこそ私たちは、まずは人と人とのつながりを取り戻すことから始めています。
                顔の見える関係性の中で、「何かあったら知らせよう」「少し気になるから声をかけよう」といった&ldquo;気づき合い&rdquo;が生まれること。
                それが、もっとも自然で効果的な予防になると信じているからです。
              </p>
              <p>
                そして、支えられるだけでなく、高齢者ご自身が「地域を支える側」になれるような、役割や出番のある「活躍の場」をつくることにも力を入れています。
              </p>
              <p>
                今後は、地域の誰もが関わり合いながら支え合える、高齢者が主役となるプラットフォームの形成を目指しています。
              </p>
              <p>
                近所の人がさりげなく声をかけ合い、「ちょっといつもと違うな」と感じたときに、自然に支援につなげられる。そんな地域の中の&ldquo;つながり&rdquo;こそが、暮らしの安心を支える力になるはずです。
              </p>
              <p>
                「見守りの安心」と「人とのつながり」を、地域に少しずつ取り戻していけるように。
                私たちは、信頼を築くことを大切にしながら、一人ひとりの暮らしに丁寧に寄り添っていきます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ブランド Section */}
      <section id="brand" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">Brand</p>
            <h2 className="text-4xl font-medium text-gray-800">ブランド</h2>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-24">
            {/* ウェルピポ・コンシェルジュ */}
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-light text-[#5fbcd4]/30">01</span>
              </div>
              <div className="md:col-span-11">
                <h3 className="text-2xl font-light mb-6 text-gray-800">ウェルピポ・コンシェルジュ</h3>
                <p className="text-gray-700 leading-relaxed">
                  「ウェルピポ・コンシェルジュ」は、公的保険や便利屋では解決できない、暮らしの中の&ldquo;すき間&rdquo;にある、切実な悩みに、専門家の視点から応える、新しいサービスです。
                  私たちの最大の強みは、代表者を司令塔とした、多彩な専門家ネットワークです。各専門家チームが責任を持ってサポートします。
                  もう、あちこちに電話する必要はありません。
                  あなたの暮らしの全ての「困った」の、最初の、そして唯一の相談窓口となること。
                  それが、私たちの約束です。
                </p>
              </div>
            </div>

            {/* ウェルピポ・ステージ */}
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-light text-[#f8bf79]/30">02</span>
              </div>
              <div className="md:col-span-11">
                <h3 className="text-2xl font-light mb-6 text-gray-800">ウェルピポ・ステージ</h3>
                <p className="text-gray-700 leading-relaxed">
                  「まだまだ働きたい」「誰かの役に立ちたい」—。
                  「ウェルピポ・ステージ」は、そんな、意欲あふれるシニアの皆様が、その人生で培った、かけがえのない「経験と誇り」を、もう一度社会で輝かせるための、新しい活躍の舞台です。
                  私たちが提供するのは、単なる仕事のマッチングではありません。
                  元・教師の方には、地域の子供たちに教える喜びを。
                  元・経営者の方には、その知見で中小企業を救うやりがいを。
                  私たちは、サポーター一人ひとりの&ldquo;人生の物語&rdquo;に敬意を払い、その人が最も輝ける「本当の出番」を丁寧に創造します。
                  これは、単なる労働力の提供ではありません。その人の「経験」を、社会の「希望」に変える、私たちの挑戦です。
                </p>
              </div>
            </div>

            {/* ウェルピポ・ネットワーク */}
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-1">
                <span className="text-4xl font-light text-[#ed746b]/30">03</span>
              </div>
              <div className="md:col-span-11">
                <h3 className="text-2xl font-light mb-6 text-gray-800">ウェルピポ・ネットワーク</h3>
                <p className="text-gray-700 leading-relaxed">
                  「ウェルピポ・ネットワーク」は、地域に暮らす人々が、自然と支え合う、新しい見守りの形です。
                  これまで育んできた、世代を超えたコミュニティの繋がりを土台に、私たちは「人の目」と「技術の目」を組み合わせてそれを可能にしていきます。
                  この、「顔の見える安心感」に満ちた、持続可能な見守りネットワークを、この地域に完成させること。
                  それが、私たちの目標です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会社情報 Section */}
      <section id="company" className="py-24 bg-[#fef5e7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">Company</p>
            <h2 className="text-4xl font-medium text-gray-800">会社情報</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <dl className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4 pb-8 border-b border-gray-200">
                <dt className="text-sm text-[#5fbcd4] font-medium">会社名</dt>
                <dd className="md:col-span-2 text-gray-800">株式会社ウェルピポ</dd>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pb-8 border-b border-gray-200">
                <dt className="text-sm text-[#5fbcd4] font-medium">所在地</dt>
                <dd className="md:col-span-2 text-gray-800">
                  〒812-0011<br />
                  福岡県福岡市博多区博多駅前1丁目23番2号<br />
                  ParkFront博多駅前1丁目5F-B
                </dd>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 pb-8 border-b border-gray-200">
                <dt className="text-sm text-[#5fbcd4] font-medium">代表取締役</dt>
                <dd className="md:col-span-2 text-gray-800">大野 正也</dd>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <dt className="text-sm text-[#5fbcd4] font-medium">事業内容</dt>
                <dd className="md:col-span-2 text-gray-800">
                  <ul className="space-y-1">
                    <li>高齢者向け予防事業</li>
                    <li>生活支援事業</li>
                    <li>介護者支援事業</li>
                    <li>地域マッチングサービス開発・運営事業</li>
                    <li>IoTソリューション提供事業</li>
                    <li>高齢者見守り事業</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* お問い合わせ Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm text-[#5fbcd4] uppercase tracking-wider mb-2">Contact</p>
            <h2 className="text-4xl font-medium mb-4 text-gray-800">お問い合わせ</h2>
            <p className="text-gray-700">
              弊社へのお問い合わせはこちらよりお願い致します。２営業日以内にご返信させて頂きます。
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}