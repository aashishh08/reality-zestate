"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, MapPin } from "lucide-react";
import { Location } from "@/lib";

interface FooterProps {
  locations?: Location[];
}

export function Footer({ locations = [] }: FooterProps) {
  // Use real city locations from DB; fall back to curated list so footer is never empty
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
    <footer className="bg-[#F5F2EC] text-[#2C2416] pt-16 pb-8 border-t border-[#C9A961]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div>
            <Link href="/">
              <h2 className="text-3xl font-serif font-bold mb-6 hover:text-[#C9A961] transition-colors">
                SUPERLUXERE
              </h2>
            </Link>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Redefining luxury real estate with a curated collection of the most exquisite properties. We connect distinguished buyers with exceptional homes.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 rounded-full bg-[#2C2416]/5 flex items-center justify-center hover:bg-[#C9A961] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links (by status/tag) ────────────────────────────── */}
          <div>
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-[#2C2416]">Explore</h3>
            <ul className="space-y-4 text-zinc-500">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#C9A961] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Locations — live from DB ───────────────────────────────── */}
          <div>
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-[#2C2416]">Locations</h3>
            <ul className="space-y-4 text-zinc-500">
              {displayLocations.map(loc => (
                <li key={loc.slug}>
                  <Link href={`/location/${loc.slug}`} className="hover:text-[#C9A961] transition-colors">
                    Luxury Properties in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-[#2C2416]">Get in Touch</h3>
            <ul className="space-y-5 text-zinc-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A961] shrink-0 mt-1" />
                <span className="text-sm">Level 18, One Horizon Center, Golf Course Road, Gurgaon, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9A961] shrink-0" />
                <a href="tel:+919999999999" className="text-sm hover:text-[#C9A961] transition-colors">+91 999 999 9999</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A961] shrink-0" />
                <a href="mailto:concierge@superluxere.com" className="text-sm hover:text-[#C9A961] transition-colors">
                  concierge@superluxere.com
                </a>
              </li>
            </ul>

            {/* Browse by Type mini-links */}
            <div className="mt-8">
              <h3 className="text-xs font-bold mb-4 tracking-widest uppercase text-[#2C2416]">Project Types</h3>
              <div className="flex flex-wrap gap-2">
                {["luxury", "villas", "penthouse", "affordable", "golf-residences"].map(slug => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="text-xs px-3 py-1 rounded-full border border-[#C9A961]/30 text-zinc-500 hover:bg-[#C9A961] hover:text-white hover:border-[#C9A961] transition-all capitalize"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="border-t border-[#C9A961]/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© 2026 Superluxere. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-[#C9A961] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#C9A961] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#C9A961] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
