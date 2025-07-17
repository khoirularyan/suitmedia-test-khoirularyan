"use client"

import { useEffect, useState, useRef } from "react"

export function Header() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY === 0) {
            // Di paling atas
            setIsHeaderVisible(true)
            setIsHeaderTransparent(false)
          } else if (currentScrollY > lastScrollY.current + 15) {
            // Scroll turun → sembunyi
            setIsHeaderVisible(false)
            setIsHeaderTransparent(false)
          } else if (currentScrollY < lastScrollY.current - 15) {
            // Scroll naik → muncul transparan
            setIsHeaderVisible(true)
            setIsHeaderTransparent(true)
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { name: "Work", href: "#", active: false },
    { name: "About", href: "#", active: false },
    { name: "Services", href: "#", active: false },
    { name: "Ideas", href: "#", active: true },
    { name: "Careers", href: "#", active: false },
    { name: "Contact", href: "#", active: false },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isHeaderTransparent
          ? "bg-orange-500/60 backdrop-blur-sm"
          : "bg-orange-500"
      }`}
    >
      <div className="container mx-auto px-6 py-4 max-w-[60vw]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8" />
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-white hover:text-gray-300 transition-colors duration-200 relative ${
                  item.active ? "font-semibold" : "font-normal"
                }`}
              >
                {item.name}
                {item.active && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
