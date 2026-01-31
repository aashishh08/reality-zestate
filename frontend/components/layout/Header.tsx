"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact", href: "/contact" },
];

// Split nav links for left and right sides
const leftNavLinks = navLinks.slice(0, 2); // Home, Projects
const rightNavLinks = navLinks.slice(2); // Blogs, About Us, Contact

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b",
        isScrolled
          ? "bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm border-black/5 py-2"
          : "bg-white/90 backdrop-blur-sm border-transparent py-4"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-20">
          
          {/* Left Navigation - Pushed towards Center */}
          <nav className="hidden lg:flex items-center justify-end gap-12 xl:gap-16">
            {leftNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Logo - Centered */}
          <Link href="/" className="z-50 group flex justify-center shrink-0">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1A1A1A] tracking-widest group-hover:text-gold-dark transition-colors text-center whitespace-nowrap">
              OPULNZ <span className="text-gold-dark">ABODE</span>
            </h1>
          </Link>

          {/* Right Navigation - Pushed towards Center + Button */}
          <div className="flex items-center justify-start">
             <nav className="hidden lg:flex items-center gap-12 xl:gap-16">
              {rightNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6">
               <Link
                href="/contact"
                className="hidden lg:inline-block px-6 py-2.5 bg-black text-white font-bold text-xs tracking-widest rounded-sm hover:bg-gold-dark transition-colors uppercase ml-8"
              >
                Book
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center gap-2 text-gray-900 hover:text-gold transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FDFBF7] shadow-lg border-t border-black/5">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-6 py-3 text-zinc-600 hover:text-gold-dark hover:bg-black/5 transition-colors text-sm font-medium tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-6 py-3">
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold text-sm rounded-sm shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BOOK NOW
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
