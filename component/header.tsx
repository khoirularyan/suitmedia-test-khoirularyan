"use client";

import { useEffect, useState, useRef } from "react";

export function Header() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isHeaderTransparent, setIsHeaderTransparent] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY === 0) {
            setIsHeaderVisible(true);
            setIsHeaderTransparent(false);
          } else if (currentScrollY > lastScrollY.current + 15) {
            setIsHeaderVisible(false);
            setIsHeaderTransparent(false);
          } else if (currentScrollY < lastScrollY.current - 15) {
            setIsHeaderVisible(true);
            setIsHeaderTransparent(true);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Work", href: "#", active: false },
    { name: "About", href: "#", active: false },
    { name: "Services", href: "#", active: false },
    { name: "Ideas", href: "#", active: true },
    { name: "Careers", href: "#", active: false },
    { name: "Contact", href: "#", active: false },
  ];

  // Handle open/close with animation
  const handleMobileMenu = () => {
    if (!mobileOpen) {
      setMobileOpen(true);
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
      setTimeout(() => setMobileOpen(false), 400);
    }
  };

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
      <div className="container mx-auto px-6 py-4 max-w-[75vw]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group text-white hover:text-gray-300 transition-colors duration-200 relative ${
                  item.active ? "font-semibold" : "font-normal"
                }`}
              >
                {item.name}
                {/* Active */}
                {item.active && (
                  <span
                    className="absolute left-1/2 -bottom-1 h-0.5 bg-white transition-all duration-300"
                    style={{
                      width: "100%",
                      transform: "translateX(-50%)",
                    }}
                  ></span>
                )}
                <span
                  className="absolute left-1/2 -bottom-1 h-0.5 bg-white transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100"
                  style={{
                    width: "100%",
                    transform: "translateX(-50%)",
                  }}
                ></span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={handleMobileMenu}
            aria-label="Open menu"
          >
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

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav
            className={`md:hidden bg-orange-500 px-6 py-4 absolute top-full left-0 w-full z-40 flex flex-col gap-4 ${
              dropdownVisible ? "animate-dropdown" : "animate-dropdown-close"
            }`}
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-white ${
                  item.active ? "font-semibold underline" : "font-normal"
                }`}
                onClick={handleMobileMenu}
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
