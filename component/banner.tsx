"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface BannerProps {
  cmsImageUrl?: string;
  altText?: string;
}

export function Banner({ cmsImageUrl, altText }: BannerProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;

  const imageSrc =
    typeof cmsImageUrl === "string" && cmsImageUrl
      ? cmsImageUrl
      : "/banner.jpg";

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          clipPath: "polygon(0 100%, 100% 70%, 100% 100%, 0% 100%)",
        }}
      >
        <Image
          src={imageSrc}
          alt={altText || "Banner Background"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Diagonal White Overlay (putih di bawah, transparan di atas) */}
      <div
        className="absolute inset-0 z-10 bg-white"
        style={{
          clipPath: "polygon(0 100%, 100% 70%, 100% 100%, 0% 100%)",
          transform: `translateY(${parallaxOffset * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Ideas
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-xl mx-auto">
            Where all our great things begin
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20">
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
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
