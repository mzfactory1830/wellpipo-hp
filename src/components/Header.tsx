import Link from 'next/link'
import ScrollLink from './ScrollLink'

export default function Header() {
  const menuItems = [
    { href: '/#about', label: 'ウェルピポについて', isScroll: true },
    { href: '/#greeting', label: 'ご挨拶', isScroll: true },
    { href: '/#service', label: 'サービス', isScroll: true },
    { href: '/#company', label: '会社情報', isScroll: true },
    { href: '/#contact', label: 'お問い合わせ', isScroll: true },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="font-[family-name:var(--font-comfortaa)] text-4xl font-bold text-gray-700">
              wellpipo
            </h1>
          </Link>

          <nav className="hidden space-x-6 lg:flex xl:space-x-8">
            {menuItems.map((item) =>
              item.isScroll ? (
                <ScrollLink
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 xl:text-base"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 xl:text-base"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
