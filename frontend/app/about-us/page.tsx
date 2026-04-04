import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Users, Building2, TrendingUp, Shield, Heart, Target, Sparkles, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Luxury Real Estate Experts',
  description: 'Discover Superluxere - India\'s premier luxury real estate platform. Learn about our mission, values, and commitment to delivering exceptional property experiences.',
  openGraph: {
    title: 'About Us - Luxury Real Estate Experts',
    description: 'Discover Superluxere - India\'s premier luxury real estate platform. Learn about our mission, values, and commitment to excellence.',
    type: 'website',
    url: 'https://superluxere.com/about-us',
  },
  alternates: {
    canonical: 'https://superluxere.com/about-us',
  },
};

const stats = [
  { label: 'Properties Listed', value: '500+', icon: Building2 },
  { label: 'Happy Clients', value: '1000+', icon: Users },
  { label: 'Years of Excellence', value: '10+', icon: Award },
  { label: 'Cities Covered', value: '15+', icon: TrendingUp },
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We believe in complete transparency in all our dealings, ensuring our clients make informed decisions with confidence.',
  },
  {
    icon: Heart,
    title: 'Client-Centric Approach',
    description: 'Your dreams are our priority. We go above and beyond to understand and fulfill your unique real estate needs.',
  },
  {
    icon: Target,
    title: 'Excellence in Service',
    description: 'From property selection to final handover, we maintain the highest standards of service at every step.',
  },
  {
    icon: Sparkles,
    title: 'Luxury Redefined',
    description: 'We curate only the finest properties that embody sophistication, elegance, and world-class amenities.',
  },
];

const team = [
  {
    name: 'Rajesh Malhotra',
    role: 'Founder & CEO',
    bio: '15+ years of experience in luxury real estate',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sales',
    bio: 'Expert in premium property consultations',
  },
  {
    name: 'Vikram Singh',
    role: 'Chief Investment Officer',
    bio: 'Specializes in high-value property investments',
  },
  {
    name: 'Anita Desai',
    role: 'Customer Relations',
    bio: 'Dedicated to exceptional client experiences',
  },
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    location: 'Delhi',
    rating: 5,
    date: 'December 2025',
    review: 'Superluxere made our dream of owning a luxury apartment in South Delhi a reality. Their team was professional, knowledgeable, and went above and beyond to ensure we found the perfect property. Highly recommended!',
    avatar: 'AM',
  },
  {
    name: 'Sneha Kapoor',
    location: 'Gurgaon',
    rating: 5,
    date: 'November 2025',
    review: 'Exceptional service from start to finish! The team at Superluxere understood exactly what we were looking for and showed us only properties that matched our criteria. The entire process was smooth and transparent.',
    avatar: 'SK',
  },
  {
    name: 'Rahul Sharma',
    location: 'Noida',
    rating: 5,
    date: 'October 2025',
    review: 'I was impressed by the professionalism and market knowledge of the Superluxere team. They helped me invest in a premium property in Noida and guided me through every legal and financial aspect. Truly trustworthy!',
    avatar: 'RS',
  },
  {
    name: 'Priya Malhotra',
    location: 'Mumbai',
    rating: 5,
    date: 'September 2025',
    review: 'Outstanding experience! Superluxere helped us find our perfect luxury home in Mumbai. Their attention to detail and commitment to client satisfaction is unmatched. Thank you for making this journey so memorable!',
    avatar: 'PM',
  },
  {
    name: 'Vikram Patel',
    location: 'Bangalore',
    rating: 5,
    date: 'August 2025',
    review: 'Best real estate consultancy I have worked with. The team is highly professional, responsive, and genuinely cares about finding the right property for their clients. Five stars all the way!',
    avatar: 'VP',
  },
  {
    name: 'Ananya Singh',
    location: 'Delhi NCR',
    rating: 5,
    date: 'July 2025',
    review: 'Superluxere exceeded all our expectations. From the initial consultation to the final handover, everything was handled with utmost care and professionalism. We absolutely love our new home!',
    avatar: 'AS',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/luxury-living.jpg"
            alt="About Superluxere"
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
              Our Story
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
              About <span className="text-gold">Superluxere</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-light">
              India's Premier Luxury Real Estate Platform
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2014, <span className="font-semibold text-gray-900">Superluxere</span> emerged from a simple yet powerful vision: to redefine luxury real estate in India by connecting discerning clients with the most exclusive properties across the nation.
              </p>
              <p>
                What started as a boutique consultancy in Delhi has grown into India's most trusted platform for luxury real estate, serving clients in over 15 major cities. Our journey has been marked by unwavering commitment to excellence, integrity, and innovation.
              </p>
              <p>
                Today, we take pride in being the bridge between extraordinary properties and extraordinary people. Every property in our portfolio is carefully curated to meet the highest standards of luxury, design, and lifestyle.
              </p>
              <p>
                Our team of seasoned professionals brings decades of combined experience in real estate, architecture, and investment advisory, ensuring that every client receives personalized guidance tailored to their unique aspirations.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-bg.png"
                alt="Luxury Property"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-gold to-gold-dark rounded-2xl -z-10 opacity-20" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/category-gurugram.jpg"
            alt="Luxury Properties"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-amber-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-10 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To empower individuals and families to discover and acquire their dream luxury homes through personalized service, expert guidance, and access to India's most exclusive properties. We strive to make the journey of finding a luxury home as exceptional as the destination itself.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black p-8 md:p-10 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Our Vision
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To be recognized as India's most trusted and innovative luxury real estate platform, setting new standards in property curation, client service, and market intelligence. We envision a future where every luxury home seeker's journey begins and ends with Superluxere.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experienced professionals dedicated to your success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-amber-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/category-delhi.jpg"
            alt="Why Choose Superluxere"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Why Choose Superluxere?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              What sets us apart in the luxury real estate market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Curated Excellence
              </h3>
              <p className="text-gray-300">
                Every property is handpicked and verified to meet our stringent quality standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Expert Guidance
              </h3>
              <p className="text-gray-300">
                Our team of specialists provides personalized advice at every step of your journey
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Trusted Process
              </h3>
              <p className="text-gray-300">
                Transparent transactions and legal compliance ensure peace of mind throughout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">5.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from real clients who trusted us with their luxury property journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                "{testimonial.review}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location} • {testimonial.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Link */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <span className="text-sm">Powered by</span>
            <svg className="w-16 h-6" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335" />
              <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05" />
              <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4" />
              <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853" />
              <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335" />
              <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4" />
            </svg>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
            alt="Find Your Dream Property"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Let us help you find the perfect luxury property that matches your vision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gold text-white font-semibold rounded-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-transparent border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-white transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
