import Link from 'next/link'
import ScrollLink from './ScrollLink'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">株式会社ウェルピポ</h3>
            <p className="text-sm text-gray-400">
              住み慣れた家で、
              <br />
              最期まで自分らしく暮らせる
              <br />
              社会を創る。
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">メニュー</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink href="/#about" className="text-sm text-gray-400 hover:text-white">
                  ウェルピポについて
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/#greeting" className="text-sm text-gray-400 hover:text-white">
                  ご挨拶
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/#brand" className="text-sm text-gray-400 hover:text-white">
                  ブランド
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/#company" className="text-sm text-gray-400 hover:text-white">
                  会社情報
                </ScrollLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">ブランド</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink href="/#brand" className="text-sm text-gray-400 hover:text-white">
                  ウェルピポ・コンシェルジュ
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/#brand" className="text-sm text-gray-400 hover:text-white">
                  ウェルピポ・ステージ
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/#brand" className="text-sm text-gray-400 hover:text-white">
                  ウェルピポ・ネットワーク
                </ScrollLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">お問い合わせ</h4>
            <p className="text-sm text-gray-400">
              〒812-0011
              <br />
              福岡県福岡市博多区博多駅前1-23-2
              <br />
              ParkFront博多駅前1丁目5F-B
              <br />
              <ScrollLink href="/#contact" className="text-blue-400 hover:text-blue-300">
                お問い合わせフォーム
              </ScrollLink>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">© 2024 株式会社ウェルピポ All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
