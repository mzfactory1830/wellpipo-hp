import Link from "next/link"
import Image from "next/image"
import ScrollLink from "./ScrollLink"

export default function Header() {
  const menuItems = [
    { href: "/#about", label: "ウェルピポについて", isScroll: true },
    { href: "/#greeting", label: "ご挨拶", isScroll: true },
    { href: "/#brand", label: "ブランド", isScroll: true },
    { href: "/#company", label: "会社情報", isScroll: true },
    { href: "/#contact", label: "お問い合わせ", isScroll: true },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="株式会社ウェルピポ" 
              width={180} 
              height={54}
              priority
            />
          </Link>

          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              item.isScroll ? (
                <ScrollLink
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm xl:text-base"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}