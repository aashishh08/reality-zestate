"use client";

import Link from "next/link";
import { NewTabLink } from "@/components/ui/NewTabLink";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, MapPin } from "lucide-react";
import { Location } from "@/lib";
import { CONTACT_INFO } from "@/lib/constants";

interface FooterProps {
  locations?: Location[];
}

export function Footer({ locations = [] }: FooterProps) {
  const phoneHref = `tel:${CONTACT_INFO.PHONE_NUMBER.replace(/\s/g, "")}`;
  const footerPhoneDisplay = CONTACT_INFO.PHONE_NUMBER.replace(/^\+91/, "");

  const cities = locations.filter(l => l.type === "city").slice(0, 6);
  const displayLocations: Array<{ name: string; slug: string }> =
    cities.length > 0
      ? cities.map(l => ({ name: l.name, slug: l.slug }))
      : [
        { name: "Gurgaon", slug: "gurgaon" },
        { name: "Delhi", slug: "delhi" },
        { name: "Mumbai", slug: "mumbai" },
        { name: "Bangalore", slug: "bangalore" },
        { name: "Pune", slug: "pune" },
        { name: "Hyderabad", slug: "hyderabad" },
      ];

  const quickLinks = [
    { label: "Trending Projects", href: "/tag/trending" },
    { label: "Upcoming Launches", href: "/tag/upcoming" },
    { label: "New Launch", href: "/tag/new-launch" },
    { label: "Ready to Move", href: "/tag/ready-to-move" },
    { label: "Luxury Homes", href: "/tag/luxury" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <footer className="bg-[#F5F2EC] text-[#2C2416] pt-10 pb-6 md:pt-16 md:pb-8 border-t border-[#C9A961]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">

          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-6 hover:text-[#C9A961] transition-colors">
                SUPERLUXERE
              </h2>
            </Link>
            <p className="hidden md:block text-zinc-500 leading-relaxed mb-6 text-sm">
              Redefining luxury real estate with a curated collection of the most exquisite properties. We connect distinguished buyers with exceptional homes.
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#2C2416]/5 flex items-center justify-center hover:bg-[#C9A961] hover:text-white transition-all duration-300 touch-manipulation"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs md:text-sm font-bold mb-3 md:mb-6 tracking-widest uppercase text-[#2C2416]">
              Explore
            </h3>
            <ul className="space-y-2 md:space-y-4 text-zinc-500 text-sm">
              {quickLinks.map((link, index) => (
                <li key={link.href} className={index >= 4 ? "hidden md:list-item" : undefined}>
                  <Link href={link.href} className="hover:text-[#C9A961] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Locations ─────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs md:text-sm font-bold mb-3 md:mb-6 tracking-widest uppercase text-[#2C2416]">
              Locations
            </h3>
            <ul className="space-y-2 md:space-y-4 text-zinc-500 text-sm">
              {displayLocations.map((loc, index) => (
                <li key={loc.slug} className={index >= 4 ? "hidden md:list-item" : undefined}>
                  <Link href={`/location/${loc.slug}`} className="hover:text-[#C9A961] transition-colors">
                    <span className="md:hidden">{loc.name}</span>
                    <span className="hidden md:inline">Luxury Properties in {loc.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs md:text-sm font-bold mb-3 md:mb-6 tracking-widest uppercase text-[#2C2416]">
              Get in Touch
            </h3>
            <ul className="space-y-3 md:space-y-5 text-zinc-500">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 text-[#C9A961] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm leading-snug">{CONTACT_INFO.ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="w-4 h-4 text-[#C9A961] shrink-0" />
                <a href={phoneHref} className="text-xs md:text-sm hover:text-[#C9A961] transition-colors touch-manipulation">
                  {footerPhoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3 min-w-0">
                <Mail className="w-4 h-4 text-[#C9A961] shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className="text-xs md:text-sm hover:text-[#C9A961] transition-colors truncate touch-manipulation"
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </li>
            </ul>

            <div className="hidden md:block mt-8">
              <h3 className="text-xs font-bold mb-4 tracking-widest uppercase text-[#2C2416]">Project Types</h3>
              <div className="flex flex-wrap gap-2">
                {["luxury", "villas", "penthouse", "affordable", "golf-residences"].map(slug => (
                  <NewTabLink
                    key={slug}
                    href={`/category/${slug}`}
                    className="text-xs px-3 py-1 rounded-full border border-[#C9A961]/30 text-zinc-500 hover:bg-[#C9A961] hover:text-white hover:border-[#C9A961] transition-all capitalize"
                  >
                    {slug.replace(/-/g, " ")}
                  </NewTabLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────── */}
        <div className="border-t border-[#C9A961]/20 pt-4 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-zinc-400 text-center md:text-left">
          <p>© 2026 Superluxere. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <Link href="#" className="hover:text-[#C9A961] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#C9A961] transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-[#C9A961] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
