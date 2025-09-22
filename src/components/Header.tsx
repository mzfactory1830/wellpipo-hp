'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ScrollLink from './ScrollLink'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '/#about', label: 'ウェルピポについて', isScroll: true },
    { href: '/#greeting', label: 'ご挨拶', isScroll: true },
    { href: '/#service', label: 'サービス', isScroll: true },
    { href: '/#company', label: '会社情報', isScroll: true },
    { href: '/#contact', label: 'お問い合わせ', isScroll: true },
  ]

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1
              className={`font-[family-name:var(--font-comfortaa)] text-4xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-700' : 'text-gray-700'
              }`}
            >
              wellpipo
            </h1>
          </Link>

          <nav className="hidden space-x-6 lg:flex xl:space-x-8">
            {menuItems.map((item) =>
              item.isScroll ? (
                <ScrollLink
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors xl:text-base ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors xl:text-base ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
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
