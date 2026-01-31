import { CategoryPage } from "@/types/category";
import { projects } from "./data";

export const categoryPages: CategoryPage[] = [
    {
        slug: "luxury-senior-living",
        title: "Luxury Senior Living in India",
        metaTitle: "Luxury Senior Living in India - Opulnz Abode",
        metaDescription: "Explore luxury senior living options in Gurgaon, Panchkula, Bangalore, Noida, and Hyderabad. Thoughtfully designed communities for a fulfilling lifestyle.",
        heroTitle: "Luxury Senior Living in India",
        heroSubtitle: "Curated Retirement Homes for the Well-Heeled",
        introText: "Explore luxury senior living options in Gurgaon, Panchkula, Bangalore, Noida, and Hyderabad. As life progresses, finding a supportive and vibrant community becomes essential for maintaining a fulfilling lifestyle. Senior living communities in India are thoughtfully designed to cater to the unique needs of older adults, offering a harmonious blend of comfort, security, and companionship.",

        citySections: [
            {
                cityName: "Gurugram",
                citySlug: "gurugram",
                projects: [
                    {
                        id: "sl-1",
                        slug: "advait-nirvana-country-sector-50-gurugram",
                        title: "Advait Nirvana Country Senior Living",
                        location: "Sector 50, Gurugram",
                        price: "₹ 1.2 Cr Onwards",
                        image: "/images/project-1.jpg",
                        category: "Exclusive",
                        type: "Senior Living Community",
                        description: "Premium senior living community with world-class healthcare and lifestyle amenities."
                    },
                    {
                        id: "sl-2",
                        slug: "max-antara-gurgaon-senior-living",
                        title: "Max Antara Gurgaon Senior Living",
                        location: "Sector 43, Gurugram",
                        price: "₹ 95 Lac Onwards",
                        image: "/images/project-2.jpg",
                        category: "Exclusive",
                        type: "Assisted Living Residences",
                        description: "India's first senior living community by Max Healthcare with 24/7 medical support."
                    }
                ]
            },
            {
                cityName: "Panchkula",
                citySlug: "panchkula",
                projects: [
                    {
                        id: "sl-3",
                        slug: "max-antara-panchkula-senior-living",
                        title: "Max Antara Panchkula Senior Living",
                        location: "Panchkula",
                        price: "₹ 75 Lac Onwards",
                        image: "/images/project-3.jpg",
                        category: "Exclusive",
                        type: "Retirement Homes",
                        description: "Serene senior living community in the foothills of the Himalayas with premium healthcare."
                    }
                ]
            },
            {
                cityName: "Bangalore",
                citySlug: "bangalore",
                projects: [
                    {
                        id: "sl-4",
                        slug: "max-antara-bangalore-devanahalli",
                        title: "Max Antara Bangalore Senior Living",
                        location: "Devanahalli, Bangalore",
                        price: "₹ 85 Lac Onwards",
                        image: "/images/project-4.jpg",
                        category: "Exclusive",
                        type: "Senior Living Apartments",
                        description: "Modern senior living community near Bangalore International Airport with resort-style amenities."
                    }
                ]
            },
            {
                cityName: "Hyderabad",
                citySlug: "hyderabad",
                projects: [
                    {
                        id: "sl-5",
                        slug: "max-antara-hyderabad-senior-living",
                        title: "Max Antara Hyderabad Senior Living",
                        location: "Gachibowli, Hyderabad",
                        price: "₹ 80 Lac Onwards",
                        image: "/images/project-5.jpg",
                        category: "Exclusive",
                        type: "Active Aging Community",
                        description: "Tech-enabled senior living with comprehensive wellness programs and healthcare facilities."
                    },
                    {
                        id: "sl-6",
                        slug: "silverglades-melia-first-citizen-delhi-ncr",
                        title: "Silverglades: The Melia First Citizen",
                        location: "Sohna, Gurugram",
                        price: "₹ 1.5 Cr Onwards",
                        image: "/images/project-1.jpg",
                        category: "Exclusive",
                        type: "Luxury Senior Living",
                        description: "Ultra-luxury senior living resort with 5-star hospitality and world-class amenities."
                    }
                ]
            },
            {
                cityName: "Noida",
                citySlug: "noida",
                projects: [
                    {
                        id: "sl-7",
                        slug: "antara-senior-living-noida",
                        title: "Antara Senior Living Noida",
                        location: "Sector 150, Noida",
                        price: "₹ 90 Lac Onwards",
                        image: "/images/project-2.jpg",
                        category: "Exclusive",
                        type: "Senior Care Residences",
                        description: "Integrated senior living community with assisted living and memory care facilities."
                    }
                ]
            }
        ],

        features: [
            {
                title: "Safe and Secure",
                icon: "🔒",
                description: "24/7 security with CCTV surveillance and gated community"
            },
            {
                title: "Emotional Wellness",
                icon: "💚",
                description: "Counseling services and community activities for mental well-being"
            },
            {
                title: "In-House 5 Star Services",
                icon: "⭐",
                description: "Concierge, housekeeping, and premium amenities"
            },
            {
                title: "24/7 Health Assistance",
                icon: "🏥",
                description: "On-call doctors, nurses, and emergency medical services"
            },
            {
                title: "Chauffeur Driven Cars Available",
                icon: "🚗",
                description: "Convenient transportation services for outings and appointments"
            },
            {
                title: "Specialised Therapies for Seniors",
                icon: "🧘",
                description: "Physiotherapy, yoga, and wellness programs tailored for seniors"
            }
        ],

        contentSections: [
            {
                title: "Health Assistance",
                content: "Our senior living communities provide comprehensive health assistance with 24/7 medical support, regular health check-ups, and emergency response systems. Trained healthcare professionals are always available to ensure the well-being of our residents."
            },
            {
                title: "Specialised Therapies",
                content: "We offer a range of specialized therapies including physiotherapy, occupational therapy, and cognitive enhancement programs. These therapies are designed to maintain and improve physical and mental health."
            },
            {
                title: "Emotional Wellness",
                content: "Mental health is as important as physical health. Our communities provide counseling services, social activities, and hobby clubs to ensure emotional well-being and a sense of belonging."
            },
            {
                title: "Luxury Living",
                content: "Experience resort-style living with premium amenities including swimming pools, fitness centers, libraries, and entertainment lounges. Every detail is designed for comfort and elegance."
            }
        ],

        specialOffer: {
            title: "Special Offer till January 31, 2026",
            description: "Book your luxury senior living apartment now and get exclusive benefits including waived registration fees and complimentary furnishing packages.",
            validTill: "January 31, 2026"
        }
    },

    // Placeholder for other categories
    {
        slug: "villas-himalayas",
        title: "Villas in Himalayas",
        metaTitle: "Luxury Villas in Himalayas - Opulnz Abode",
        metaDescription: "Let the Himalayas be your playground. Discover exclusive mountain villas.",
        heroTitle: "Villas in Himalayas",
        heroSubtitle: "Let the Himalayas be your playground",
        introText: "Escape to the serene beauty of the Himalayas with our curated collection of luxury villas.",
        citySections: [],
        features: []
    },

    {
        slug: "properties-delhi",
        title: "Luxury Properties in Delhi",
        metaTitle: "Luxury Properties in Delhi - Opulnz Abode",
        metaDescription: "Premium properties in the capital city.",
        heroTitle: "Delhi",
        heroSubtitle: "Premium Properties in the Capital",
        introText: "Discover luxury living in India's capital with our exclusive property collection.",
        citySections: [
            {
                cityName: "Delhi",
                citySlug: "delhi",
                projects: projects.filter(p => p.location.includes("Delhi"))
            }
        ],
        features: []
    },

    {
        slug: "properties-gurugram",
        title: "Luxury Properties in Gurugram",
        metaTitle: "Luxury Properties in Gurugram - Opulnz Abode",
        metaDescription: "Luxury living in Millennium City.",
        heroTitle: "Gurugram",
        heroSubtitle: "Luxury Living in Millennium City",
        introText: "Explore premium properties in Gurugram's most sought-after locations.",
        citySections: [
            {
                cityName: "Gurugram",
                citySlug: "gurugram",
                projects: projects.filter(p => p.location.includes("Gurgaon"))
            }
        ],
        features: []
    },

    {
        slug: "properties-noida",
        title: "Luxury Properties in Noida",
        metaTitle: "Luxury Properties in Noida - Opulnz Abode",
        metaDescription: "Modern residences in NCR.",
        heroTitle: "Noida",
        heroSubtitle: "Modern Residences in NCR",
        introText: "Find your dream home in Noida's premium residential projects.",
        citySections: [
            {
                cityName: "Noida",
                citySlug: "noida",
                projects: projects.filter(p => p.location.includes("Noida") || p.id === "2")
            }
        ],
        features: []
    }
];

// Helper functions
export function getCategoryBySlug(slug: string): CategoryPage | undefined {
    return categoryPages.find(c => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
    return categoryPages.map(c => c.slug);
}
