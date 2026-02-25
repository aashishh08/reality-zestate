"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, MapPin, Building2, Tag, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { SCROLL_THRESHOLDS } from "@/lib/constants";
import { Location, Developer, Category } from "@/lib";

// Status tags — hardcoded because they are a fixed product concept
const STATUS_TAGS = [
  { label: "Trending", slug: "trending", color: "#EF4444", emoji: "🔥" },
  { label: "Upcoming", slug: "upcoming", color: "#F59E0B", emoji: "📅" },
  { label: "New Launch", slug: "new-launch", color: "#10B981", emoji: "🚀" },
  { label: "Ready to Move", slug: "ready-to-move", color: "#06B6D4", emoji: "🏠" },
  { label: "Under Construction", slug: "under-construction", color: "#F97316", emoji: "🏗️" },
  { label: "Featured", slug: "featured", color: "#8B5CF6", emoji: "⭐" },
  { label: "Luxury", slug: "luxury", color: "#D97706", emoji: "👑" },
  { label: "Investment Pick", slug: "investment-pick", color: "#DB2777", emoji: "💰" },
];

interface HeaderProps {
  locations?: Location[];
  developers?: Developer[];
  categories?: Category[];
}

type MegaMenu = "locations" | "developers" | "categories" | "status" | null;

export function Header({ locations = [], developers = [], categories = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenu>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > SCROLL_THRESHOLDS.HEADER);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMega = (menu: MegaMenu) => { clearTimeout(closeTimer.current!); setActiveMega(menu); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setActiveMega(null), 180); };

  const cities = locations.filter(l => l.type === "city").slice(0, 10);
  const devDisplay = developers.slice(0, 10);
  const catDisplay = categories.slice(0, 10);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b",
        isScrolled
          ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-black/5 py-2"
          : "bg-white/95 backdrop-blur-sm border-transparent py-4"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">

          {/* ── Left nav ───────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center justify-end gap-10 xl:gap-14">
            <Link href="/" className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/projects" className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase">
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Browse mega-menu trigger (left side) */}
            <div
              className="relative"
              onMouseEnter={() => openMega("locations")}
              onMouseLeave={closeMega}
            >
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-serif font-bold tracking-wider uppercase transition-colors",
                  activeMega ? "text-gold-dark" : "text-black hover:text-gold-dark"
                )}
              >
                Browse
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeMega && "rotate-180")} />
              </button>

              {/* Mega-menu panel */}
              {activeMega && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] bg-white shadow-2xl rounded-2xl border border-black/5 overflow-hidden"
                  onMouseEnter={() => openMega(activeMega)}
                  onMouseLeave={closeMega}
                >
                  <div className="grid grid-cols-4 h-full">
                    {/* ── Tab sidebar ── */}
                    <div className="bg-[#FDFBF7] border-r border-black/5 p-4 space-y-1">
                      {(
                        [
                          { key: "locations", icon: MapPin, label: "By Location" },
                          { key: "developers", icon: Building2, label: "By Developer" },
                          { key: "categories", icon: LayoutGrid, label: "By Type" },
                          { key: "status", icon: Tag, label: "By Status" },
                        ] as { key: MegaMenu; icon: React.ElementType; label: string }[]
                      ).map(({ key, icon: Icon, label }) => (
                        <button
                          key={key}
                          onMouseEnter={() => openMega(key)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200",
                            activeMega === key
                              ? "bg-black text-white"
                              : "text-zinc-600 hover:bg-black/5"
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* ── Content panel ── */}
                    <div className="col-span-3 p-6">
                      {activeMega === "locations" && (
                        <>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Top Cities</p>
                          <div className="grid grid-cols-2 gap-2">
                            {cities.map(loc => (
                              <Link
                                key={loc.id}
                                href={`/location/${loc.slug}`}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/5 hover:text-gold-dark transition-colors group"
                                onClick={() => setActiveMega(null)}
                              >
                                <MapPin className="w-4 h-4 text-gold shrink-0" />
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-gold-dark">{loc.name}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {activeMega === "developers" && (
                        <>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Top Developers</p>
                          <div className="grid grid-cols-2 gap-2">
                            {devDisplay.map(dev => (
                              <Link
                                key={dev.id}
                                href={`/developer/${dev.slug}`}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/5 transition-colors group"
                                onClick={() => setActiveMega(null)}
                              >
                                <Building2 className="w-4 h-4 text-gold shrink-0" />
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-gold-dark">{dev.name}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {activeMega === "categories" && (
                        <>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Project Types</p>
                          <div className="grid grid-cols-2 gap-2">
                            {catDisplay.map(cat => (
                              <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/5 transition-colors group"
                                onClick={() => setActiveMega(null)}
                              >
                                <LayoutGrid className="w-4 h-4 text-gold shrink-0" />
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-gold-dark">{cat.name}</span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {activeMega === "status" && (
                        <>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">By Status</p>
                          <div className="grid grid-cols-2 gap-2">
                            {STATUS_TAGS.map(tag => (
                              <Link
                                key={tag.slug}
                                href={`/tag/${tag.slug}`}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 transition-colors group"
                                onClick={() => setActiveMega(null)}
                              >
                                <span className="text-base">{tag.emoji}</span>
                                <span
                                  className="text-sm font-semibold"
                                  style={{ color: tag.color }}
                                >
                                  {tag.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link href="/" className="z-50 group flex justify-center shrink-0">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#1A1A1A] tracking-widest group-hover:text-gold-dark transition-colors text-center whitespace-nowrap">
              SUPERLUXERE
            </h1>
          </Link>

          {/* ── Right nav ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-start">
            <nav className="hidden lg:flex items-center gap-10 xl:gap-14">
              <Link href="/blogs" className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase">
                Blogs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/about-us" className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase">
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/contact" className="text-black hover:text-gold-dark transition-colors text-sm font-serif font-bold tracking-wider relative group uppercase">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-dark transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="hidden lg:inline-block px-6 py-2.5 bg-black text-white font-bold text-xs tracking-widest rounded-sm hover:bg-gold-dark transition-colors uppercase ml-8"
              >
                Book
              </Link>

              <button
                onClick={() => setMobileMenu(!isMobileMenuOpen)}
                className="lg:hidden flex items-center gap-2 text-gray-900 hover:text-gold transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FDFBF7] shadow-lg border-t border-black/5 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col py-4">
            {[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Blogs", href: "/blogs" },
              { label: "About Us", href: "/about-us" },
              { label: "Contact", href: "/contact" },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="px-6 py-3 text-zinc-600 hover:text-gold-dark hover:bg-black/5 transition-colors text-sm font-medium tracking-wide"
                onClick={() => setMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile: Browse by Status */}
            <div className="px-6 pt-4 pb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Browse by Status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_TAGS.map(tag => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="flex items-center gap-2 py-2 text-xs font-semibold"
                    style={{ color: tag.color }}
                    onClick={() => setMobileMenu(false)}
                  >
                    {tag.emoji} {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile: By Location */}
            {cities.length > 0 && (
              <div className="px-6 pt-4 pb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Top Locations</p>
                <div className="grid grid-cols-2 gap-2">
                  {cities.slice(0, 6).map(loc => (
                    <Link
                      key={loc.id}
                      href={`/location/${loc.slug}`}
                      className="text-sm text-zinc-600 hover:text-gold-dark py-1"
                      onClick={() => setMobileMenu(false)}
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="px-6 py-4">
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold text-sm rounded-sm shadow-md"
                onClick={() => setMobileMenu(false)}
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
