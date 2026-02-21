"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F5F2EC] text-[#2C2416] pt-16 pb-8 border-t border-[#C9A961]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">
              OPULNZ <span className="text-[#C9A961]">ABODE</span>
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Redefining luxury real estate with a curated collection of the most exquisite properties. We connect distinguished buyers with exceptional homes.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2C2416]/5 flex items-center justify-center hover:bg-[#C9A961] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-[#2C2416]">Explore</h3>
            <ul className="space-y-4 text-zinc-500">
              {['Trending Projects', 'Upcoming Launches', 'Boutique Collection', 'Opulnz Exclusive', 'About Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#C9A961] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-[#2C2416]">Locations</h3>
            <ul className="space-y-4 text-zinc-500">
              {['Gurgaon', 'South Delhi', 'Mumbai', 'Goa', 'Dubai', 'London'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#C9A961] transition-colors">
                    Luxury Properties in {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
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
                <a href="mailto:concierge@opulnzabode.com" className="text-sm hover:text-[#C9A961] transition-colors">concierge@opulnzabode.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C9A961]/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© 2026 Opulnz Abode. All rights reserved.</p>
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
