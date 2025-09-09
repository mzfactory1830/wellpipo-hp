"use client"

import { ReactNode } from "react"

interface ScrollLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export default function ScrollLink({ href, children, className }: ScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const targetId = href.replace("/#", "")
    const element = document.getElementById(targetId)
    
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}