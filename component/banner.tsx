"use client";

import { useState, useEffect } from "react"

export function Banner() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const parallaxOffset = scrollY * 0.5

    return (
        <section className="relative h-screen overflow-hidden">
          {/* Background Image with Parallax */}
          <div
            className="absolute inset-0 w-full h-[120%]"
            style={{
              transform: `translateY(${parallaxOffset}px)`,
            }}
          >
            <img
              src="/banner.jpg"
              alt="Banner Background"
              className="w-full h-full object-cover"
            />
          </div>
    
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
    
          {/* Diagonal Bottom Clip */}
          <div
            className="absolute inset-0 bg-black/10"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
            }}
          ></div>
    
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">Ideas</h1>
              <p className="text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl mx-auto">
                Where all our great things begin
              </p>
            </div>
          </div>
    
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>
      )
    }