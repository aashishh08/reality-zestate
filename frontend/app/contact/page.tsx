import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | Superluxere',
  description: 'Contact Superluxere for luxury real estate inquiries. Visit our office, call us, or send a message. We\'re here to help you find your dream property.',
  openGraph: {
    title: 'Contact Us - Get in Touch | Superluxere',
    description: 'Contact Superluxere for luxury real estate inquiries. Visit our office, call us, or send a message.',
    type: 'website',
    url: 'https://superluxere.com/contact',
  },
  alternates: {
    canonical: 'https://superluxere.com/contact',
  },
};

const contactInfo = {
  address: {
    street: 'DLF Cyber City, Phase 2',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    country: 'India',
  },
  phone: {
    primary: '+91 999 999 9999',
    secondary: '+91 888 888 8888',
  },
  email: {
    sales: 'sales@superluxere.com',
    support: 'support@superluxere.com',
  },
  hours: {
    weekdays: 'Monday - Friday: 9:00 AM - 7:00 PM',
    saturday: 'Saturday: 10:00 AM - 5:00 PM',
    sunday: 'Sunday: Closed',
  },
  social: [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/superluxere' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/superluxere' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/superluxere' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/superluxere' },
  ],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/category-noida.jpg"
            alt="Contact Superluxere"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative h-full flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-white/80 text-sm md:text-base font-medium tracking-[0.3em] mb-4 uppercase">
              We're Here to Help
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-light">
              Have questions about our luxury properties? We're here to help you find your dream home.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Address */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Visit Us</h3>
            <address className="text-gray-600 not-italic leading-relaxed">
              {contactInfo.address.street}<br />
              {contactInfo.address.city}, {contactInfo.address.state}<br />
              {contactInfo.address.pincode}<br />
              {contactInfo.address.country}
            </address>
          </div>

          {/* Phone */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Call Us</h3>
            <div className="space-y-2">
              <a
                href={`tel:${contactInfo.phone.primary.replace(/\s/g, '')}`}
                className="block text-gray-600 hover:text-gold transition-colors"
              >
                {contactInfo.phone.primary}
              </a>
              <a
                href={`tel:${contactInfo.phone.secondary.replace(/\s/g, '')}`}
                className="block text-gray-600 hover:text-gold transition-colors"
              >
                {contactInfo.phone.secondary}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Us</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${contactInfo.email.sales}`}
                className="block text-gray-600 hover:text-gold transition-colors break-all"
              >
                {contactInfo.email.sales}
              </a>
              <a
                href={`mailto:${contactInfo.email.support}`}
                className="block text-gray-600 hover:text-gold transition-colors break-all"
              >
                {contactInfo.email.support}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Office Hours</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{contactInfo.hours.weekdays}</p>
              <p>{contactInfo.hours.saturday}</p>
              <p className="text-gray-500">{contactInfo.hours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Map and Contact Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Google Maps */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.4956447956847!2d77.08773631508236!3d28.494347982468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1939f0000001%3A0x8f2d1e4f8f8f8f8f!2sDLF%20Cyber%20City%2C%20Phase%202%2C%20Sector%2024%2C%20Gurugram%2C%20Haryana%20122002!5e0!3m2!1sen!2sin!4v1642000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Superluxere Office Location"
            />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="+91 999 999 9999"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Property Inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-white font-semibold py-4 px-6 rounded-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Connect With Us
          </h2>
          <p className="text-gray-600 mb-8">
            Follow us on social media for the latest updates on luxury properties
          </p>
          <div className="flex justify-center gap-4">
            {contactInfo.social.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gold transition-all shadow-md hover:shadow-lg"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Find Your Dream Home"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Explore our curated collection of luxury properties across India
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
          >
            View Properties
          </Link>
        </div>
      </section>
    </main>
  );
}
