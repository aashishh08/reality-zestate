"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">
              OPULNZ <span className="text-gold">ABODE</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Redefining luxury real estate with a curated collection of the most exquisite properties. We connect distinguished buyers with exceptional homes.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-widest uppercase">Explore</h3>
            <ul className="space-y-4 text-zinc-400">
              {['Trending Projects', 'Upcoming Launches', 'Boutique Collection', 'Opulnz Exclusive', 'About Us'].map((item) => (
                 <li key={item}>
                   <Link href="#" className="hover:text-gold transition-colors">
                     {item}
                   </Link>
                 </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-widest uppercase">Locations</h3>
             <ul className="space-y-4 text-zinc-400">
              {['Gurgaon', 'South Delhi', 'Mumbai', 'Goa', 'Dubai', 'London'].map((item) => (
                 <li key={item}>
                   <Link href="#" className="hover:text-gold transition-colors">
                     Luxury Properties in {item}
                   </Link>
                 </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-widest uppercase">Get in Touch</h3>
            <ul className="space-y-6 text-zinc-400">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                <span>Level 18, One Horizon Center, Golf Course Road, Gurgaon, India</span>
              </li>
              <li className="flex items-center gap-4">
                 <Phone className="w-5 h-5 text-gold shrink-0" />
                 <a href="tel:+919999999999" className="hover:text-gold">+91 999 999 9999</a>
              </li>
               <li className="flex items-center gap-4">
                 <Mail className="w-5 h-5 text-gold shrink-0" />
                 <a href="mailto:concierge@opulnzabode.com" className="hover:text-gold">concierge@opulnzabode.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© 2026 Opulnz Abode. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
