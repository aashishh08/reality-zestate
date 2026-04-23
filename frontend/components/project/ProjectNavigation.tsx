'use client';

import { motion } from 'framer-motion';
import { Building2, Map, CreditCard, Sparkles, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'usp',
    label: 'USP',
    icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
    href: '#usp',
    description: 'Unique Selling Points'
  },
  {
    id: 'masterplan',
    label: 'Master Plan',
    icon: <Map className="w-6 h-6 sm:w-8 sm:h-8" />,
    href: '#location',
    description: 'Location & Layout'
  },
  {
    id: 'payment',
    label: 'Payment Plan',
    icon: <CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />,
    href: '#payment-plans',
    description: 'Flexible Options'
  },
  {
    id: 'amenities',
    label: 'Amenities',
    icon: <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />,
    href: '#amenities',
    description: 'Premium Facilities'
  },
  {
    id: 'layout',
    label: 'Floor Plans',
    icon: <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8" />,
    href: '#floor-plans',
    description: 'Unit Layouts'
  }
];

export default function ProjectNavigation() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = navigationItems.map(item => item.href.substring(1));
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (href: string) => {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100; // Offset for header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      id="project-navigation"
      className="relative z-10"
    >
      {/* Light beige background to match page and reference cards */}
      <nav className="bg-[#F5F2EC] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="grid w-full max-w-4xl grid-cols-2 gap-2 sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:gap-4 px-1">
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => handleClick(item.href)}
                    className={`
                      group relative flex flex-col items-center justify-center gap-2 sm:gap-3 
                      px-3 py-4 sm:px-8 sm:py-6 rounded-xl w-full sm:w-auto sm:min-w-[160px]
                      font-medium transition-all duration-300 sm:whitespace-nowrap
                      bg-white touch-manipulation
                      shadow-lg hover:shadow-2xl
                      transform hover:scale-105
                      ${isActive
                        ? 'ring-2 ring-[#C9A961] ring-offset-2'
                        : 'hover:bg-[#FDFCFA]'
                      }
                    `}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon Container with gradient background */}
                    <div className={`
                      relative p-3 rounded-full transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-br from-[#C9A961] to-[#A88B4A] shadow-md'
                        : 'bg-gradient-to-br from-[#F5F2EC] to-[#E8E5DC] group-hover:from-[#C9A961]/20 group-hover:to-[#A88B4A]/20'
                      }
                    `}>
                      <span className={`
                        block transition-colors duration-300
                        ${isActive ? 'text-white' : 'text-[#2C2416] group-hover:text-[#C9A961]'}
                      `}>
                        {item.icon}
                      </span>
                    </div>

                    {/* Label - golden when active, dark grey otherwise */}
                    <span className={`
                      text-sm sm:text-base font-bold tracking-wide transition-colors duration-300 text-center
                      ${isActive ? 'text-[#C9A961]' : 'text-[#2C2416] group-hover:text-[#C9A961]'}
                    `}>
                      {item.label}
                    </span>

                    {/* Description - subtle grey */}
                    <span className={`
                      hidden sm:block text-xs font-normal transition-colors duration-300 text-center
                      ${isActive ? 'text-[#6B6B6B]' : 'text-[#8B8B8B] group-hover:text-[#6B6B6B]'}
                    `}>
                      {item.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
