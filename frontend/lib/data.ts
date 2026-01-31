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
                "Prime location on Golf Course Extension Road with excellent connectivity to Cyber City and IGI Airport",
                "Developed by renowned builder with 25+ years of track record in luxury real estate",
                "High appreciation potential - Area has shown 12% YoY growth in property values",
                "Limited inventory of only 200 residences ensuring exclusivity and privacy",
                "World-class amenities including Olympic-size swimming pool, tennis courts, and spa",
                "RERA approved project with transparent payment plans and assured possession timeline"
            ],
            videoUrl: "",
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
                mapImage: "/images/grand-arch-location.jpg",
                nearby: [
                    {
                        category: "Schools",
                        items: [
                            { name: "DPS International", distance: "2 km" },
                            { name: "The Shri Ram School", distance: "3.5 km" }
                        ]
                    },
                    {
                        category: "Hospitals",
                        items: [
                            { name: "Medanta Hospital", distance: "5 km" },
                            { name: "Artemis Hospital", distance: "6 km" }
                        ]
                    },
                    {
                        category: "Entertainment",
                        items: [
                            { name: "Ambience Mall", distance: "4 km" },
                            { name: "Kingdom of Dreams", distance: "7 km" }
                        ]
                    }
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
                    question: "What is the possession timeline?",
                    answer: "The project is scheduled for possession in December 2027."
                },
                {
                    question: "Is the project RERA approved?",
                    answer: "Yes, the project is RERA registered under GGM/650/382/2023/111."
                },
                {
                    question: "What are the payment plans available?",
                    answer: "We offer flexible payment plans including construction-linked and down payment schemes. Contact our sales team for detailed information."
                }
            ]
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
