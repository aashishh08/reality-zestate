export interface Project {
    id: string;
    slug: string; // URL-friendly identifier
    title: string;
    location: string;
    price: string;
    image: string;
    category: "Trending" | "Upcoming" | "Boutique" | "Exclusive";
    type: string;
    completionDate?: string;
    description?: string;
    subProjects?: {
        id: string;
        slug: string;
        title: string;
        location: string;
        price: string;
        image: string;
        type: string;
        description?: string;
    }[];


    // Detailed page content
    details?: {
        heroImage: string;
        subtitle: string;
        highlights: {
            landArea?: string;
            possession?: string;
            rera?: string;
            configuration?: string;
            priceRange?: string;
        };
        overview: {
            heading: string;
            content: string[];
            features?: string[];
        };
        amenities?: {
            name: string;
            icon: string;
            image?: string;
        }[];
        floorPlans?: {
            type: string;
            superArea: string;
            price: string;
            image: string;
        }[];
        masterPlan?: string;
        location?: {
            mapImage?: string;
            nearby: {
                category: string;
                items: { name: string; distance: string }[];
            }[];
        };
        usp?: string[];
        gallery?: string[];
        keyTakeaways?: string[];
        whyInvest?: string[];
        videoUrl?: string;
        specifications?: {
            category: string;
            items: string[];
        }[];
        paymentPlans?: {
            title: string;
            type: string;
            description: string;
        }[];
        faqs?: {
            question: string;
            answer: string;
        }[];
    };
}
