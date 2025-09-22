'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Loading() {
  const [visibleLetters, setVisibleLetters] = useState(0)
  const text = 'wellpipo'

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev >= text.length) {
          return 0 // Reset animation
        }
        return prev + 1
      })
    }, 200) // Each letter appears every 200ms

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="mb-8">
        <Image
          src="/logo.svg"
          alt="ウェルピポ"
          width={200}
          height={60}
          priority
          className="opacity-80"
        />
      </div>

      <div className="text-5xl font-bold tracking-wider">
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={`inline-block transform transition-all duration-500 ${
              index < visibleLetters ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              color: index < 2 ? '#5fbcd4' : index < 5 ? '#f8bf79' : '#ed746b',
              transitionDelay: `${index * 50}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
