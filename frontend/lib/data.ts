import { Project } from "@/types";

export const projects: Project[] = [
    // Trending
    {
        id: "1",
        slug: "the-grand-arch-gurgaon",
        title: "The Grand Arch",
        location: "Golf Course Extension, Gurgaon",
        price: "₹ 4.5 Cr Onwards",
        image: "/images/project-1.jpg",
        category: "Trending",
        type: "4 BHK Luxury Apartments",
        details: {
            heroImage: "/images/project-1.jpg",
            subtitle: "Ultra-Luxury Residences on Golf Course Extension Road",
            introText: "Experience unparalleled luxury living at The Grand Arch, where architectural excellence meets modern comfort. This prestigious development offers world-class amenities and an exclusive lifestyle in the heart of Gurgaon's prime location.",
            highlights: {
                landArea: "15 Acres",
                possession: "Dec 2027",
                rera: "GGM/650/382/2023/111",
                configuration: "3, 4 & 5 BHK",
                priceRange: "₹ 4.5 Cr - ₹ 8.2 Cr"
            },
            gallery: [
                "/images/project-1.jpg",
                "/images/project-2.jpg",
                "/images/project-3.jpg",
                "/images/project-4.jpg",
            ],
            keyTakeaways: [
                "Low-Density Development - Only 4 Towers",
                "80% Open Green Spaces with Central Park",
                "5-Star Hotel-Like Concierge Services",
                "Private Elevator Lobbies for Each Residence",
                "Imported Marble & Premium Fittings",
                "Smart Home Automation System",
                "Valet Parking & Car Wash Services",
                "Exclusive Clubhouse with Spa & Wellness Center"
            ],
            whyInvest: [
                { title: "Prime Location Appreciation", subtitle: "Golf Course Road is Gurgaon's most prestigious address, consistently delivering 12-15% annual appreciation", icon: "location" },
                { title: "DLF Brand Legacy", subtitle: "With over 75 years of excellence, DLF has delivered more than 25 premium residential projects", icon: "award" },
                { title: "Rental Yield Potential", subtitle: "Luxury apartments on Golf Course Road command 3.5-4.5%, with 4 BHK units fetching ₹3-5 lakhs per month", icon: "trending" },
                { title: "Market Timing Advantage", subtitle: "Entering at the pre-launch stage provides significant pricing advantages. Historical data shows 25-30% appreciation by possession", icon: "calendar" }
            ],
            investmentAnalysis: `Investing in DLF The Dahlias represents a unique opportunity to own a piece of Gurgaon's most prestigious real estate. Located on the coveted Golf Course Road, this development combines the trusted legacy of DLF with an unmatched location that has consistently delivered exceptional returns for investors.

The Golf Course Road corridor has emerged as the undisputed premium residential destination in the National Capital Region. Over the past decade, properties in this micro-market have appreciated at an average annual rate of 12-15%, significantly outperforming other luxury corridors in Delhi NCR. The limited availability of developable land along this stretch ensures that supply remains constrained, creating a favorable demand-supply dynamic that supports sustained price growth.

DLF Limited brings over 75 years of real estate excellence to this project. As India's largest commercial real estate developer, DLF has delivered more than 25 premium residential projects across the country. Their proven track record in creating lifestyle-defining communities, combined with unparalleled post-sales service, ensures that your investment is backed by a name synonymous with quality and reliability.

From a rental perspective, The Dahlias offers compelling returns. Luxury apartments on Golf Course Road command among the highest rental yields in the NCR, typically ranging from 3.5-4.5%. Four-bedroom units in premium developments in this location fetch monthly rentals between ₹3-5 lakhs, ensuring strong cash flows for investors seeking rental income.

The pre-launch phase represents an optimal entry point from a pricing perspective. Historical analysis of DLF's premium projects indicates that properties purchased at the pre-launch stage have appreciated by 25-30% by the time of possession, delivering substantial capital gains to early investors. Combined with flexible payment plans and the developer's reputation for timely delivery, this timing advantage significantly enhances the overall investment proposition.`,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            overview: {
                heading: "Overview of the Project",
                content: [
                    "The Grand Arch redefines luxury living in Gurgaon with its iconic architecture and world-class amenities.",
                    "Strategically located on Golf Course Extension Road, it offers seamless connectivity to major business hubs and entertainment zones.",
                    "Designed by renowned architects, every residence is a masterpiece of modern elegance and functionality. connectivity to major business hubs and entertainment zones.",
                    "Designed by renowned architects, every residence is a masterpiece of modern elegance and functionality. connectivity to major business hubs and entertainment zones.",
                    "Designed by renowned architects, every residence is a masterpiece of modern elegance and functionality. connectivity to major business hubs and entertainment zones.",
                    "Designed by renowned architects, every residence is a masterpiece of modern elegance and functionality. "
                ],
                features: [
                    "5-Star Hotel-Like Services",
                    "80% Open Green Spaces",
                    "Private Clubhouse & Spa",
                    "Smart Home Automation"
                ]
            },
            amenities: [
                { name: "Swimming Pool", icon: "🏊", image: "/images/swimming-pool.jpg" },
                { name: "Gymnasium", icon: "💪", image: "/images/gym.jpg" },
                { name: "Clubhouse", icon: "🏛️", image: "/images/clubhouse.jpg" },
                { name: "Landscaped Gardens", icon: "🌳", image: "/images/landscape-garden.jpg" },
                { name: "Kids Play Area", icon: "🎪", image: "/images/kids-playarea.jpg" },
                { name: "Yoga Deck", icon: "🧘", image: "/images/yoga.jpg" },
                { name: "Indoor Games", icon: "🎮", image: "/images/indoor-games.jpg" },
                { name: "24/7 Security", icon: "🔒", image: "/images/security.jpg" }
            ],
            floorPlans: [
                {
                    type: "3 BHK",
                    superArea: "2200 sq.ft",
                    price: "₹ 4.5 Cr",
                    image: "/images/3bhk-plan.png"
                },
                {
                    type: "4 BHK",
                    superArea: "3200 sq.ft",
                    price: "₹ 6.2 Cr",
                    image: "/images/4bhk-plan.png"
                },
                {
                    type: "5 BHK Penthouse",
                    superArea: "5500 sq.ft",
                    price: "₹ 8.2 Cr",
                    image: "/images/5bhk-plan.png"
                }
            ],
            location: {
                address: "Golf Course Road",
                mapImage: "/images/grand-arch-location.jpg",
                nearby: [
                    {
                        category: "Educational Institutions",
                        icon: "education",
                        items: [
                            { name: "The Shri Ram School" },
                            { name: "Heritage School" },
                            { name: "GD Goenka World School" },
                            { name: "Pathways School" }
                        ]
                    },
                    {
                        category: "Healthcare Facilities",
                        icon: "healthcare",
                        items: [
                            { name: "Medanta - The Medicity" },
                            { name: "Fortis Memorial" },
                            { name: "Artemis Hospital" },
                            { name: "Max Hospital" }
                        ]
                    },
                    {
                        category: "Shopping & Entertainment",
                        icon: "shopping",
                        items: [
                            { name: "DLF Cyber Hub" },
                            { name: "Ambience Mall" },
                            { name: "MGF Metropolitan" },
                            { name: "South Point Mall" }
                        ]
                    }
                ],
                connectivity: [
                    { place: "IGI Airport", icon: "airport", time: "20 mins" },
                    { place: "Sector 54 Chowk", icon: "location", time: "5 mins" },
                    { place: "Business District", icon: "building", time: "15 mins" },
                    { place: "Highway", icon: "location", time: "10 mins" }
                ]
            },
            usp: [
                "Low-Density Development - Only 4 Towers",
                "80% Open Green Spaces with Central Park",
                "Concierge Services & Valet Parking",
                "Private Elevator Lobbies",
                "Imported Marble & Premium Fittings"
            ],
            specifications: [
                {
                    category: "Living / Dining / Lobby / Passage",
                    items: [
                        "Flooring: Imported Marble",
                        "Walls: Acrylic Emulsion Paint",
                        "Ceiling: Acrylic Emulsion Paint"
                    ]
                },
                {
                    category: "Bedrooms",
                    items: [
                        "Flooring: Laminated Wooden Flooring",
                        "Walls: Acrylic Emulsion Paint",
                        "Ceiling: Acrylic Emulsion Paint"
                    ]
                },
                {
                    category: "Kitchen",
                    items: [
                        "Flooring: Anti-skid Tiles",
                        "Fittings: Modular Kitchen with Chimney & Hob",
                        "Counter: Granite Counter Top"
                    ]
                },
                {
                    category: "Balconies",
                    items: [
                        "Flooring: Anti-skid Tiles",
                        "Railing: Glass Railing with SS Handrail"
                    ]
                }
            ],
            paymentPlans: [
                {
                    title: "Construction Linked Plan",
                    type: "CLP",
                    description: "Pay 10% on booking and the rest in installments linked to construction milestones."
                },
                {
                    title: "Down Payment Plan",
                    type: "DP",
                    description: "Pay 95% within 45 days of booking and get an attractive discount on the Basic Sale Price."
                },
                {
                    title: "Subvention Plan",
                    type: "No EMI till Possession",
                    description: "Pay 10% now and nothing till possession. Bank funds the rest."
                }
            ],
            faqs: [
                {
                    question: "What is DLF The Dahlias?",
                    answer: "DLF The Dahlias is an ultra-luxury residential development by DLF Limited, featuring 4, 5, and 6 BHK apartments on Golf Course Road, Sector 54, Gurgaon. The project spans 17 acres with 7 residential towers surrounding a 9-hole executive golf course.",
                    category: "General"
                },
                {
                    question: "Where is DLF The Dahlias located?",
                    answer: "Located on Golf Course Road in Sector 54, Gurgaon, DLF The Dahlias sits in one of the most prestigious addresses in the National Capital Region with excellent connectivity to business districts, airports, and lifestyle amenities.",
                    category: "General"
                },
                {
                    question: "What is the total land area of the project?",
                    answer: "The project spans across 17 acres of premium land with 80% open green spaces, including a central park and a 9-hole executive golf course.",
                    category: "General"
                },
                {
                    question: "How many towers and units are there?",
                    answer: "The project features 7 residential towers with a total of 280 ultra-luxury residences including 3 BHK, 4 BHK, and 5 BHK Penthouses.",
                    category: "Units"
                },
                {
                    question: "What are the unit configurations available?",
                    answer: "We offer 3 BHK, 4 BHK, and 5 BHK Penthouse configurations with super built-up areas ranging from 2200 sq.ft. to 5500 sq.ft.",
                    category: "Units"
                },
                {
                    question: "What are the available super built-up areas?",
                    answer: "3 BHK: 2200 sq.ft., 4 BHK: 3200 sq.ft., 5 BHK Penthouse: 5500 sq.ft. Each unit is designed for maximum luxury and comfort.",
                    category: "Units"
                },
                {
                    question: "What payment plans are available?",
                    answer: "We offer flexible payment plans including 20-40-40 (Standard), Progressive Payment Plan, and Construction-Linked Plan to suit your financial needs.",
                    category: "Payment"
                },
                {
                    question: "Is there a down payment option?",
                    answer: "Yes, we offer a down payment plan where you can pay 95% within 45 days of booking and receive an attractive discount on the Basic Sale Price.",
                    category: "Payment"
                },
                {
                    question: "What is the price range?",
                    answer: "Prices start from ₹4.5 Cr for 3 BHK and go up to ₹8.2 Cr for 5 BHK Penthouses. Contact our sales team for detailed pricing information.",
                    category: "Payment"
                },
                {
                    question: "When is the possession timeline?",
                    answer: "The project is scheduled for possession in December 2027. We maintain a strict timeline with transparent communication to all investors.",
                    category: "Possession"
                },
                {
                    question: "What is the RERA registration number?",
                    answer: "The project is RERA registered under GGM/650/382/2023/111, ensuring full transparency and compliance with regulatory standards.",
                    category: "Possession"
                },
                {
                    question: "What are the key amenities?",
                    answer: "The project features a 9-hole executive golf course, swimming pool, gymnasium, spa, clubhouse, landscaped gardens, yoga deck, kids play area, and 24/7 security.",
                    category: "General"
                }
            ],
            team: {
                members: [
                    {
                        role: "Architect",
                        name: "Hafeez Contractor",
                        color: "#3B82F6",
                        description: "India's most celebrated architect with over 40 years of experience designing iconic structures. His portfolio includes DLF Cyber City, Mumbai's tallest buildings, and numerous premium residential developments.",
                        achievements: [
                            "Designed 100+ million sq.ft. of real estate",
                            "Recipient of multiple architectural excellence awards",
                            "Known for sustainable and innovative designs"
                        ]
                    },
                    {
                        role: "Landscape Design",
                        name: "Paul Friedberg & Partners",
                        color: "#10B981",
                        description: "Internationally acclaimed landscape architecture firm based in New York. They bring decades of experience in creating award-winning outdoor spaces that harmonize with their surroundings.",
                        achievements: [
                            "50+ years of landscape design excellence",
                            "Projects across 30+ countries",
                            "Focus on sustainable and native landscaping"
                        ]
                    },
                    {
                        role: "Construction",
                        name: "DLF Home Developers",
                        color: "#F97316",
                        description: "The construction arm of DLF Limited, responsible for delivering some of India's most prestigious residential and commercial projects with uncompromising quality standards.",
                        achievements: [
                            "75+ years of construction expertise",
                            "25+ million sq.ft. delivered annually",
                            "ISO 9001:2015 certified processes"
                        ]
                    }
                ],
                highlights: [
                    {
                        title: "Global Expertise",
                        subtitle: "International design standards",
                        icon: "globe"
                    },
                    {
                        title: "Proven Track Record",
                        subtitle: "100+ million sq.ft. delivered",
                        icon: "checkmark"
                    },
                    {
                        title: "Award Winning",
                        subtitle: "Multiple industry accolades",
                        icon: "award"
                    }
                ]
            }
        }
    },
    {
        id: "2",
        slug: "sky-mansion-delhi",
        title: "Sky Mansion",
        location: "Chattarpur, South Delhi",
        price: "₹ 8.2 Cr Onwards",
        image: "/images/project-2.jpg",
        category: "Trending",
        type: "Ultra Luxury Penthouses",
    },
    {
        id: "3",
        slug: "aravalli-hills-estate",
        title: "Aravalli Hills Estate",
        location: "Sohna Road, Gurgaon",
        price: "₹ 3.1 Cr Onwards",
        image: "/images/project-3.jpg",
        category: "Trending",
        type: "3 & 4 BHK Green Living",
    },
    {
        id: "4",
        slug: "trump-tower-gurgaon",
        title: "Trump Tower",
        location: "Sector 65, Gurgaon",
        price: "₹ 6.5 Cr Onwards",
        image: "/images/project-4.jpg",
        category: "Trending",
        type: "Iconic Residences",
    },

    // Upcoming
    {
        id: "5",
        slug: "royal-estate-mumbai",
        title: "The Royal Estate",
        location: "Worli, Mumbai",
        price: "₹ 12.5 Cr Onwards",
        image: "/images/project-5.jpg",
        category: "Upcoming",
        type: "Sea View Residences",
    },
    {
        id: "6",
        slug: "cloud-9-bangalore",
        title: "Cloud 9 Towers",
        location: "Whitefield, Bangalore",
        price: "₹ 5.8 Cr Onwards",
        image: "/images/project-2.jpg",
        category: "Upcoming",
        type: "Sky Villas",
    },
    {
        id: "7",
        slug: "serenity-gardens-goa",
        title: "Serenity Gardens",
        location: "Assagao, Goa",
        price: "₹ 7.5 Cr Onwards",
        image: "/images/project-3.jpg",
        category: "Upcoming",
        type: "Portuguese Villas",
    },

    // Boutique
    {
        id: "8",
        slug: "the-manor-delhi",
        title: "The Manor",
        location: "Civil Lines, Delhi",
        price: "Price on Request",
        image: "/images/project-3.jpg",
        category: "Boutique",
        type: "Colonial Style Villas",
        description: "A limited collection of 12 bespoke villas inspired by colonial architecture."
    },
    {
        id: "9",
        slug: "villas-in-himalayas",
        title: "Villas in Himalayas",
        location: "Uttarakhand & Himachal Pradesh",
        price: "₹ 3.5 Cr Onwards",
        image: "/images/project-1.jpg",
        category: "Boutique",
        type: "Mountain Retreats",
        description: "Exclusive collection of luxury villas nestled in the pristine Himalayan mountains.",
        subProjects: [
            {
                id: "9a",
                slug: "eldeco-narendra-nagar-rishikesh",
                title: "Eldeco Narendra Nagar Rishikesh",
                location: "Narendra Nagar, Rishikesh",
                price: "₹ 3.5 Cr Onwards",
                image: "/images/project-2.jpg",
                type: "4 & 5 BHK Luxury Villas",
                description: "Serene villas overlooking the Ganges with panoramic mountain views."
            },
            {
                id: "9b",
                slug: "eldeco-terra-grande-sirmaur",
                title: "Eldeco Terra Grande Sirmaur",
                location: "Sirmaur, Himachal Pradesh",
                price: "₹ 4.2 Cr Onwards",
                image: "/images/project-3.jpg",
                type: "Luxury Mountain Villas",
                description: "Premium villas set amidst pine forests with stunning valley views."
            }
        ]
    },
];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find(p => p.slug === slug);
}

// Helper function to get all project slugs (for static path generation)
export function getAllProjectSlugs(): string[] {
    return projects.map(p => p.slug);
}
