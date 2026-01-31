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
    icon: <Sparkles className="w-6 h-6" />,
    href: '#usp',
    description: 'Unique Selling Points'
  },
  {
    id: 'masterplan',
    label: 'Master Plan',
    icon: <Map className="w-6 h-6" />,
    href: '#location',
    description: 'Location & Layout'
  },
  {
    id: 'payment',
    label: 'Payment Plan',
    icon: <CreditCard className="w-6 h-6" />,
    href: '#payment-plans',
    description: 'Flexible Options'
  },
  {
    id: 'amenities',
    label: 'Amenities',
    icon: <Building2 className="w-6 h-6" />,
    href: '#amenities',
    description: 'Premium Facilities'
  },
  {
    id: 'layout',
    label: 'Floor Plans',
    icon: <LayoutGrid className="w-6 h-6" />,
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
      <nav className="bg-white/95 backdrop-blur-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Navigation Bar */}
          <div className="flex items-center justify-center overflow-x-auto py-2">
            <div className="flex gap-3 py-4">
              {navigationItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleClick(item.href)}
                    className={`
                      group relative flex flex-col items-center gap-2 
                      px-8 py-5 rounded-xl
                      font-medium transition-all duration-300 whitespace-nowrap
                      min-w-[140px]
                      ${isActive 
                        ? 'bg-gradient-to-br from-gold via-gold-light to-gold-dark shadow-lg shadow-gold/30' 
                        : 'bg-white hover:bg-gradient-to-br hover:from-gold/5 hover:to-gold-light/5 border-2 border-gray-200 hover:border-gold/40'
                      }
                    `}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Icon with animated background */}
                    <div className={`
                      relative p-2 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20' 
                        : 'bg-gold/10 group-hover:bg-gold/20'
                      }
                    `}>
                      <span className={`
                        block transition-all duration-300
                        ${isActive ? 'text-white' : 'text-gold-dark group-hover:text-gold'}
                      `}>
                        {item.icon}
                      </span>
                      
                      {/* Pulse effect for active item */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-white/30"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    {/* Label */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`
                        text-base font-bold tracking-wide transition-all duration-300
                        ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-gold-dark'}
                      `}>
                        {item.label}
                      </span>
                      
                      {/* Description - shows on hover or when active */}
                      <motion.span 
                        className={`
                          text-xs font-medium transition-all duration-300
                          ${isActive 
                            ? 'text-white/90 opacity-100' 
                            : 'text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-gold-dark'
                          }
                        `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                      >
                        {item.description}
                      </motion.span>
                    </div>
                    
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Shimmer effect on hover */}
                    <div className={`
                      absolute inset-0 rounded-xl overflow-hidden
                      ${!isActive && 'opacity-0 group-hover:opacity-100'}
                      transition-opacity duration-300
                    `}>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </div>
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
