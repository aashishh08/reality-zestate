import { Project } from "./index";

export interface CategoryPage {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    introText: string;

    // City-wise sections
    citySections?: {
        cityName: string;
        citySlug: string;
        projects: Project[];
    }[];

    // USP Features
    features?: {
        title: string;
        icon: string;
        description?: string;
    }[];

    // Content sections
    contentSections?: {
        title: string;
        content: string;
        image?: string;
    }[];

    // Special offers
    specialOffer?: {
        title: string;
        description: string;
        validTill: string;
    };
}
